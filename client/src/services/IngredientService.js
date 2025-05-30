import $api from "../http";

export default class IngredientService {
  // Обавити інгрідієнт в базу даних
  static async addIngredientToDB(title, calories, proteins, fats, carbs) {
return $api.post('/add-ingredient-todb', { title, calories, proteins, fats, carbs });
  }

  // Знайти інгрідієнт по назві
  static async findIngredient(title) {
    return $api.get('/search-ingredient', {
      params: { title }
    });
  }

  
  
}
