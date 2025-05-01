const dishService = require('../service/dish-service');
const dishCompositionService = require('../service/dish-composition-service');
const ApiError = require('../exceptions/api-error');

class DishController {
  // Створення блюда
  async createDish(req, res, next) {
    try {
      const userId = req.user.id;
      const { title, type } = req.body;

      if (!title) {
        return next(ApiError.BadRequest('Назва блюда обовʼязкова'));
      }

      const dish = await dishService.createDish(title,userId,type);
      res.json(dish);
    } catch (e) {
      next(e);
    }
  }

  // Видалення блюда
  async deleteDish(req, res, next) {
    try {
      const { id } = req.params;
      await dishService.deleteDish(id);
      res.json({ message: 'Блюдо видалено' });
    } catch (e) {
      next(e);
    }
  }

  // Додавання інгрідієнту
  async addIngredient(req, res, next) {
    try {
      const { dishId, ingredientTitle, weight } = req.body;
      await dishCompositionService.addIngredientToDish(dishId, ingredientTitle, weight);

      // Оновлюємо КБЖУ після додавання інгрідієнту
      const kbzhu = await dishCompositionService.calculateBMR(dishId);
      await dishService.updateDishBMR(dishId, kbzhu);

      res.json({ message: 'Інгредієнт додано', kbzhu });
    } catch (e) {
      next(e);
    }
  }

  // Оновлення ваги 
  async updateIngredient(req, res, next) {
    try {
      const { dishId, ingredientTitle, weight } = req.body;
      await dishCompositionService.updateIngredientWeight(dishId, ingredientTitle, weight);

      const kbzhu = await dishCompositionService.calculateBMR(dishId);
      await dishService.updateDishBMR(dishId, kbzhu);

      res.json({ message: 'Інгредієнт оновлено', kbzhu });
    } catch (e) {
      next(e);
    }
  }

  // Видалення ингредиента
  async removeIngredient(req, res, next) {
    try {
      const { dishId, ingredientTitle } = req.body;
      await dishCompositionService.removeIngredientFromDish(dishId, ingredientTitle);

      const kbzhu = await dishCompositionService.calculateBMR(dishId);
      await dishService.updateDishBMR(dishId, kbzhu);

      res.json({ message: 'Інгредієнт видалено', kbzhu });
    } catch (e) {
      next(e);
    }
  }

  // Получение всех блюд пользователя
  async getAllDishes(req, res, next) {
    try {
      const userId = req.user.id;
      const dishes = await dishService.getAllDishes(userId);
      res.json(dishes);
    } catch (e) {
      next(e);
    }
  }

  // Поиск блюда по названию
  async findDish(req, res, next) {
    try {
      const userId = req.user.id;
      const { title } = req.query;
      const dishes = await dishService.findDishByName(title, userId);
      res.json(dishes);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DishController();
