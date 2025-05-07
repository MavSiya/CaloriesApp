import $api from "../http";

export default class DishService {
  static async createDish(name, userId, typeID) {
    return $api.post('/dish/create', { title: name, userId, typeID });
  }

  static async deleteDish(dishId) {
    return $api.delete(`/dish/${dishId}`);
  }

  static async addIngredient(dishId, ingredientId, weight) {
    return $api.post('/dish/add-ingredient-todish', { dishId, ingredientId, weight });
  }

  static async updateIngredient(dishId, ingredientId, weight) {
    return $api.put('/update-ingredient', { dishId, ingredientId, weight });
  }

  static async removeIngredient(dishId, ingredientId) {
    return $api.delete('/remove-ingredient', { data: { dishId, ingredientId } });
  }

  static async getAllDishes(userId) {
    return $api.get('/all', {
      params: { userId }
    });
  }

  static async findDish(title, userId) {
    return $api.get('/search-dish', {
      params: { title, userId }
    });
  }
}
