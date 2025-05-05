import { makeAutoObservable } from "mobx";
import userInfoService from '../services/UserInfoService';

export default class RegistrationStore {
    name = "";
    dob = "";
    weight = "";
    height = "";
    activityId = null;
    goalId = null;
    sex = "";
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    setField(field, value) {
        this[field] = value;
    }

    setActivity(id) {
        this.activityId = id;
    }

    setGoal(id) {
        this.goalId = id;
    }

    setSex(sex) {
        this.sex = sex;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    setError(message) {
        this.error = message;
    }

    clear() {
        this.name = "";
        this.dob = "";
        this.weight = "";
        this.height = "";
        this.activityId = null;
        this.goalId = null;
        this.sex = "";
        this.error = null;
    }

    get isValid() {
        return (
            this.name &&
            this.dob &&
            this.weight &&
            this.height &&
            this.activityId &&
            this.goalId &&
            this.sex
        );
    }

    get bmr() {
        const weight = Number(this.weight);
        const height = Number(this.height);
        const age = new Date().getFullYear() - new Date(this.dob).getFullYear();
        const base = 10 * weight + 6.25 * height - 5 * age;
        return this.sex === "male" ? base + 5 : base - 161;
    }

    get totalCalories() {
        const activityFactors = {
            1: 1.2,
            2: 1.38,
            3: 1.55,
            4: 1.73,
            5: 1.9
        };

        const goalFactors = {
            1: 0.85,
            2: 1.0,
            3: 1.15
        };
        return Math.round(this.bmr * (activityFactors[this.activityId] || 1) *(goalFactors[this.goalId] || 1) );
    }

    get proteins() {
        return Math.round((this.totalCalories * 0.3) / 4);
    }

    get fats() {
        return Math.round((this.totalCalories * 0.3) / 9);
    }

    get carbs() {
        return Math.round((this.totalCalories * 0.4) / 4);
    }

    async submitUserInfo() {
        this.setLoading(true);
        this.setError(null);

        try {
            const result = await userInfoService.createUserInfo(
                this.activityId,
                this.goalId,
                Number(this.weight),
                Number(this.height),
                this.dob,
                this.sex,
                this.name
            );
            console.log("Інформацію про користувача збережено:", result);
            return result;
        } catch (error) {
            this.setError(error.message || "Помилка при збереженні");
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async updateUserInfo() {
        this.setLoading(true);
        this.setError(null);

        try {
            const result = await userInfoService.updateUserInfo(
                this.activityId,
                this.goalId,
                Number(this.weight),
                Number(this.height),
                this.dob,
                this.sex,
                this.name
            );
            console.log("Інформацію оновлено:", result);
            return result;
        } catch (error) {
            this.setError(error.message || "Помилка при оновленні");
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async loadUserInfo() {
        this.setLoading(true);
        this.setError(null);

        try {
            const data = await userInfoService.getUserInfo();
            console.log("Отримано з сервера:", data); 
            this.activityId = data.activity_ID ?? null;
            this.goalId = data.goal_ID ?? null;
            this.weight = data.weight.toString();
            this.height = data.height.toString();
            this.dob = data.dateOfBirth?.split("T")[0] || "";
            this.sex = data.sex;
            this.name = data.name || "";
        } catch (error) {
            this.setError(error.message || "Помилка при завантаженні");
        } finally {
            this.setLoading(false);
        }
    }
}
