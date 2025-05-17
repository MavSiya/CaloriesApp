import db from '../data-base/db.js';

export async function getTypeIdByName(typeName) {
    if (!typeName) {
        throw new Error('Тип страви не вказано');
    }
    const [rows] = await db.execute('SELECT id FROM TypesOfDish WHERE title = ?', [typeName]);

    if (!rows.length) {
        throw new Error(`Тип страви "${typeName}" не знайдено`);
    }

    return rows[0].id;
}

export async function createDish(title, userId, typeID) {
    console.log('Вот что попадает насервер в создать блюдо', title, userId, typeID);
    const [result] = await db.execute(
        'INSERT INTO Dishes (title, user_ID, type_ID) VALUES (?, ?, ?)',
        [title, userId, typeID],
    );
    return { id: result.insertId, title, userId, typeID };
}

export async function deleteDish(dishId) {
    await db.execute('DELETE FROM Dishes WHERE id = ?', [dishId]);
}

export async function updateDishBMR(dishId, { calories, proteins, fats, carbs }) {
    await db.execute(
        `UPDATE DishBMR 
       SET calories = ?, proteins = ?, fats = ?, carbs = ?
       WHERE id = ?`,
        [calories, proteins, fats, carbs, dishId],
    );
}

export async function getAllDishes(userId) {
    const [dishes] = await db.execute('SELECT * FROM Dishes WHERE user_ID = ?', [userId]);
    return dishes;
}

export async function getAllDishesWithBmr(userId) {
    const [dishes] = await db.execute(
        ` SELECT d.id, d.title, d.user_ID, t.title AS type, b.calories, b.proteins, b.fats, b.carbs
       FROM Dishes d
       LEFT JOIN DishBMR b ON d.id = b.dish_ID
       right JOIN typesofdish t ON d.type_ID = t.id
       WHERE d.user_ID = ?`,
        [userId],
    );
    return dishes;
}

export async function findDishByName(title, userId) {
    const [dishes] = await db.execute(
        'SELECT * FROM Dishes WHERE title LIKE ? AND user_ID = ?',
        [`%${title}%`, userId],
    );
    return dishes;
}

export async function getAllDishTypes() {
    const [rows] = await db.execute('SELECT * FROM TypesOfDish');
    return rows;
}

// dishService.js
export async function getDishTypeById(typeId) {
    const [rows] = await db.execute('SELECT * FROM TypesOfDish WHERE id = ?', [typeId]);
    return rows[0];
}
