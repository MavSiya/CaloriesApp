import { makeAutoObservable } from "mobx";
import DishService from "..//services/DishService";
import IngredientService from "../services/IngredientService";

export default class DishStore {
  dishes = [];
  ingredients = [];
  typesOfDish = []; // Всі типи страв
  dishTypes = ""; // Тип страв по ID
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

  async fetchAllDishes(userId) {
    this.setLoading(true);
    try {
      const response = await DishService.getAllDishes(userId);
      this.setDishes(response.data);
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }
  
  async fetchAllDishesWithBmr() {
    this.setLoading(true);
    try {
      const response = await DishService.getAllDishesWithBmr();
      this.setDishes(response.data);
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

   // Отримати всі типи страв
   async fetchAllDishTypes() {
    this.loading = true;
    try {
      const response = await DishService.getAllDishTypes();
      this.typesOfDish = response.data;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  // Отримати тип страви по ID
  async fetchDishTypeById(typeId) {
    this.loading = true;
    try {
      const response = await DishService.getDishTypeById(typeId);
      this.dishType = response.data.title;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  async createDish(dish) {
    // Валідація
    if (!dish.title || !dish.ingredients || dish.ingredients.length === 0) {
      throw new Error("Назва страви та інгредієнти обов’язкові");
    }
    try {
    const seen = new Set();
    for (const ing of dish.ingredients) {
      const key = ing.title?.toLowerCase();
      if (!ing.title || !ing.weight || Number(ing.weight) <= 0) {
        throw new Error(`Невірний інгредієнт: ${ing.title || 'Без назви'}`);
      }
      if (seen.has(key)) {
        throw new Error(`Інгредієнт "${ing.title}" вже додано`);
      }
      seen.add(key);
    }
    console.log('Creating dish with:', dish.title, 'type:', dish.type);

    
      const newDish = await DishService.createDish({
        title: dish.title,
        typeId: dish.type
      });
      if (!newDish.data?.id) {
        throw new Error('Не удалось получить ID созданного блюда');
      }
      const dishId = newDish.data.id;
      
      for (const ing of dish.ingredients) {
        console.log(dish.ingredients);
        await DishService.addIngredient({
          dishId,
          title: ing.title,
          weight: ing.weight
        });
      }

      this.dishes.push({ ...newDish, ingredients: dish.ingredients });
    } catch (error) {
      console.error('Помилка створення страви:', error);
      throw error;
    }
  }

  async updateDish(updatedDish) {
  try {
    await DishService.deleteDish(updatedDish.id); 
    await this.createDish(updatedDish);
  } catch (error) {
    throw error;
  }
}

async deleteDish(dishId) {
  try {
    await DishService.deleteDish(dishId);
    this.setDishes(this.dishes.filter(d => d.id !== dishId));
  } catch (error) {
    throw error;
  }
}

}

