import $api from '../http';

export async function createDish({ title, typeId }) {
    return $api.post('/create', { title, typeId });
}

export async function deleteDish(dishId) {
    return $api.delete(`/dish/${dishId}`);
}

export async function updateDish(dish) {
    return $api.put(`/dishes/${dish.id}`, dish);
}
export async function addIngredient({ dishId, title, weight }) {
    return $api.post('/add-ingredient-todish', { dishId, title, weight });
}

export async function updateIngredient(dishId, ingredientTitle, weight) {
    return $api.put('/update-ingredient', { dishId, ingredientTitle, weight });
}

export async function removeIngredient(dishId, ingredientTitle) {
    return $api.delete('/remove-ingredient', { data: { dishId, ingredientTitle } });
}

export async function getAllDishes(userId) {
    return $api.get('/all-dishes', {
        params: { userId },
    });
}

export async function getAllDishesWithBmr() {
    return $api.get('/all-dishes-bmr');
}

export async function findDish(title) {
    return $api.get('/search-dish', {
        params: { title },
    });
}

// Отримати назву типа страви по ID
export async function getDishTypeById(typeId) {
    return $api.get(`/get-dish-type/${typeId}`);
}

// Отримати всі типи страв
export async function getAllDishTypes() {
    return $api.get('/get-all-dish-types');
}
