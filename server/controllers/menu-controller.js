import * as menuService from '../service/menu-service.js';

export async function addDishOrIngredientToMenu(req, res) {
    const userId = req.user.id;
    const { dayOfWeekId, typeOfMealId, dishId, ingredientId, weight } = req.body;
    const result = await menuService.addDishOrIngredientToMenu({
        dayOfWeekId,
        typeOfMealId,
        userId,
        dishId,
        ingredientId,
        weight,
    });
    return res.json(result);
}

export async function getMenu(req, res) {
    const userId = req.user.id;
    const menu = await menuService.getMenu(userId);
    return res.json(menu);
}

export async function deleteFromMenu(req, res) {
    const { mpwDishId } = req.params;
    const result = await menuService.deleteFromMenu(mpwDishId);
    return res.json(result);
}

export async function updateMenuItem(req, res) {
    const { mpwDishId } = req.params;
    const { dishId, ingredientId } = req.body;
    const result = await menuService.updateMenuItem(mpwDishId, dishId, ingredientId);
    return res.json(result);
}

export async function getAggregatedIngredientsList(req, res) {
    const userId = req.user.id;
    const ingredients = await menuService.getAggregatedIngredientsList(userId);
    return res.json(ingredients);
}
