import $api from "../http";

export default class JournalService {
  // Додавання блюда у прийом їжі
  static async addDishToMeal({ userId, memberId, date, typeOfMealId, dishId }) {
    return $api.post('/journal/add-dish', { userId, memberId, date, typeOfMealId, dishId });
  }

  // Додавання інгрідієнтів у прийом їжі
  static async addIngredientToMeal({ userId, memberId, date, typeOfMealId, ingredientId }) {
    return $api.post('/journal/add-ingredient', { userId, memberId, date, typeOfMealId, ingredientId });
  }

  // Видалення блюда
  static async deleteFromMeal(journalDishId) {
    return $api.delete(`/journal/delete/${journalDishId}`);
  }

  // Розрахунок нутрієнтів за прийом їжі
  static async calculateMealNutrients({ userId, memberId, date, typeOfMealId }) {
    return $api.get('/journal/meal-nutrients', {
      params: { userId, memberId, date, typeOfMealId }
    });
  }

  // Розрахунок загальних добових нутрієнтів
  static async calculateTotalDailyNutrients({ userId, memberId, date }) {
    return $api.get('/journal/daily-nutrients', {
      params: { userId, memberId, date }
    });
  }
}
