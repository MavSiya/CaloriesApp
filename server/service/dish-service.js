const db = require('../data-base/db');

class DishService {
  async getTypeIdByName(typeName) {
    if (!typeName) {
      throw new Error("Тип страви не вказано");
    }
    const [rows] = await db.pool.execute(
      'SELECT id FROM TypesOfDish WHERE title = ?',
      [typeName]
    );
  
    if (!rows.length) {
      throw new Error(`Тип страви "${typeName}" не знайдено`);
    }
  
    return rows[0].id;
  }
  
  async createDish(title, userId, typeID) {
    console.log("Вот что попадает насервер в создать блюдо",title, userId, typeID);
    const [result] = await db.pool.execute(
      'INSERT INTO Dishes (title, user_ID, type_ID) VALUES (?, ?, ?)',
      [title, userId, typeID]
    );
    return { id: result.insertId, title, userId,typeID };
  }

  async deleteDish(dishId) {
    await db.pool.execute('DELETE FROM Dishes WHERE id = ?', [dishId]);
  }

  async updateDishBMR(dishId, { calories, proteins, fats, carbs }) {
    await db.pool.execute(
      `UPDATE DishBMR 
       SET calories = ?, proteins = ?, fats = ?, carbs = ?
       WHERE id = ?`,
      [calories, proteins, fats, carbs, dishId]
    );
  }

  async getAllDishes(userId) {
    const [dishes] = await db.pool.execute(
      'SELECT * FROM Dishes WHERE user_ID = ?',
      [userId]
    );
    return dishes;
  }

  async getAllDishesWithBmr(userId) {
    const [dishes] = await db.pool.execute(
      ` SELECT d.id, d.title, d.user_ID, t.title AS type, b.calories, b.proteins, b.fats, b.carbs
       FROM Dishes d
       LEFT JOIN DishBMR b ON d.id = b.dish_ID
       right JOIN typesofdish t ON d.type_ID = t.id
       WHERE d.user_ID = ?`,
      [userId]
    );
    return dishes;
  }

  async findDishByName(title, userId) {
    const [dishes] = await db.pool.execute(
      'SELECT * FROM Dishes WHERE title LIKE ? AND user_ID = ?',
      [`%${title}%`, userId]
    );
    return dishes;
  }

  async getAllDishTypes() {
    const [rows] = await db.pool.execute(
      'SELECT * FROM TypesOfDish'
    );
    return rows;
  }

  // dishService.js
async  getDishTypeById(typeId) {
  const [rows] = await db.pool.execute(
    'SELECT * FROM TypesOfDish WHERE id = ?',
    [typeId]
  );
  return rows[0]; 
}

}

module.exports = new DishService();
