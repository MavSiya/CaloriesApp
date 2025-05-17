import * as memberService from '../service/member-service.js';

// Створити нового мембера
export async function createMember(req, res, next) {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        const result = await memberService.createMember(userId, name);
        return res.json(result);
    } catch (error) {
        next(error);
    }
}

// Додати інформацію про мембера
export async function addMemberInfo(req, res, next) {
    try {
        const { memberId, activityId, goalId, weight, height, dateOfBirth, sex } = req.body;
        const result = await memberService.addMemberInfo(
            memberId,
            activityId,
            goalId,
            weight,
            height,
            dateOfBirth,
            sex,
        );
        return res.json(result);
    } catch (error) {
        next(error);
    }
}

// Видалити мембера
export async function deleteMember(req, res, next) {
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
export async function getAllMembers(req, res, next) {
    try {
        const userId = req.user.id;
        const members = await memberService.getAllMembers(userId);
        return res.json(members);
    } catch (error) {
        next(error);
    }
}

// Отримати конкретного мембера
export async function getMemberById(req, res, next) {
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
export async function updateMemberInfo(req, res, next) {
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
export async function getMemberInfo(req, res, next) {
    try {
        const { memberId } = req.params;
        const memberInfo = await memberService.getMemberInfo(memberId);
        return res.json(memberInfo);
    } catch (error) {
        next(error);
    }
}

export async function getMemberNameById(req, res, next) {
    try {
        const { memberId } = req.params;
        const userId = req.user.id;
        const name = await memberService.getMemberNameById(memberId, userId);
        return res.json({ name });
    } catch (error) {
        next(error);
    }
}
