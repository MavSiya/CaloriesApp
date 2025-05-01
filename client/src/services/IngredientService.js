import $api from "../http";

export default class IngredientService {
  // Обавити інгрідієнт в базу даних
  static async addIngredientToDB(title, calories, proteins, fats, carbs) {
    return $api.get('/ingredient/add-ingredient-todb', {
      params: { title, calories, proteins, fats, carbs }
    });
  }

  // Знайти інгрідієнт по назві
  static async findIngredient(title) {
    return $api.get('/ingredient/search-ingredient', {
      params: { title }
    });
  }
}
