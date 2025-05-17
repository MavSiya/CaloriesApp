import db from '../data-base/db.js';

class IngredientService {
    async addIngredientToDB(title, calories, proteins, fats, carbs) {
        await db.pool.execute(
            'INSERT INTO ingredients (title, calories, proteins, fats, carbs) VALUES (?, ?, ?, ?, ?)',
            [title, calories, proteins, fats, carbs],
        );
    }

    async findIngredientByName(title) {
        const [ingredient] = await db.pool.execute(
            'SELECT * FROM ingredients WHERE LOWER(title) LIKE LOWER(?) LIMIT 10',
            [`%${title}%`],
        );
        return ingredient;
    }

    async getIngredientIdByTitle(title) {
        const [rows] = await db.pool.execute('SELECT id FROM ingredients WHERE title = ?', [title]);

        if (rows.length === 0) {
            throw new Error(`Інгредієнт з назвою "${title}" не знайдено`);
        }

        return rows[0].id;
    }
}

export default new IngredientService();
