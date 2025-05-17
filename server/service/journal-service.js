import db from '../data-base/db.js';

class JournalService {
    async getTypeOfMealIdByTitle(title) {
        if (!title) {
            throw new Error('Не вказано назву прийому їжі');
        }
        const [rows] = await db.pool.execute(
            'SELECT id FROM TypesOfMeal WHERE LOWER(title) = LOWER(?)',
            [title],
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
        console.log({ userId, memberId });
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
            params,
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
                [date, date, typeOfMealId, memberId ? null : userId, memberId ?? null],
            );
            journalId = newJournal.insertId;
        }
        const weightValue = weight != null ? weight : 0;

        const [addedDish] = await db.pool.execute(
            `
      INSERT INTO Journal_Dish (dish_ID, ingredient_ID, journal_ID, weight)
      VALUES (?, NULL, ?, ?)
      `,
            [dishId, journalId, weightValue],
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
            params,
        );

        let journalId;
        if (journalEntry.length > 0) {
            journalId = journalEntry[0].id;
        } else {
            const [dayOfWeekEntry] = await db.pool.execute(
                `
        SELECT id FROM DayOfTheWeek WHERE title = DAYNAME(?)
        `,
                [date],
            );
            const dayOfTheWeekId = dayOfWeekEntry.length > 0 ? dayOfWeekEntry[0].id : null;

            const [newJournal] = await db.pool.execute(
                `
        INSERT INTO Journal (date, dayOfTheWeek_ID, typeOfMeal_ID, user_ID, member_ID)
        VALUES (?, ?, ?, ?, ?)
        `,
                [date, dayOfTheWeekId, typeOfMealId, memberId ? null : userId, memberId ?? null],
            );
            journalId = newJournal.insertId;
        }

        const [addedIngredient] = await db.pool.execute(
            `
      INSERT INTO Journal_Dish (dish_ID, ingredient_ID, journal_ID, weight)
      VALUES (NULL, ?, ?, ?)
      `,
            [ingredientId, journalId, weight],
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
            [journalDishId],
        );
        return { message: 'Deleted successfully' };
    }

    // Порахувати КБЖУ для одного прийому їжі
    async calculateMealNutrients(userId, memberId = null, date, typeOfMealId) {
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
            [date, typeOfMealId, userValue],
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
            params,
        );

        return rows[0];
    }

    async getMealByDateAndType({ date, typeOfMealId, userId, memberId }) {
        const whereClause = memberId ? 'member_ID = ?' : 'user_ID = ?';
        const idValue = memberId ?? userId;

        const [journalRows] = await db.pool.execute(
            `SELECT id FROM Journal WHERE date = ? AND typeOfMeal_ID = ? AND ${whereClause}`,
            [date, typeOfMealId, idValue],
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
            [journalId],
        );

        return mealItems;
    }

    async getJournalDay({ userId, memberId, date }) {
        if (!userId && !memberId) {
            throw new Error('Не передано userId або memberId');
        }

        let whereClause = '';
        let params = [date];
        if (memberId != null) {
            whereClause = 'member_ID = ?';
            params.push(memberId);
        } else {
            whereClause = 'user_ID = ?';
            params.push(userId);
        }

        // Запрос для получения данных по дням и типам приемов пищи с информацией из таблицы journal_dish
        const [rows] = await db.pool.execute(
            `SELECT j.id, j.date, j.typeOfMeal_ID, j.dayOfTheWeek_ID, t.title as typeOfMealTitle,
            jd.dish_ID, jd.weight
     FROM Journal j
     LEFT JOIN TypesOfMeal t ON j.typeOfMeal_ID = t.id
     LEFT JOIN Journal_Dish jd ON j.id = jd.journal_ID
     WHERE j.date = ? AND ${whereClause}`,
            params,
        );

        if (rows.length === 0) {
            return []; // Если нет данных, возвращаем пустой массив
        }

        // Создадим объект для группировки по типу приемов пищи
        const groupedMeals = rows.reduce((acc, row) => {
            const mealType = row.typeOfMealTitle;

            if (!acc[mealType]) {
                acc[mealType] = [];
            }

            acc[mealType].push({
                dishId: row.dish_ID,
                weight: row.weight,
            });

            return acc;
        }, {});

        // Для каждого типа приема пищи получим информацию о блюде и нутриентах
        for (let mealType in groupedMeals) {
            const mealItems = groupedMeals[mealType];

            // Получаем информацию о блюде для каждого приема пищи
            const dishesInfo = await Promise.all(
                mealItems.map(async (meal) => {
                    const [dishInfo] = await db.pool.execute(
                        `SELECT title
           FROM Dishes
           WHERE id = ?`,
                        [meal.dishId],
                    );

                    // Получаем информацию о БЖУ из таблицы dishbmr
                    const [bmrInfo] = await db.pool.execute(
                        `SELECT calories, proteins, fats, carbs
           FROM DishBMR
           WHERE dish_ID = ?`,
                        [meal.dishId],
                    );

                    return {
                        ...meal,
                        name: dishInfo[0]?.title || 'Неизвестное блюдо',
                        calories: bmrInfo[0]?.calories || 0,
                        proteins: bmrInfo[0]?.proteins || 0,
                        fats: bmrInfo[0]?.fats || 0,
                        carbs: bmrInfo[0]?.carbs || 0,
                    };
                }),
            );

            // Обновим groupedMeals с полными данными о блюде и нутриентах
            groupedMeals[mealType] = dishesInfo;
        }

        return groupedMeals;
    }
}

export default new JournalService();
