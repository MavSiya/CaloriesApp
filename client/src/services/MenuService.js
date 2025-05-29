import $api from '../http';

export async function addDishOrIngredientToMenu({
    dayOfWeekId,
    typeOfMealId,
    dishId,
    ingredientId,
    weight,
}) {
    const response = await $api.post('/add-in-menu', {
        dayOfWeekId,
        typeOfMealId,
        dishId,
        ingredientId,
        weight,
    });
    return response.data;
}

export async function getMenu(userId) {
    return $api.get('/menu', {
        params: { userId },
    });
}

export async function deleteFromMenu(mpwDishId) {
    return $api.delete(`/menu/${mpwDishId}`);
}

export async function updateMenuItem(mpwDishId, dishId = null, ingredientId = null) {
    return $api.put(`/menu/${mpwDishId}`, { dishId, ingredientId });
}

export async function getAggregatedIngredientsList(userId) {
    return $api.get('/ingredients/aggregate', {
        params: { userId },
    });
}
