const db = require('../data-base/db');

class JournalService {
  async getTypeOfMealIdByTitle(title) {
    if (!title) {
      throw new Error('Не вказано назву прийому їжі');
    }
    const [rows] = await db.pool.execute(
      'SELECT id FROM TypesOfMeal WHERE LOWER(title) = LOWER(?)',
      [title]
    );

    if (rows.length === 0) {
      throw new Error(`Тип прийому їжі з назвою "${title}" не знайдено`);
    }

    return rows[0].id;
  }

  // Додати страву в прийом їжі
  async addDishToMeal({ userId, memberId, date, typeOfMealId, dishId, weight }) {
    let whereClause = '';
    let params = [];
    console.log({ date, typeOfMealId, userId, memberId, weight });

    if (memberId != null) {
      whereClause = 'member_ID = ?';
      params = [date, typeOfMealId, memberId];
    } else {
      whereClause = 'user_ID = ?';
      params = [date, typeOfMealId, userId];
    }
  
    const [journalEntry] = await db.pool.execute(
      `
      SELECT id FROM Journal 
      WHERE date = ? AND typeOfMeal_ID = ? AND ${whereClause}
      `,
      params
    );
  
    let journalId;
    if (journalEntry.length > 0) {
      journalId = journalEntry[0].id;
    } else {
      const [newJournal] = await db.pool.execute(
        `
        INSERT INTO Journal (date, dayOfTheWeek_ID, typeOfMeal_ID, user_ID, member_ID)
        VALUES (?, DAYOFWEEK(?), ?, ?, ?)
        `,
        [date, date, typeOfMealId, memberId ? null : userId, memberId ?? null]
      );
      journalId = newJournal.insertId;
    }
    const weightValue = weight != null ? weight : 0;

    const [addedDish] = await db.pool.execute(
      `
      INSERT INTO Journal_Dish (dish_ID, ingredient_ID, journal_ID, weight)
      VALUES (?, NULL, ?, ?)
      `,
      [dishId, journalId,weightValue]
    );
  
    return addedDish;
  }
  

  // Додати інгредієнт в прийом їжі
  async addIngredientToMeal({ userId, memberId, date, typeOfMealId, ingredientId, weight }) {
    let whereClause = '';
    let params = [];
    console.log({ date, typeOfMealId, userId, memberId, weight });
    if (memberId != null) {
      whereClause = 'member_ID = ?';
      params = [date, typeOfMealId, memberId];
    } else {
      whereClause = 'user_ID = ?';
      params = [date, typeOfMealId, userId];
    }
  
    const [journalEntry] = await db.pool.execute(
      `
      SELECT id FROM Journal 
      WHERE date = ? AND typeOfMeal_ID = ? AND ${whereClause}
      `,
      params
    );
  
    let journalId;
    if (journalEntry.length > 0) {
      journalId = journalEntry[0].id;
    } else {
      const [dayOfWeekEntry] = await db.pool.execute(
        `
        SELECT id FROM DayOfTheWeek WHERE title = DAYNAME(?)
        `,
        [date]
      );
      const dayOfTheWeekId = dayOfWeekEntry.length > 0 ? dayOfWeekEntry[0].id : null;
  
      const [newJournal] = await db.pool.execute(
        `
        INSERT INTO Journal (date, dayOfTheWeek_ID, typeOfMeal_ID, user_ID, member_ID)
        VALUES (?, ?, ?, ?, ?)
        `,
        [date, dayOfTheWeekId, typeOfMealId, memberId ? null : userId, memberId ?? null]
      );
      journalId = newJournal.insertId;
    }
  
    const [addedIngredient] = await db.pool.execute(
      `
      INSERT INTO Journal_Dish (dish_ID, ingredient_ID, journal_ID, weight)
      VALUES (NULL, ?, ?, ?)
      `,
      [ingredientId, journalId, weight]
    );
  
    return addedIngredient;
  }
  
  

  // Видалити страву або інгредієнт із прийому їжі
  async deleteFromMeal(journalDishId) {
    await db.pool.execute(
      `
      DELETE FROM Journal_Dish
      WHERE id = ?
      `,
      [journalDishId]
    );
    return { message: 'Deleted successfully' };
  }

