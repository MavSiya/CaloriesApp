import * as ingredientService from '../service/ingredient-service.js';

// Створення блюда

// Додавання інгрідієнту
export async function addIngredientToDB(req, res) {
    const { title, calories, proteins, fats, carbs } = req.body;
    console.log('BODY:', req.body);
    await ingredientService.addIngredientToDB(title, calories, proteins, fats, carbs);

    res.json({ message: 'Інгредієнт додано у базу данних' });
}

export async function findIngredient(req, res) {
    const { title } = req.query;
    const ingredients = await ingredientService.findIngredientByName(title);
    if (ingredients.length === 0) {
        return res.status(404).json({ message: 'Інгредієнт не знайдений' });
    }
    return res.json(ingredients);
}
