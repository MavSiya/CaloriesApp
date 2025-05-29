import $api from '../http';

// Додавання блюда у прийом їжі
export async function addDishToMeal({ userId, memberId, date, typeOfMealId, dishId, weight }) {
    return $api.post('/add-dish', { userId, memberId, date, typeOfMealId, dishId, weight });
}

// Додавання інгрідієнтів у прийом їжі
export async function addIngredientToMeal({
    userId,
    memberId,
    date,
    typeOfMealId,
    ingredientId,
    weight,
}) {
    return $api.post('/add-ingredient', {
        userId,
        memberId,
        date,
        typeOfMealId,
        ingredientId,
        weight,
    });
}

// Видалення блюда
export async function deleteFromMeal(journalDishId) {
    return $api.delete(`delete/${journalDishId}`);
}

// Розрахунок нутрієнтів за прийом їжі
export async function calculateMealNutrients({ memberId, date, typeOfMealId }) {
    return $api.get('/meal-nutrients', {
        params: { memberId, date, typeOfMealId },
    });
}

// Розрахунок загальних добових нутрієнтів
export async function calculateTotalDailyNutrients({ userId, memberId, date }) {
    return $api.get('/daily-nutrients', {
        params: { userId, memberId, date },
    });
}

export async function getDailyTargets({ userId, memberId }) {
    return $api.get('/target', {
        params: { userId, memberId },
    });
}

export async function getMealByDateAndType({ date, typeOfMealId, memberId }) {
    return $api.get('meal-dish', {
        params: {
            date,
            typeOfMealId,
            memberId,
        },
    });
}
