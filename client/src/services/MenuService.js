import $api from "../http";

export default class MenuService {
static async addDishOrIngredientToMenu({ dayOfWeekId, typeOfMealId,dishId, ingredientId,weight }) {
  const response = await $api.post('/add-in-menu', { dayOfWeekId, typeOfMealId, dishId, ingredientId,weight });
  return response.data; 
}

  static async getMenu(userId) {
    return $api.get('/menu', {
      params: { userId }
    });
  }

  static async deleteFromMenu(mpwDishId) {
    return $api.delete(`/menu/${mpwDishId}`);
  }

  static async updateMenuItem(mpwDishId, dishId = null, ingredientId = null) {
    return $api.put(`/menu/${mpwDishId}`, { dishId, ingredientId });
  }

  static async getAggregatedIngredientsList(userId) {
    return $api.get('/ingredients/aggregate', {
      params: { userId }
    });
  }
}
