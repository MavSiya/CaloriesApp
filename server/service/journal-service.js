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
  async addDishToMeal({ userId, memberId, date, typeOfMealId, dishId }) {
    let whereClause = '';
    let params = [];
  
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
  
    const [addedDish] = await db.pool.execute(
      `
      INSERT INTO Journal_Dish (dish_ID, ingredient_ID, journal_ID)
      VALUES (?, NULL, ?)
      `,
      [dishId, journalId]
    );
  
    return addedDish;
  }
  

  // Додати інгредієнт в прийом їжі
  async addIngredientToMeal({ userId, memberId, date, typeOfMealId, ingredientId }) {
    let whereClause = '';
    let params = [];
  
    // Определяем, кто использует этот журнал — пользователь или член семьи
    if (memberId != null) {
      whereClause = 'member_ID = ?';
      params = [date, typeOfMealId, memberId];
    } else {
      whereClause = 'user_ID = ?';
      params = [date, typeOfMealId, userId];
    }
  
    // Пытаемся найти существующую запись в журнале
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
      // Извлекаем день недели (id) из таблицы DayOfTheWeek
      const [dayOfWeekEntry] = await db.pool.execute(
        `
        SELECT id FROM DayOfTheWeek WHERE title = DAYNAME(?)
        `,
        [date]
      );
  
      const dayOfTheWeekId = dayOfWeekEntry.length > 0 ? dayOfWeekEntry[0].id : null;
  
      // Если день недели найден, вставляем новую запись в Journal
      const [newJournal] = await db.pool.execute(
        `
        INSERT INTO Journal (date, dayOfTheWeek_ID, typeOfMeal_ID, user_ID, member_ID)
        VALUES (?, ?, ?, ?, ?)
        `,
        [date, dayOfTheWeekId, typeOfMealId, memberId ? null : userId, memberId ?? null]
      );
      journalId = newJournal.insertId;
    }
  
    // Добавляем ингредиент в Journal_Dish
    const [addedIngredient] = await db.pool.execute(
      `
      INSERT INTO Journal_Dish (dish_ID, ingredient_ID, journal_ID)
      VALUES (NULL, ?, ?)
      `,
      [ingredientId, journalId]
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
  async calculateMealNutrients(userId, memberId, date, typeOfMealId) {
    let whereClause = '';
    let params = [];

    if (memberId != null) {
        whereClause = 'j.member_ID = ?';
        params = [date, typeOfMealId, memberId];
    } else {
        whereClause = 'j.user_ID = ?';
        params = [date, typeOfMealId, userId];
    }

    const [rows] = await db.pool.execute(
        `
        SELECT 
          COALESCE(SUM(db.calories), 0) + COALESCE(SUM(i.calories), 0) AS totalCalories,
          COALESCE(SUM(db.proteins), 0) + COALESCE(SUM(i.proteins), 0) AS totalProteins,
          COALESCE(SUM(db.fats), 0) + COALESCE(SUM(i.fats), 0) AS totalFats,
          COALESCE(SUM(db.carbs), 0) + COALESCE(SUM(i.carbs), 0) AS totalCarbs
        FROM Journal j
        LEFT JOIN Journal_Dish jd ON jd.journal_ID = j.id
        LEFT JOIN Dishes d ON jd.dish_ID = d.id
        LEFT JOIN DishBMR db ON d.id = db.dish_ID
        LEFT JOIN Ingredients i ON jd.ingredient_ID = i.id
        WHERE j.date = ? AND j.typeOfMeal_ID = ? AND ${whereClause}
        `,
        params
    );

    return rows[0];
}


  // Порахувати загальне КБЖУ на день
  // Порахувати загальне КБЖУ на день
async calculateTotalDailyNutrients(userId, memberId, date) {
  let whereClause = '';
  let params = [];

  if (memberId != null) {
    whereClause = 'j.member_ID = ?';
    params = [date, memberId];
  } else {
    whereClause = 'j.user_ID = ?';
    params = [date, userId];
  }

  const [rows] = await db.pool.execute(
    `
    SELECT 
      COALESCE(SUM(db.calories), 0) + COALESCE(SUM(i.calories), 0) AS totalCalories,
      COALESCE(SUM(db.proteins), 0) + COALESCE(SUM(i.proteins), 0) AS totalProteins,
      COALESCE(SUM(db.fats), 0) + COALESCE(SUM(i.fats), 0) AS totalFats,
      COALESCE(SUM(db.carbs), 0) + COALESCE(SUM(i.carbs), 0) AS totalCarbs
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

  
}

module.exports = new JournalService();
