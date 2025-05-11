import { makeAutoObservable, runInAction } from "mobx";
import MenuService from "../services/MenuService";
import store from "./store"; 

export default class MenuStore {
  menu = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMenu() {
    this.loading = true;
    try {
      const response = await MenuService.getMenu(store.user.id);
      runInAction(() => {
        this.menu = response.data;
        this.loading = false;
      });
    } catch (e) {
      console.error("Failed to fetch menu", e);
      this.loading = false;
    }
  }

  getDishesFor(day, meal) {
    return this.menu.filter(
      (item) => item.day === day && item.meal === meal
    );
  }

  async addDish({ dayOfWeekId, typeOfMealId, dishId }) {
    await MenuService.addDishOrIngredientToMenu({
      userId: store.user.id,
      dayOfWeekId,
      typeOfMealId,
      dishId
    });
    await this.fetchMenu();
  }

  async deleteDish(mpwDishId) {
    await MenuService.deleteFromMenu(mpwDishId);
    await this.fetchMenu();
  }
}

