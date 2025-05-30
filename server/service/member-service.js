const db = require('../data-base/db');

class MemberService {
  // Створити нового мембера
  async createMember(userId, name) {
    const [newMember] = await db.pool.execute(
      `
      INSERT INTO Members (name, User_ID)
      VALUES (?, ?)
      `,
      [name, userId]
    );
    return { id: newMember.insertId, name };
  }

  calculateBMR(weight, height, age, sex, activityKoef, goalPercent) {
        if (isNaN(weight) || isNaN(height) || isNaN(age) || !['male', 'female'].includes(sex)) {
        throw new Error('Invalid input values for weight, height, age, or sex.');
    }

    if (isNaN(activityKoef) || activityKoef <= 0) {
        throw new Error('Invalid activity coefficient.');
    }

    if (isNaN(goalPercent) || goalPercent <= 0) {
        throw new Error('Invalid goal percent.');
    }

    const bmr = sex === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const calories = Math.round(bmr * activityKoef * goalPercent);
    const proteins = Math.round((calories * 0.3) / 4);
    const fats = Math.round((calories * 0.3) / 9);
    const carbs = Math.round((calories * 0.4) / 4);
 console.log(`BMR: ${bmr}, Calories: ${calories}, Proteins: ${proteins}, Fats: ${fats}, Carbs: ${carbs}`);

    return { calories, proteins, fats, carbs };
  }
  async addMemberInfo(memberId,
    activityId,
    goalId,
    weight,
    height,
    dateOfBirth,
    sex
  ) {
    const connection = await db.pool.getConnection();
    try {
      console.log({ weight, height, sex });
      if (isNaN(weight) || isNaN(height) || !['male', 'female'].includes(sex)) {
        throw new Error('Invalid input values for weight, height, or sex.');
    }
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
console.log({ goalPercent, activityRow});
      // Расчет КБЖУ с использованием формулы Mifflin-St Jeor
      const { calories, proteins, fats, carbs } = this.calculateBMR(weight, height, age, sex, activityKoef, goalPercent);
      console.log({ calories, proteins, fats, carbs});
      if (isNaN(calories) || isNaN(proteins) || isNaN(fats) || isNaN(carbs)) {
        throw new Error('Invalid calculations for calories, proteins, fats, or carbs.');
    }
      // Создание новых данных
      await connection.query(`
        INSERT INTO members_info (
          member_ID, activity_ID, goal_ID, weight, height, dateOfBirth,
          calories, proteins, fats, carbs, sex
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [memberId, activityId, goalId, weight, height, dateOfBirth, calories, proteins, fats, carbs, sex]);

      // Возвращаем все данные пользователя
      return {
        memberId,
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

  // Видалити мембера
  async deleteMember(memberId, userId) {
  console.log('Пытаемся удалить члена', memberId, userId);
  
  const [member] = await db.pool.execute(
    `
    SELECT * FROM Members
    WHERE id = ? AND user_ID = ?
    `,
    [memberId, userId]
  );
  console.log('Результат поиска члена:', member);
  
  if (member.length === 0) {
    throw new Error('Member not found or access denied');
  }

  await db.pool.execute(
    `
    DELETE FROM Members
    WHERE id = ?
    `,
    [memberId]
  );
  
  await db.pool.execute(
    `
    DELETE FROM Members_Info
    WHERE member_ID = ?
    `,
    [memberId]
  );
  
  return { message: 'Member deleted successfully' };
}


  // Отримати всіх мемберів користувача
  async getAllMembers(userId) {
    const [members] = await db.pool.execute(
      `
      SELECT id, name
      FROM members
      WHERE user_ID = ?
      `,
      [userId]
    );
    return members;
  }

  // Отримати конкретного мембера
  async getMemberById(memberId, userId) {
    const [member] = await db.pool.execute(
      `
      SELECT id, name
      FROM Members
      WHERE id = ? AND User_ID = ?
      `,
      [memberId, userId]
    );

    if (member.length === 0) {
      throw new Error('Member not found or access denied');
    }

    return member[0];
  }
  async updateMemberInfo(memberId, updateData) {
    const allowedFields = [
      'activityId', 'goalId', 'weight', 'height',
      'calories', 'proteins', 'fats', 'carbs',
      'dateOfBirth', 'sex'
    ];
  
    const setClauses = [];
    const values = [];
  
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        const dbField =
          field === 'activityId' ? 'activity_ID' :
          field === 'goalId' ? 'goal_ID' :
          field;
        setClauses.push(`${dbField} = ?`);
        values.push(updateData[field]);
      }
    }
  
    if (setClauses.length === 0) {
      throw new Error('Немає інформації для даних');
    }
  
    const sql = `
      UPDATE Members_Info
      SET ${setClauses.join(', ')}
      WHERE member_ID = ?
    `;
  
    values.push(memberId);
  
    const [result] = await db.pool.execute(sql, values);
    return { message: 'Інформація оновлена' };
  }
  

  // Отримати інформацію про конкретного мембера
  async getMemberInfo(memberId) {
  const connection = await db.pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT mi.*, m.name
      FROM Members_Info mi
      JOIN Members m ON mi.member_ID = m.id
      WHERE mi.member_ID = ?
      `,
      [memberId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}
  
}

module.exports = new MemberService();
