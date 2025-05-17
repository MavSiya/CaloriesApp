import db from '../data-base/db.js';
import ingredientService from './ingredient-service.js';

class DishCompositionService {
  async addIngredientToDish(dishId, ingredientTitle, weight_grams) {
console.log(ingredientTitle);
    const ingredient_ID = await ingredientService.getIngredientIdByTitle(ingredientTitle);
  
    await db.pool.execute(
      'INSERT INTO dish_ingredient (dish_ID, ingredient_ID, weight_grams) VALUES (?, ?, ?)',
      [dishId, ingredient_ID, weight_grams]
    );
    const totalBMR = await this.calculateBMR(dishId);
   // Проверить, существует ли запись в DishBMR для этого блюда
   const [bmrRows] = await db.pool.execute(
    'SELECT id FROM DishBMR WHERE dish_ID = ?',
    [dishId]
  );

  // Если записи нет, создаём её
  if (bmrRows.length === 0) {
    await db.pool.execute(
      'INSERT INTO DishBMR (dish_ID, calories, proteins, fats, carbs) VALUES (?, ?, ?, ?, ?)',
      [dishId, totalBMR.calories, totalBMR.proteins, totalBMR.fats, totalBMR.carbs]
    );
  } else {
    // Если запись есть, обновляем её
    await db.pool.execute(
      'UPDATE DishBMR SET calories = ?, proteins = ?, fats = ?, carbs = ? WHERE dish_ID = ?',
      [totalBMR.calories, totalBMR.proteins, totalBMR.fats, totalBMR.carbs, dishId]
    );
  }
}

async updateIngredientWeight(dishId, ingredientTitle, weight) {
  const ingredientId = await ingredientService.getIngredientIdByTitle(ingredientTitle);
  await db.pool.execute(
    'UPDATE dish_ingredient SET weight_grams = ? WHERE dish_ID = ? AND ingredient_ID = ?',
    [weight, dishId, ingredientId]
  );

  // Пересчитать BMR блюда
  const totalBMR = await this.calculateBMR(dishId);

  // Проверить, существует ли запись в DishBMR для этого блюда
  const [bmrRows] = await db.pool.execute(
    'SELECT id FROM DishBMR WHERE dish_ID = ?',
    [dishId]
  );

  // Если записи нет, создаём её
  if (bmrRows.length === 0) {
    await db.pool.execute(
      'INSERT INTO DishBMR (dish_ID, calories, proteins, fats, carbs) VALUES (?, ?, ?, ?, ?)',
      [dishId, totalBMR.calories, totalBMR.proteins, totalBMR.fats, totalBMR.carbs]
    );
  } else {
    // Если запись есть, обновляем её
    await db.pool.execute(
      'UPDATE DishBMR SET calories = ?, proteins = ?, fats = ?, carbs = ? WHERE dish_ID = ?',
      [totalBMR.calories, totalBMR.proteins, totalBMR.fats, totalBMR.carbs, dishId]
    );
  }
}

// Удалить ингредиент из блюда
async removeIngredientFromDish(dishId, ingredientTitle) {
  const ingredientId = await ingredientService.getIngredientIdByTitle(ingredientTitle);
  await db.pool.execute(
    'DELETE FROM dish_ingredient WHERE dish_ID = ? AND ingredient_ID = ?',
    [dishId, ingredientId]
  );

  // Пересчитать BMR блюда
  const totalBMR = await this.calculateBMR(dishId);

  // Проверить, существует ли запись в DishBMR для этого блюда
  const [bmrRows] = await db.pool.execute(
    'SELECT id FROM DishBMR WHERE dish_ID = ?',
    [dishId]
  );

  // Если записи нет, создаём её
  if (bmrRows.length === 0) {
    await db.pool.execute(
      'INSERT INTO DishBMR (dish_ID, calories, proteins, fats, carbs) VALUES (?, ?, ?, ?, ?)',
      [dishId, totalBMR.calories, totalBMR.proteins, totalBMR.fats, totalBMR.carbs]
    );
  } else {
    // Если запись есть, обновляем её
    await db.pool.execute(
      'UPDATE DishBMR SET calories = ?, proteins = ?, fats = ?, carbs = ? WHERE dish_ID = ?',
      [totalBMR.calories, totalBMR.proteins, totalBMR.fats, totalBMR.carbs, dishId]
    );
  }
}

  async addIngredientToDB(title, calories, proteins, fats, carbs) {
    await db.pool.execute(
      'INSERT INTO ingredients (title, calories, proteins, fats, carbs) VALUES (?, ?, ?, ?, ?)',
      [title, calories, proteins, fats, carbs]
    );
  }

   async findIngredientByName(title, userId) {
      const [dishes] = await db.pool.execute(
        'SELECT * FROM ingredients WHERE title LIKE ?',
        [title]
      );
      return dishes;
    }


  async calculateBMR(dishId) {
    const [rows] = await db.pool.execute(`
      SELECT di.weight_grams, p.calories, p.proteins, p.fats, p.carbs
      FROM Dish_Ingredient di
      JOIN Ingredients p ON di.ingredient_ID = p.id
      WHERE di.dish_ID = ?
    `, [dishId]);

    let total = { calories: 0, proteins: 0, fats: 0, carbs: 0 };

    rows.forEach(row => {
      const factor = row.weight_grams / 100;
      total.calories += row.calories * factor;
      total.proteins += row.proteins * factor;
      total.fats += row.fats * factor;
      total.carbs += row.carbs * factor;
    });

    // Округлення до цілих
    Object.keys(total).forEach(key => {
      total[key] = Math.round(total[key]);
    });

    return total;
  }
}

export default new DishCompositionService();
