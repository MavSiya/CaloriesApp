import * as memberService from '../service/member-service.js';

// Створити нового мембера
export async function createMember(req, res) {
    const userId = req.user.id;
    const { name } = req.body;
    const result = await memberService.createMember(userId, name);
    return res.json(result);
}

// Додати інформацію про мембера
export async function addMemberInfo(req, res) {
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
}

// Видалити мембера
export async function deleteMember(req, res) {
    const userId = req.user.id;
    const { memberId } = req.params;
    console.log('Удаляем члена контролер', memberId, userId);
    const result = await memberService.deleteMember(memberId, userId);
    return res.json(result);
}

// Отримати всіх мемберів користувача
export async function getAllMembers(req, res) {
    const userId = req.user.id;
    const members = await memberService.getAllMembers(userId);
    return res.json(members);
}

// Отримати конкретного мембера
export async function getMemberById(req, res) {
    const { memberId } = req.params;
    const userId = req.user.id;
    const member = await memberService.getMemberById(memberId, userId);
    return res.json(member);
}

// Оновити інформацію про мембера
export async function updateMemberInfo(req, res) {
    const { memberId } = req.params;
    const updateData = req.body;

    const result = await memberService.updateMemberInfo(Number(memberId), updateData);
    return res.json(result);
}

// Отримати інформацію про конкретного мембера
export async function getMemberInfo(req, res) {
    const { memberId } = req.params;
    const memberInfo = await memberService.getMemberInfo(memberId);
    return res.json(memberInfo);
}

export async function getMemberNameById(req, res) {
    const { memberId } = req.params;
    const userId = req.user.id;
    const name = await memberService.getMemberNameById(memberId, userId);
    return res.json({ name });
}
