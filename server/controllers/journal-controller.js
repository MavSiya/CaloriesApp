import * as journalService from '../service/journal-service.js';
import { getDailyTargets } from '../service/user-info-service.js';

export async function addDishToMeal(req, res, next) {
    try {
        const userId = req.user.id;
        const { memberId, date, typeOfMealId, dishId, weight } = req.body;
        if (!userId && !memberId) {
            return res.status(400).json({ error: 'Не вказано користувача або члена групи' });
        }

        const result = await journalService.addDishToMeal({
            userId,
            memberId,
            date,
            typeOfMealId,
            dishId,
            weight,
        });
        return res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function addIngredientToMeal(req, res, next) {
    try {
        const userId = req.user.id;
        const { memberId, date, typeOfMealId, ingredientId, weight } = req.body;

        if (!userId && !memberId) {
            return res.status(400).json({ error: 'Не вказано користувача або члена групи' });
        }
        if (!ingredientId && !typeOfMealId) {
            return res.status(400).json({ error: 'Не вказано інгрідієнт або тип прийому' });
        }
        const result = await journalService.addIngredientToMeal({
            userId,
            memberId,
            date,
            typeOfMealId,
            ingredientId,
            weight,
        });
        return res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteFromMeal(req, res, next) {
    try {
        const { journalDishId } = req.params;
        const result = await journalService.deleteFromMeal(journalDishId);
        return res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function calculateMealNutrients(req, res, next) {
    try {
        const userId = req.user.id;
        const { memberId, date, typeOfMealId } = req.query;
        const nutrients = await journalService.calculateMealNutrients(
            userId,
            memberId,
            date,
            typeOfMealId,
        );
        return res.json(nutrients);
    } catch (error) {
        next(error);
    }
}

export async function calculateTotalDailyNutrients(req, res, next) {
    try {
        const userId = req.user.id;
        const { memberId, date } = req.query;
        const nutrients = await journalService.calculateTotalDailyNutrients(userId, memberId, date);
        return res.json(nutrients);
    } catch (error) {
        next(error);
    }
}

export async function getDailyTarget(req, res, next) {
    try {
        const userId = req.user.id;
        const { memberId } = req.query;

        const targets = await getDailyTargets(userId, memberId);
        if (!targets) {
            return res.status(404).json({ error: 'Цільові значення КБЖУ не знайдено' });
        }

        return res.json(targets);
    } catch (error) {
        next(error);
    }
}

export async function getMealByDateAndType(req, res, next) {
    try {
        const userId = req.user.id;
        const { date, typeOfMealId, memberId } = req.query;
        if (!date || !typeOfMealId || (!userId && !memberId)) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        const meal = await journalService.getMealByDateAndType({
            date,
            typeOfMealId,
            userId,
            memberId,
        });

        res.json(meal);
    } catch (e) {
        next(e);
    }
}
