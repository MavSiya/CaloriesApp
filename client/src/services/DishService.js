import $api from "../http";

export default class DishService {
  static async createDish({title, typeId}) {
    return $api.post('/create', { title, typeId });
  }

  static async deleteDish(dishId) {
    return $api.delete(`/dish/${dishId}`);
  }

  static async addIngredient({dishId, title, weight}) {
    return $api.post('/add-ingredient-todish', { dishId, title, weight });
  }

  static async updateIngredient(dishId, ingredientTitle, weight) {
    return $api.put('/update-ingredient', { dishId, ingredientTitle, weight });
  }

  static async removeIngredient(dishId, ingredientTitle) {
    return $api.delete('/remove-ingredient', { data: { dishId, ingredientTitle } });
  }

  static async getAllDishes(userId) {
    return $api.get('/all-dishes', {
      params: { userId }
    });
  }

  static async getAllDishesWithBmr() {
    return $api.get('/all-dishes-bmr');
  }

  static async findDish(title) {
    return $api.get('/search-dish', {
      params: { title}
    });
  }

   // Отримати назву типа страви по ID
   static async getDishTypeById(typeId) {
    return $api.get(`/get-dish-type/${typeId}`);
  }

  // Отримати всі типи страв
  static async getAllDishTypes() {
    return $api.get('/get-all-dish-types');
  }
  
  
}
