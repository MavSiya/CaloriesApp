import { makeAutoObservable } from 'mobx';
import MemberService from '../services/MemberService';

export default class MemberStore {
  members = [];
  selectedMember = null;
  isLoading = false;
  error = null;

  name = "";
  dob = "";
  weight = "";
  height = "";
  activityId = null;
  goalId = null;
  sex = "";

  constructor() {
    makeAutoObservable(this);
  }

  setField(field, value) {
    this[field] = value;
  }

  setActivity(id) {
    this.activityId = id;
  }

  setGoal = (id) => { 
  this.goalId = id;
}

  setSex(sex) {
    this.sex = sex;
  }

  setSelectedMember(member) {
    this.selectedMember = member;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  setError(message) {
    this.error = message;
  }

  reset() {
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
      this.name?.trim() &&
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

    return Math.round(
      this.bmr *
      (activityFactors[this.activityId] || 1) *
      (goalFactors[this.goalId] || 1)
    );
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

  async fetchAllMembers(userId) {
    this.setLoading(true);
    this.setError(null);
    try {
      const members = await MemberService.getAllMembers(userId);
      this.members = members;
      this.setSelectedMember(members[0] || null);
    } catch (error) {
      this.setError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async fetchMemberInfo(memberId) {
    this.setError(null);
    try {
      const info = await MemberService.getMemberInfo(memberId);
      this.activityId = info.activity_ID ?? null;
      this.goalId = info.goal_ID ?? null;
      this.weight = info.weight?.toString() || "";
      this.height = info.height?.toString() || "";
      this.dob = info.dateOfBirth?.split("T")[0] || "";
      this.sex = info.sex;
      this.name = info.name || "";
    } catch (error) {
      this.setError(error.message);
    }
  }

async createMember(userId) {
  this.isLoading = true;
  try {
    const { name, activityId, goalId, weight, height, dob, sex } = this;
    console.log('memberData перед відправкою:', {
  activityId, goalId, weight, height, dob, sex
});
    const newMember = await MemberService.createMember(userId, name);
    await MemberService.addMemberInfo(newMember.id, activityId, goalId, weight, height, dob, sex);
    this.fetchAllMembers(userId); // оновлення списку
  } catch (error) {
    console.error("Помилка при створенні мембера:", error.message);
    throw error;
  } finally {
    this.isLoading = false;
  }
}

  async updateMemberInfo(memberId) {
    this.setError(null);
    try {
      await MemberService.updateMemberInfo(
        memberId,
        this.activityId,
        this.goalId,
        this.weight,
        this.height,
        this.totalCalories,
        this.proteins,
        this.fats,
        this.carbs,
        this.dob,
        this.sex
      );
      await this.fetchMemberInfo(memberId);
    } catch (error) {
      this.setError(error.message);
    }
  }

  async deleteMember({memberId,userId}) {
      console.log('Удаляем члена', memberId);
    this.setError(null);
    try {
      await MemberService.deleteMember(memberId,userId);
       console.log('Член удален');
      await this.fetchAllMembers(userId);
    } catch (error) {
       console.error('Ошибка при удалении:', error.message);
      this.setError(error.message);
    }
  }
}
