const userInfoService = require('../service/user-info-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserInfoController {
  // Метод для создания данных о пользователе
  async createUserInfo(req, res, next) {
    try {
      // Проверка на ошибки валидации
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Помилка при валідації', errors.array()));
      }

      const { activityId, goalId, weight, height, dateOfBirth, sex } = req.body;
      const userId = req.user.id; // Предполагаем, что id пользователя хранится в req.user

      // Создание данных пользователя
      const userInfo = await userInfoService.createUserInfo(userId, {
        activityId,
        goalId,
        weight,
        height,
        dateOfBirth,
        sex
      });

      // Возвращаем данные о пользователе
      return res.json(userInfo);
    } catch (e) {
      next(e);
    }
  }

  // Метод для обновления данных о пользователе
  async updateUserInfo(req, res, next) {
    try {
      // Проверка на ошибки валидации
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Помилка при валідації', errors.array()));
      }

      const { activityId, goalId, weight, height, dateOfBirth, sex } = req.body;
      const userId = req.user.id; // Предполагаем, что id пользователя хранится в req.user

      // Обновление данных пользователя
      const userInfo = await userInfoService.updateUserInfo(userId, {
        activityId,
        goalId,
        weight,
        height,
        dateOfBirth,
        sex
      });

      // Возвращаем обновленные данные о пользователе
      return res.json(userInfo);
    } catch (e) {
      next(e);
    }
  }

  // Метод для получения информации о пользователе
  async getUserInfo(req, res, next) {
    try {
      const userId = req.user.id; // id пользователя из токена
      const userInfo = await userInfoService.getUserInfo(userId);

      if (!userInfo) {
        return next(ApiError.NotFound('Інформація про користувача не знайдена'));
      }

      return res.json(userInfo);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserInfoController();
