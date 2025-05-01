import $api from "../http";

export default class MenuService {
  static async addDishOrIngredientToMenu({ dayOfWeekId, typeOfMealId, userId, dishId = null, ingredientId = null }) {
    return $api.post('/menu/add-in-menu', { dayOfWeekId, typeOfMealId, userId, dishId, ingredientId });
  }

  static async getMenu(userId) {
    return $api.get('/menu', {
      params: { userId }
    });
  }

  static async deleteFromMenu(mpwDishId) {
    return $api.delete(`/menu/menu/${mpwDishId}`);
  }

  static async updateMenuItem(mpwDishId, dishId = null, ingredientId = null) {
    return $api.put(`/menu/menu/${mpwDishId}`, { dishId, ingredientId });
  }

  static async getAggregatedIngredientsList(userId) {
    return $api.get('/menu/ingredients/aggregate', {
      params: { userId }
    });
  }
}
