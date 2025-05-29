import { makeAutoObservable, runInAction } from 'mobx';
import {
    addDishOrIngredientToMenu,
    deleteFromMenu,
    getAggregatedIngredientsList,
    getMenu,
} from '../services/MenuService';
import dayjs from 'dayjs';
import { toJS } from 'mobx';

export default class MenuStore {
    menu = [];
    isUpdated = false;
    aggregatedIngredients = [];
    daysAndMeals = [];
    isLoading = false;
    error = null;
    currentDate = dayjs();

    daysOfWeekMapping = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 7,
    };

    constructor() {
        makeAutoObservable(this);
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

    setMenu(data) {
        this.menu = data;
    }
    setIsUpdated(status) {
        this.isUpdated = status;
    }

    getDayId(dayName) {
        return this.daysOfWeekMapping[dayName.toLowerCase()];
    }

    isSelected(date) {
        return date.isSame(this.currentDate, 'day');
    }

    getDishesFor(dayOfWeekId, mealId) {
        const menuCopy = toJS(this.menu);

        if (!menuCopy || menuCopy.length === 0) {
            console.log('Menu is empty, no dishes to fetch');
            return [];
        }

        const mealNames = {
            1: 'Сніданок',
            2: 'Обід',
            3: 'Вечеря',
            4: 'Перекус',
        };

        return menuCopy.filter(
            (item) =>
                this.getDayId(item.day) === dayOfWeekId &&
                item.meal === mealNames[mealId] &&
                (item.dishTitle || item.ingredientTitle)
        );
    }

    async fetchMenu(userId) {
        this.setLoading(true);
        try {
            const response = await getMenu(userId);
            runInAction(() => {
                this.setMenu(response.data);
                this.setIsUpdated(false);
            });
        } catch (e) {
            console.error('Failed to fetch menu', e);
            this.setError(e.message);
        } finally {
            this.setLoading(false);
        }
    }

    async addDish({ userId, dayOfWeekId, typeOfMealId, dishId, ingredientId, weight }) {
        this.setLoading(true);
        try {
            await addDishOrIngredientToMenu({
                dayOfWeekId,
                typeOfMealId,
                dishId,
                ingredientId,
                weight,
            });
            await this.fetchMenu(userId);
        } catch (e) {
            console.error('Failed to add dish', e);
            this.setError(e.message);
        } finally {
            this.setLoading(false);
        }
    }

    async deleteDish(userId, mpwDishId) {
        this.setLoading(true);
        try {
            await deleteFromMenu(mpwDishId);
            await this.fetchMenu(userId);
        } catch (e) {
            console.error('Failed to delete dish', e);
            this.setError(e.message);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchAggregatedIngredients(userId) {
        this.setLoading(true);
        try {
            const response = await getAggregatedIngredientsList(userId);
            runInAction(() => {
                this.aggregatedIngredients = response.data;
            });
        } catch (e) {
            console.error('Failed to fetch aggregated ingredients', e);
            this.setError(e.message);
        } finally {
            this.setLoading(false);
        }
    }
}
