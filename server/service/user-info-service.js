import db from '../data-base/db.js';

// Функція для розрахунке КБЖУ
export function calculateBMR(weight, height, age, sex, activityKoef, goalPercent) {
    const bmr =
        sex === 'male'
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;

    const calories = Math.round(bmr * activityKoef * goalPercent);
    const proteins = Math.round((calories * 0.3) / 4);
    const fats = Math.round((calories * 0.3) / 9);
    const carbs = Math.round((calories * 0.4) / 4);

    return { calories, proteins, fats, carbs };
}

// Створення даних про користувача
export async function createUserInfo(
    userId,
    { activityId, goalId, weight, height, dateOfBirth, sex, name },
) {
    const connection = await db.getConnection();
    try {
        const birthYear = new Date(dateOfBirth).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;

        const [activityRow] = await connection.query(`SELECT koef FROM Activities WHERE id = ?`, [
            activityId,
        ]);
        const activityKoef = activityRow[0]?.koef || 1.2;

        const [goalRow] = await connection.query(`SELECT percent FROM Goals WHERE id = ?`, [
            goalId,
        ]);
        const goalPercent = goalRow[0]?.percent || 1.0;

        const { calories, proteins, fats, carbs } = this.calculateBMR(
            weight,
            height,
            age,
            sex,
            activityKoef,
            goalPercent,
        );

        await connection.query(
            `
          INSERT INTO Users_Info (
            user_ID, activity_ID, goal_ID, weight, height, dateOfBirth,
            calories, proteins, fats, carbs, sex, name
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `,
            [
                userId,
                activityId,
                goalId,
                weight,
                height,
                dateOfBirth,
                calories,
                proteins,
                fats,
                carbs,
                sex,
                name,
            ],
        );

        return {
            userId,
            activityId,
            goalId,
            weight,
            height,
            dateOfBirth,
            calories,
            proteins,
            fats,
            carbs,
            sex,
            name,
        };
    } finally {
        connection.release();
    }
}

// Оновлення даних
export async function updateUserInfo(userId, data) {
    const fields = [];
    const values = [];

    const currentData = await this.getUserInfo(userId);

    const activityId = data.activityId ?? currentData.activity_ID;
    const goalId = data.goalId ?? currentData.goal_ID;
    const weight = data.weight ?? currentData.weight;
    const height = data.height ?? currentData.height;
    const dateOfBirth = data.dateOfBirth ?? currentData.dateOfBirth;
    const sex = data.sex ?? currentData.sex;
    const name = data.name ?? currentData.name;

    // Вік
    const birthYear = new Date(dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    const connection = await db.getConnection();
    try {
        const [activityRow] = await connection.query(`SELECT koef FROM Activities WHERE id = ?`, [
            activityId,
        ]);
        const activityKoef = activityRow[0]?.koef || 1.2;

        const [goalRow] = await connection.query(`SELECT percent FROM Goals WHERE id = ?`, [
            goalId,
        ]);
        const goalPercent = goalRow[0]?.percent || 1.0;

        const { calories, proteins, fats, carbs } = this.calculateBMR(
            weight,
            height,
            age,
            sex,
            activityKoef,
            goalPercent,
        );

        // Поля для оновлення
        fields.push(
            'activity_ID = ?',
            'goal_ID = ?',
            'weight = ?',
            'height = ?',
            'dateOfBirth = ?',
            'sex = ?',
            'name = ?',
        );
        values.push(activityId, goalId, weight, height, dateOfBirth, sex, name);

        // Оновлення КБЖУ
        fields.push('calories = ?', 'proteins = ?', 'fats = ?', 'carbs = ?');
        values.push(calories, proteins, fats, carbs);

        const query = `UPDATE Users_Info SET ${fields.join(', ')} WHERE user_ID = ?`;
        values.push(userId);

        const [result] = await connection.execute(query, values);
        return result;
    } finally {
        connection.release();
    }
}

// Отримання інформації про користувача
export async function getUserInfo(userId) {
    const connection = await db.getConnection();
    try {
        const [rows] = await connection.query(`SELECT * FROM Users_Info WHERE user_ID = ?`, [
            userId,
        ]);
        return rows[0] || null;
    } finally {
        connection.release();
    }
}

export async function getDailyTargets(userId, memberId = null) {
    if (memberId != null) {
        const [rows] = await db.query(
            `
            SELECT calories, proteins, fats, carbs
            FROM Members_Info
            WHERE member_ID = ?
            `,
            [memberId],
        );

        return rows[0];
    } else {
        const [rows] = await db.query(
            `
            SELECT calories, proteins, fats, carbs
            FROM Users_Info
            WHERE user_ID = ?
            `,
            [userId],
        );

        return rows[0];
    }
}
