import $api from '../http';

// Обавити інгрідієнт в базу даних
export async function addIngredientToDB(title, calories, proteins, fats, carbs) {
    return $api.post('/add-ingredient-todb', { title, calories, proteins, fats, carbs });
}

// Знайти інгрідієнт по назві
export async function findIngredient(title) {
    return $api.get('/search-ingredient', {
        params: { title },
    });
}