  // Порахувати КБЖУ для одного прийому їжі
  async calculateMealNutrients(userId, memberId=null, date, typeOfMealId) {
    let userCondition;
    let userValue;
    console.log(memberId, date, typeOfMealId);
    if (memberId != null) {
      userCondition = 'j.member_ID = ?';
      userValue = memberId;
    } else {
      userCondition = 'j.user_ID = ?';
      userValue = userId;
    }
  
    const [rows] = await db.pool.execute(
      `
      SELECT 
        COALESCE(SUM(db.calories * jd.weight / 100), 0) + COALESCE(SUM(i.calories * jd.weight / 100), 0) AS totalCalories,
        COALESCE(SUM(db.proteins * jd.weight / 100), 0) + COALESCE(SUM(i.proteins * jd.weight / 100), 0) AS totalProteins,
        COALESCE(SUM(db.fats * jd.weight / 100), 0) + COALESCE(SUM(i.fats * jd.weight / 100), 0) AS totalFats,
        COALESCE(SUM(db.carbs * jd.weight / 100), 0) + COALESCE(SUM(i.carbs * jd.weight / 100), 0) AS totalCarbs
      FROM Journal j
      LEFT JOIN Journal_Dish jd ON jd.journal_ID = j.id
      LEFT JOIN Dishes d ON jd.dish_ID = d.id
      LEFT JOIN DishBMR db ON d.id = db.dish_ID
      LEFT JOIN Ingredients i ON jd.ingredient_ID = i.id
      WHERE j.date = ? AND j.typeOfMeal_ID = ? AND ${userCondition}
      `,
      [date, typeOfMealId, userValue]
    );
  
    return rows[0];
  }
  
  // Порахувати загальне КБЖУ на день
  async calculateTotalDailyNutrients(userId, memberId, date) {
    let whereClause = '';
    let params = [];
    const formattedDate = new Date(date).toISOString().slice(0, 10); 
    if (memberId != null) {
      whereClause = 'j.member_ID = ?';
      params = [formattedDate, memberId];
    } else {
      whereClause = 'j.user_ID = ?';
      params = [formattedDate, userId];
    }
  
    const [rows] = await db.pool.execute(
      `
      SELECT 
        COALESCE(SUM(db.calories * jd.weight / 100), 0) + COALESCE(SUM(i.calories * jd.weight / 100), 0) AS totalCalories,
        COALESCE(SUM(db.proteins * jd.weight / 100), 0) + COALESCE(SUM(i.proteins * jd.weight / 100), 0) AS totalProteins,
        COALESCE(SUM(db.fats * jd.weight / 100), 0) + COALESCE(SUM(i.fats * jd.weight / 100), 0) AS totalFats,
        COALESCE(SUM(db.carbs * jd.weight / 100), 0) + COALESCE(SUM(i.carbs * jd.weight / 100), 0) AS totalCarbs
      FROM Journal j
      LEFT JOIN Journal_Dish jd ON jd.journal_ID = j.id
      LEFT JOIN Dishes d ON jd.dish_ID = d.id
      LEFT JOIN DishBMR db ON d.id = db.dish_ID
      LEFT JOIN Ingredients i ON jd.ingredient_ID = i.id
      WHERE j.date = ? AND ${whereClause}
      `,
      params
    );
  
    return rows[0];
  }
  
  async getMealByDateAndType({ date, typeOfMealId, userId, memberId }) {
    const whereClause = memberId ? 'member_ID = ?' : 'user_ID = ?';
    const idValue = memberId ?? userId;

    const [journalRows] = await db.pool.execute(
      `SELECT id FROM Journal WHERE date = ? AND typeOfMeal_ID = ? AND ${whereClause}`,
      [date, typeOfMealId, idValue]
    );

    if (journalRows.length === 0) {
      return [];
    }

    const journalId = journalRows[0].id;

    const [mealItems] = await db.pool.execute(
      `
      SELECT JD.id, JD.weight, D.id as dishId, D.title as dishTitle,
             I.id as ingredientId, I.title as ingredientTitle
      FROM Journal_Dish JD
      LEFT JOIN Dishes D ON JD.dish_ID = D.id
      LEFT JOIN Ingredients I ON JD.ingredient_ID = I.id
      WHERE JD.journal_ID = ?
      `,
      [journalId]
    );

    return mealItems;
  }

  
}

module.exports = new JournalService();
