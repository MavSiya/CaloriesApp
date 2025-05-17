import db from '../data-base/db.js';

class MenuService {
  // Додати страву або інгредієнт до меню
  async addDishOrIngredientToMenu({ dayOfWeekId, typeOfMealId, userId, dishId = null, ingredientId = null,weight=null }) {

    const [menu] = await db.pool.execute(
      `
      SELECT id FROM MenuPerWeek
      WHERE dayOfTheWeek_ID = ? AND typesOfMeal_ID = ? AND user_ID = ?
      `,
      [dayOfWeekId, typeOfMealId, userId]
    );

    let menuId;
    if (menu.length > 0) {
      menuId = menu[0].id;
    } else {
      const [newMenu] = await db.pool.execute(
        `
        INSERT INTO MenuPerWeek (dayOfTheWeek_ID, typesOfMeal_ID, user_ID)
        VALUES (?, ?, ?)
        `,
        [dayOfWeekId, typeOfMealId, userId]
      );
      menuId = newMenu.insertId;
    }

    await db.pool.execute(
      `
      INSERT INTO MPW_Dish (dish_ID, ingredient_ID, menuPerWeek_ID, weight_ingredient)
      VALUES (?, ?, ?, ?)
      `,
      [dishId, ingredientId, menuId,weight]
    );

    return { message: 'Added successfully to menu' };
  }

  // Отримати меню для користувача
  async getMenu(userId) {
    const [menu] = await db.pool.execute(
      `
      SELECT mpw.id, d.title AS dishTitle, i.title AS ingredientTitle, mpw.weight_ingredient, 
             dow.title AS day, tm.title AS meal
      FROM MPW_Dish mpw
      JOIN MenuPerWeek mp ON mp.id = mpw.menuPerWeek_ID
      LEFT JOIN Dishes d ON d.id = mpw.dish_ID
      LEFT JOIN Ingredients i ON i.id = mpw.ingredient_ID
      JOIN DayOfTheWeek dow ON dow.id = mp.dayOfTheWeek_ID
      JOIN TypesOfMeal tm ON tm.id = mp.typesOfMeal_ID
      WHERE mp.user_ID = ?
      ORDER BY mp.dayOfTheWeek_ID, mp.typesOfMeal_ID
      `,
      [userId]
    );
    return menu;
  }

  // Видалити елемент з меню
  async deleteFromMenu(mpwDishId) {
    await db.pool.execute(
      `DELETE FROM MPW_Dish WHERE id = ?`,
      [mpwDishId]
    );
    return { message: 'Removed from menu' };
  }

  // Оновити запис в меню (редагування)
  async updateMenuItem(mpwDishId, dishId = null, ingredientId = null) {
    if (ingredientId !== null) {
      const [rows] = await db.pool.execute(
        `SELECT id FROM Ingredients WHERE id = ?`,
        [ingredientId]
      );
      if (rows.length === 0) {
        throw new Error(`Ingredient with ID ${ingredientId} does not exist.`);
      }
    }
    await db.pool.execute(
      `
      UPDATE MPW_Dish
      SET dish_ID = ?, ingredient_ID = ?
      WHERE id = ?
      `,
      [dishId, ingredientId, mpwDishId]
    );
    return { message: 'Menu item updated successfully' };
  }

  // Отримати список продуктів зі всіх страв і інгредієнтів у меню
  async getAggregatedIngredientsList(userId) {
    const [ingredients] = await db.pool.execute(
      `
      SELECT ing.id, ing.title, SUM(ing.weight) AS totalWeight
      FROM (
        -- Прямі інгредієнти з меню
        SELECT i.id, i.title, mpw.weight_ingredient AS weight
        FROM MPW_Dish mpw
        JOIN MenuPerWeek mp ON mp.id = mpw.menuPerWeek_ID
        JOIN Ingredients i ON i.id = mpw.ingredient_ID
        WHERE mp.user_ID = ?
  
        UNION ALL
  
        -- Інгредієнти зі страв у меню
        SELECT i.id, i.title, di.weight_grams AS weight
        FROM MPW_Dish mpw
        JOIN MenuPerWeek mp ON mp.id = mpw.menuPerWeek_ID
        JOIN Dishes d ON d.id = mpw.dish_ID
        JOIN Dish_Ingredient di ON di.dish_ID = d.id
        JOIN Ingredients i ON i.id = di.ingredient_ID
        WHERE mp.user_ID = ?
      ) AS ing
      GROUP BY ing.id, ing.title
      ORDER BY ing.title
      `,
      [userId, userId]
    );
  
    return ingredients;
  }
  
}

export default new MenuService();
