import * as userInfoService from '../service/user-info-service.js';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api-error.js';

// Створення даних про користувача
export async function createUserInfo(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Помилка при валідації', errors.array()));
    }

    const { activityId, goalId, weight, height, dateOfBirth, sex, name } = req.body;
    const userId = req.user.id;

    const userInfo = await userInfoService.createUserInfo(userId, {
        activityId,
        goalId,
        weight,
        height,
        dateOfBirth,
        sex,
        name,
    });

    return res.json(userInfo);
}

// Оновлення даних про користувача
export async function updateUserInfo(req, res) {
    console.log('req.body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Помилка при валідації', errors.array());
    }

    const { activityId, goalId, weight, height, dateOfBirth, sex, name } = req.body;
    const userId = req.user.id;

    const userInfo = await userInfoService.updateUserInfo(userId, {
        activityId,
        goalId,
        weight,
        height,
        dateOfBirth,
        sex,
        name,
    });

    return res.json(userInfo);
}

// Отримання інформації про користувача
export async function getUserInfo(req, res) {
    const userId = req.user.id; // id пользователя из токена
    const userInfo = await userInfoService.getUserInfo(userId);

    if (!userInfo) {
        throw ApiError.NotFound('Інформація про користувача не знайдена');
    }

    return res.json(userInfo);
}
