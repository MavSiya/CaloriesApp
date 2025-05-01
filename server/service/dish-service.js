const db = require('../data-base/db');

class DishService {
  async getTypeIdByName(typeName) {
    const [rows] = await db.pool.execute(
      'SELECT id FROM TypesOfDish WHERE title = ?',
      [typeName]
    );
  
    if (!rows.length) {
      throw new Error(`Тип страви "${typeName}" не знайдено`);
    }
  
    return rows[0].id;
  }
  
  async createDish(title, userId, typeName) {
    const typeID = await this.getTypeIdByName(typeName);
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

  async findDishByName(title, userId) {
    const [dishes] = await db.pool.execute(
      'SELECT * FROM Dishes WHERE title LIKE ? AND user_ID = ?',
      [`%${title}%`, userId]
    );
    return dishes;
  }
}

module.exports = new DishService();
