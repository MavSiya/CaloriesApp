const memberService = require('../service/member-service');

class MemberController {
  // Створити нового мембера
  async createMember(req, res, next) {
    try {
      const userId = req.user.id;
      const {name } = req.body;
      const result = await memberService.createMember(userId, name);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Додати інформацію про мембера
  async addMemberInfo(req, res, next) {
    try {
      const { memberId, activityId, goalId, weight, height, dateOfBirth, sex } = req.body;
      const result = await memberService.addMemberInfo(
        memberId, activityId, goalId, weight, height, dateOfBirth, sex
      );
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Видалити мембера
  async deleteMember(req, res, next) {
    try {
      const userId = req.user.id;
      const { memberId } = req.params;
            console.log('Удаляем члена контролер', memberId, userId);
      const result = await memberService.deleteMember(memberId, userId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Отримати всіх мемберів користувача
  async getAllMembers(req, res, next) {
    try {
      const userId = req.user.id;
      const members = await memberService.getAllMembers(userId);
      return res.json(members);
    } catch (error) {
      next(error);
    }
  }

  // Отримати конкретного мембера
  async getMemberById(req, res, next) {
    try {
      const { memberId } = req.params;
      const userId = req.user.id;
      const member = await memberService.getMemberById(memberId, userId);
      return res.json(member);
    } catch (error) {
      next(error);
    }
  }

  // Оновити інформацію про мембера
  async updateMemberInfo(req, res, next) {
    try {
      const { memberId } = req.params;
      const updateData = req.body;
  
      const result = await memberService.updateMemberInfo(Number(memberId), updateData);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
  

  // Отримати інформацію про конкретного мембера
  async getMemberInfo(req, res, next) {
    try {
      const { memberId } = req.params;
      const memberInfo = await memberService.getMemberInfo(memberId);
      return res.json(memberInfo);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MemberController();
