import db from '../data-base/db.js';

export async function addIngredientToDB(title, calories, proteins, fats, carbs) {
    await db.execute(
        'INSERT INTO ingredients (title, calories, proteins, fats, carbs) VALUES (?, ?, ?, ?, ?)',
        [title, calories, proteins, fats, carbs],
    );
}

export async function findIngredientByName(title) {
    const [ingredient] = await db.execute(
        'SELECT * FROM ingredients WHERE LOWER(title) LIKE LOWER(?) LIMIT 10',
        [`%${title}%`],
    );
    return ingredient;
}

export async function getIngredientIdByTitle(title) {
    const [rows] = await db.execute('SELECT id FROM ingredients WHERE title = ?', [title]);

    if (rows.length === 0) {
        throw new Error(`Інгредієнт з назвою "${title}" не знайдено`);
    }

    return rows[0].id;
}