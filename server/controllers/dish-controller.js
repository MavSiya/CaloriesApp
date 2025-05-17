import * as dishService from '../service/dish-service.js';
import {
    addIngredientToDish,
    calculateBMR,
    removeIngredientFromDish,
    updateIngredientWeight,
} from '../service/dish-composition-service.js';
import ApiError from '../exceptions/api-error.js';

// Створення блюда
export async function createDish(req, res) {
    const userId = req.user.id;
    const { title, typeId } = req.body;

    if (!title) {
        throw ApiError.BadRequest('Назва блюда обовʼязкова');
    }
    if (!typeId) {
        throw ApiError.BadRequest('Тип обовязковий обовʼязковий');
    }

    const dish = await dishService.createDish(title, userId, typeId);
    res.json(dish);
}

// Видалення блюда
export async function deleteDish(req, res) {
    const { id } = req.params;
    await dishService.deleteDish(id);
    res.json({ message: 'Блюдо видалено' });
}

// Додавання інгрідієнту
export async function addIngredient(req, res) {
        const { dishId, title, weight } = req.body;
        await addIngredientToDish(dishId, title, weight);

        // Оновлюємо КБЖУ після додавання інгрідієнту
        const kbzhu = await calculateBMR(dishId);
        await dishService.updateDishBMR(dishId, kbzhu);

        res.json({ message: 'Інгредієнт додано', kbzhu });
}

// Оновлення ваги
export async function updateIngredient(req, res) {
        const { dishId, ingredientTitle, weight } = req.body;
        await updateIngredientWeight(dishId, ingredientTitle, weight);

        const kbzhu = await calculateBMR(dishId);
        await dishService.updateDishBMR(dishId, kbzhu);

        res.json({ message: 'Інгредієнт оновлено', kbzhu });
}

// Видалення ингредиента
export async function removeIngredient(req, res) {
        const { dishId, ingredientTitle } = req.body;
        await removeIngredientFromDish(dishId, ingredientTitle);

        const kbzhu = await calculateBMR(dishId);
        await dishService.updateDishBMR(dishId, kbzhu);

        res.json({ message: 'Інгредієнт видалено', kbzhu });
}

// Получение всех блюд пользователя
export async function getAllDishes(req, res) {
        const userId = req.user.id;
        const dishes = await dishService.getAllDishes(userId);
        res.json(dishes);
}

export async function getAllDishesWithBmr(req, res) {
        const userId = req.user.id;
        const dishes = await dishService.getAllDishesWithBmr(userId);
        res.json(dishes);
}

// Пошук страви по назві
export async function findDish(req, res) {
        const userId = req.user.id;
        const { title } = req.query;
        const dishes = await dishService.findDishByName(title, userId);
        res.json(dishes);
}

// отримати назву типу страви по ID
export async function getDishTypeById(req, res) {
    const { typeId } = req.params;
    try {
        const type = await dishService.getDishTypeById(typeId);
        res.json(type);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching dish type',
            error,
        });
    }
}

// Отримати всі типи страв
export async function getAllDishTypes(req, res) {
    try {
        const userId = req.user.id;
        const types = await dishService.getAllDishTypes(userId);
        res.json(types);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching dish types',
            error,
        });
    }
}
