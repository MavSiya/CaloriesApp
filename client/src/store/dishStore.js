import { makeAutoObservable } from "mobx";
import DishService from "..//services/DishService";
import IngredientService from "../services/IngredientService";

export default class DishStore {
  dishes = [];
  ingredients = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  setDishes(dishes) {
    this.dishes = dishes;
  }

  setIngredients(ingredients) {
    this.ingredients = ingredients;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
  }

  setError(error) {
    this.error = error;
  }

  async searchDishByName(title) {
    this.setLoading(true);
    try {
      const response = await DishService.findDish(title); 
      this.setDishes(response.data); 
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async searchIngredientByName(title) {
    this.setLoading(true);
    try {
      const response = await IngredientService.findIngredient(title); 
      this.setIngredients(response.data); 
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }
}

