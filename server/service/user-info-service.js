const { pool } = require('../data-base/db');

class UserInfoService {
    // Функция для расчета КБЖУ
    calculateBMR(weight, height, age, sex, activityKoef, goalPercent) {
      const bmr = sex === 'male'
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  
      const calories = Math.round(bmr * activityKoef * goalPercent);
      const proteins = Math.round((calories * 0.3) / 4);
      const fats = Math.round((calories * 0.3) / 9);
      const carbs = Math.round((calories * 0.4) / 4);
  
      return { calories, proteins, fats, carbs };
    }
  
    // Метод для создания данных о пользователе
    async createUserInfo(userId, {
      activityId,
      goalId,
      weight,
      height,
      dateOfBirth,
      sex
    }) {
      const connection = await pool.getConnection();
      try {
        // Расчет возраста
        const birthYear = new Date(dateOfBirth).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
  
        // Получение коэффициентов активности и цели
        const [activityRow] = await connection.query(
          `SELECT koef FROM Activities WHERE id = ?`, [activityId]
        );
        const activityKoef = activityRow[0]?.koef || 1.2;
  
        const [goalRow] = await connection.query(
          `SELECT percent FROM Goals WHERE id = ?`, [goalId]
        );
        const goalPercent = goalRow[0]?.percent || 1.0;
  
        // Расчет КБЖУ с использованием формулы Mifflin-St Jeor
        const { calories, proteins, fats, carbs } = this.calculateBMR(weight, height, age, sex, activityKoef, goalPercent);
  
        // Создание новых данных
        await connection.query(`
          INSERT INTO Users_Info (
            user_ID, activity_ID, goal_ID, weight, height, dateOfBirth,
            calories, proteins, fats, carbs, sex
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [userId, activityId, goalId, weight, height, dateOfBirth, calories, proteins, fats, carbs, sex]);
  
        // Возвращаем все данные пользователя
        return {
          userId,
          activityId,
          goalId,
          weight,
          height,
          dateOfBirth,
          calories,
          proteins,
          fats,
          carbs,
          sex
        };
      } finally {
        connection.release();
      }
    }
  
    // Метод для обновления данных о пользователе
    async updateUserInfo(userId, data) {
      const fields = [];
      const values = [];
    
      if (data.activityId !== undefined) {
        fields.push('activity_ID = ?');
        values.push(data.activityId);
      }
      if (data.goalId !== undefined) {
        fields.push('goal_ID = ?');
        values.push(data.goalId);
      }
      if (data.weight !== undefined) {
        fields.push('weight = ?');
        values.push(data.weight);
      }
      if (data.height !== undefined) {
        fields.push('height = ?');
        values.push(data.height);
      }
      if (data.dateOfBirth !== undefined) {
        fields.push('dateOfBirth = ?');
        values.push(data.dateOfBirth);
      }
      if (data.sex !== undefined) {
        fields.push('sex = ?');
        values.push(data.sex);
      }
    
      // 💡 Если передано что-то, нужно обновить
      if (fields.length === 0) {
        throw new Error('No valid fields to update');
      }
    
      // 👉 Пример: UPDATE Users_Info SET weight = ?, height = ? WHERE user_ID = ?
      const query = `
        UPDATE Users_Info SET ${fields.join(', ')} WHERE user_ID = ?
      `;
    
      values.push(userId);
    
      const [result] = await pool.execute(query, values);
      return result;
    }
    
  
    // Метод для получения информации о пользователе
    async getUserInfo(userId) {
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.query(
          `SELECT * FROM Users_Info WHERE user_ID = ?`, [userId]
        );
        return rows[0] || null;
      } finally {
        connection.release();
      }
    }
  }
  
  module.exports = new UserInfoService();
  