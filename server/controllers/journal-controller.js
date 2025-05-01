const journalService = require('../service/journal-service');
const ingredientService = require('../service/ingredient-service');

class JournalController {
  async addDishToMeal(req, res, next) {
    try {
      const userId = req.user.id;
      const {memberId, date, typeOfMealTitle, dishId } = req.body;
      const typeOfMealId = await journalService.getTypeOfMealIdByTitle(typeOfMealTitle);
      if (!userId && !memberId) {
        return res.status(400).json({ error: 'Не вказано користувача або члена групи' });
      }
      
      const result = await journalService.addDishToMeal({ userId, memberId, date, typeOfMealId, dishId });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async addIngredientToMeal(req, res, next) {
    try {
      const userId = req.user.id;
      const {memberId, date, typeOfMealTitle, ingredientTitle } = req.body;
      const ingredientId = await ingredientService.getIngredientIdByTitle(ingredientTitle);
      const typeOfMealId = await journalService.getTypeOfMealIdByTitle(typeOfMealTitle);
      if (!userId && !memberId) {
        return res.status(400).json({ error: 'Не вказано користувача або члена групи' });
      }
      if (!ingredientId && !typeOfMealId) {
        return res.status(400).json({ error: 'Не вказано інгрідієнт або тип прийому' });
      }
      const result = await journalService.addIngredientToMeal({ userId, memberId, date, typeOfMealId, ingredientId });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteFromMeal(req, res, next) {
    try {
      const { journalDishId } = req.params;
      const result = await journalService.deleteFromMeal(journalDishId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async calculateMealNutrients(req, res, next) {
    try {
      const userId = req.user.id;
      const {memberId, date, typeOfMealTitle } = req.query;
      const typeOfMealId = await journalService.getTypeOfMealIdByTitle(typeOfMealTitle);
      const nutrients = await journalService.calculateMealNutrients(userId, memberId, date, typeOfMealId);
      return res.json(nutrients);
    } catch (error) {
      next(error);
    }
  }

  async calculateTotalDailyNutrients(req, res, next) {
    try {
      const userId = req.user.id;
      const {memberId, date } = req.query;
      const nutrients = await journalService.calculateTotalDailyNutrients(userId, memberId, date);
      return res.json(nutrients);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JournalController();
