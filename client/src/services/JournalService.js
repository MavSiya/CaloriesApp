import $api from "../http";

export default class JournalService {
  // Додавання блюда у прийом їжі
  static async addDishToMeal({ userId, memberId, date, typeOfMealId, dishId, weight  }) {
    return $api.post('/add-dish', { userId, memberId, date, typeOfMealId, dishId, weight  });
  }

  // Додавання інгрідієнтів у прийом їжі
  static async addIngredientToMeal({ userId, memberId, date, typeOfMealId, ingredientId,weight  }) {
    return $api.post('/add-ingredient', { userId, memberId, date, typeOfMealId, ingredientId, weight  });
  }

  // Видалення блюда
  static async deleteFromMeal(journalDishId) {
    return $api.delete(`delete/${journalDishId}`);
  }

  // Розрахунок нутрієнтів за прийом їжі
  static async calculateMealNutrients({memberId, date, typeOfMealId} ) {
    return $api.get('/meal-nutrients', {
      params: { memberId, date, typeOfMealId }
    });
  }

  // Розрахунок загальних добових нутрієнтів
  static async calculateTotalDailyNutrients({ userId, memberId, date }) {
    return $api.get('/daily-nutrients', {
      params: { userId, memberId, date }
    });
  }

  static async getDailyTargets({ userId, memberId}) {
    return $api.get('/target', {
      params: { userId, memberId}
    });
  }

  static async getMealByDateAndType({ date, typeOfMealId,memberId }) {
    return $api.get('meal-dish', {
      params: {
        date, typeOfMealId,memberId
      }
    });
  }

}
