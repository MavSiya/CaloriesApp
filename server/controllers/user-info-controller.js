const userInfoService = require('../service/user-info-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserInfoController {
  // Створення даних про користувача
  async createUserInfo(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Помилка при валідації', errors.array()));
      }

      const { activityId, goalId, weight, height, dateOfBirth, sex,name } = req.body;
      const userId = req.user.id; 

      const userInfo = await userInfoService.createUserInfo(userId, {
        activityId,
        goalId,
        weight,
        height,
        dateOfBirth,
        sex,
        name
      });

      return res.json(userInfo);
    } catch (e) {
      next(e);
    }
  }

  // Оновлення даних про користувача
  async updateUserInfo(req, res, next) {
    try {
      console.log('req.body:', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Помилка при валідації', errors.array()));
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
        name
      });

      return res.json(userInfo);
    } catch (e) {
      next(e);
    }
  }

  // Отримання інформації про користувача
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
