const API_URL = "http://localhost:5000/api";

class MemberService {
  async createMember(userId, name) {
    try {
      const response = await fetch(`${API_URL}/create-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, name })
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Помилка створення члена');
      return await response.json();
    } catch (error) {
      console.error('Помилка створення члена:', error.message);
      throw error;
    }
  }

  async addMemberInfo(memberId, activityId, goalId, weight, height, dateOfBirth, sex) {
    try {
      const response = await fetch(`${API_URL}/add-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ memberId, activityId, goalId, weight, height, dateOfBirth, sex })
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Помилка додавання інформації');
      return await response.json();
    } catch (error) {
      console.error('Помилка додавання інформації:', error.message);
      throw error;
    }
  }

  async deleteMember(memberId, userId) {
    try {
      const response = await fetch(`${API_URL}/${memberId}?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Помилка видалення члена');
      return await response.json();
    } catch (error) {
      console.error('Помилка видалення члена:', error.message);
      throw error;
    }
  }

  async getAllMembers(userId) {
    try {
      const response = await fetch(`${API_URL}/all-member?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Помилка отримання членів');
      return await response.json();
    } catch (error) {
      console.error('Помилка отримання членів:', error.message);
      throw error;
    }
  }

  async getMemberById(memberId, userId) {
    try {
      const response = await fetch(`${API_URL}/${memberId}?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Помилка отримання члена');
      return await response.json();
    } catch (error) {
      console.error('Помилка отримання члена:', error.message);
      throw error;
    }
  }

  async updateMemberInfo(memberId, activityId, goalId, weight, height, calories, proteins, fats, carbs, dateOfBirth, sex) {
    try {
      const response = await fetch(`${API_URL}/update/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ activityId, goalId, weight, height, calories, proteins, fats, carbs, dateOfBirth, sex })
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Помилка оновлення члена');
      return await response.json();
    } catch (error) {
      console.error('Помилка оновлення члена:', error.message);
      throw error;
    }
  }

  async getMemberInfo(memberId) {
    try {
      const response = await fetch(`${API_URL}/info/${memberId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error((await response.json()).message || 'Помилка отримання інформації про члена');
      return await response.json();
    } catch (error) {
      console.error('Помилка отримання інформації про члена:', error.message);
      throw error;
    }
  }
}

export default new MemberService();
