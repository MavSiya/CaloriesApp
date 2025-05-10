import JournalService from "../services/JournalService";

import { makeAutoObservable } from "mobx";
import dayjs from "dayjs";

export default class JournalStore {
  currentDate = dayjs(); 

  nutrientsByMeal = {
    1: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
    2: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
    3: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
    4: { calories: 0, proteins: 0, fats: 0, carbs: 0 }
  };
  
  consumed = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  allowed = { calories: 0, proteins: 0, fats: 0, carbs: 0 };


  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }
  setConsumed(data) {
    this.consumed = data;
  }

  setAllowed(data) {
    this.allowed = data;
  }

  setDate(date) {
    this.currentDate = date;
  }
  setLoading(isLoading) {
    this.isLoading = isLoading;
  }
  setError(error) {
    this.error = error;
  }

  setMealNutrients(typeOfMealId, nutrients) {
    this.nutrientsByMeal[typeOfMealId] = nutrients;
  }

  get daysRange() {
    return Array.from({ length: 7 }, (_, i) => {
      return this.currentDate.startOf('day').add(i - 3, 'day');
    });
  }

  get currentMonth() {
    return this.currentDate.format('MMMM YYYY');
  }

  isToday(date) {
    return date.isSame(dayjs(), 'day');
  }

  isSelected(date) {
    return date.isSame(this.currentDate, 'day');
  }

    async fetchConsumed(userId, memberId) {
    try {
      const res = await JournalService.calculateTotalDailyNutrients({
        userId,
        memberId,
        date: this.currentDate.format('YYYY-MM-DD'),
      });
      const normalized = {
        calories: res.data.totalCalories,
        proteins: res.data.totalProteins,
        fats: res.data.totalFats,
        carbs: res.data.totalCarbs
      };
      this.consumed = normalized;
    } catch (e) {
      console.error("Error fetching consumed nutrients", e);
    }
  }

  async fetchAllowed({userId, memberId}) {
    try {
      const res = await JournalService.getDailyTargets({ userId, memberId });
      this.allowed = res.data;
    } catch (e) {
      console.error("Error fetching daily targets", e);
    }
  }
  async fetchMealNutrients( {memberId, typeOfMealId}) {
    try {
      const res = await JournalService.calculateMealNutrients({
        memberId,
        date: this.currentDate.format("YYYY-MM-DD"),
        typeOfMealId
      });
      const normalized = {
        calories: res.data.totalCalories,
        proteins: res.data.totalProteins,
        fats: res.data.totalFats,
        carbs: res.data.totalCarbs
      };
      this.setMealNutrients(typeOfMealId, normalized);
    } catch (e) {
      console.error(`Error fetching nutrients for meal ${typeOfMealId}`, e);
    }
  }
  

  setDate(date) {
    this.currentDate = date;
  }

  meals = {
    1: [], // Сніданок
    2: [], // Обід
    3: [], // Вечеря
    4: []  // Перекус
  };
  
  setMealDishes(typeOfMealId, dishes) {
    this.meals[typeOfMealId] = dishes;
  }
  
  async fetchMealDishes(typeOfMealId, memberId) {
    try {
      const formattedDate = dayjs(this.currentDate).format('YYYY-MM-DD');
      const response = await JournalService.getMealByDateAndType({
        date: formattedDate,
        typeOfMealId,
        memberId
      });
      console.log('Fetched dishes:', response.data); 
      console.log('Fetched memberId:', memberId); 
      this.meals[typeOfMealId] = response.data;
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  }
  
  
  async addDishToMeal({ userId, memberId, date, typeOfMealId, dishId, weight  }) {
    this.setLoading(true);
    
    try {
      const response = await JournalService.addDishToMeal({ userId, memberId, date, typeOfMealId, dishId, weight  });
      this.setJournalEntries(response.data); 
      await this.fetchMealDishes(typeOfMealId, memberId);
    await this.fetchMealNutrients({ memberId, typeOfMealId });
    await this.fetchConsumed(userId, memberId); 
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async addIngredientToMeal({ userId, memberId, date, typeOfMealId, ingredientId, weight  }) {
    this.setLoading(true);
    try {
      const response = await JournalService.addIngredientToMeal({ userId, memberId, date, typeOfMealId, ingredientId, weight  });
      this.setJournalEntries(response.data); 
      await this.fetchMealDishes(typeOfMealId, memberId);
      await this.fetchMealNutrients({ memberId, typeOfMealId });
      await this.fetchConsumed(userId, memberId);
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async deleteFromMeal(journalDishId) {
    try {
      await JournalService.deleteFromMeal(journalDishId);
    } catch (error) {
      console.error('Error deleting dish from meal:', error);
    }
  }
  
}

