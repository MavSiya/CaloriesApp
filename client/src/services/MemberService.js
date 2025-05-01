import $api from "../http";

export default class MemberService {
  // Створення нової персони
  static async createMember({ userId, name }) {
    return $api.post('/member/create-member', { userId, name });
  }

  // Додавання інформації про персону
  static async addMemberInfo({ memberId, activityId, goalId, weight, height, calories, proteins, fats, carbs, dateOfBirth }) {
    return $api.post('/member/add-info', { memberId, activityId, goalId, weight, height, calories, proteins, fats, carbs, dateOfBirth });
  }

  // Видалення персони
  static async deleteMember({ memberId, userId }) {
    return $api.delete(`/member/delete/${memberId}`, { data: { userId } });
  }

  // Отримання всії членів групи
  static async getAllMembers(userId) {
    return $api.get('/member/all-member', {
      params: { userId }
    });
  }

  // Отримання конктерного члену групи
  static async getMemberById({ memberId, userId }) {
    return $api.get(`/member/${memberId}`, {
      params: { userId }
    });
  }

  // Оновлення інформації про персону
  static async updateMemberInfo({ memberId, activityId, goalId, weight, height, calories, proteins, fats, carbs, dateOfBirth }) {
    return $api.put(`/member/update/${memberId}`, { activityId, goalId, weight, height, calories, proteins, fats, carbs, dateOfBirth });
  }

  // Отримання інформації про конкретну персону
  static async getMemberInfo(memberId) {
    return $api.get(`/member/info/${memberId}`);
  }
}
