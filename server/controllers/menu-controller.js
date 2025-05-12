const menuService = require('../service/menu-service.js');

class MenuController {
  async addDishOrIngredientToMenu(req, res, next) {
    try {
      const userId = req.user.id;
      const { dayOfWeekId, typeOfMealId,dishId, ingredientId } = req.body;
      const result = await menuService.addDishOrIngredientToMenu({ dayOfWeekId, typeOfMealId, userId, dishId, ingredientId });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMenu(req, res, next) {
    try {
      const userId = req.user.id;
      const menu = await menuService.getMenu(userId);
      return res.json(menu);
    } catch (error) {
      next(error);
    }
  }

  async deleteFromMenu(req, res, next) {
    try {
      const { mpwDishId } = req.params;
      const result = await menuService.deleteFromMenu(mpwDishId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateMenuItem(req, res, next) {
    try {
      const { mpwDishId } = req.params;
      const { dishId, ingredientId } = req.body;
      const result = await menuService.updateMenuItem(mpwDishId, dishId, ingredientId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAggregatedIngredientsList(req, res, next) {
    try {
      const userId = req.user.id;
      const ingredients = await menuService.getAggregatedIngredientsList(userId);
      return res.json(ingredients);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MenuController();
