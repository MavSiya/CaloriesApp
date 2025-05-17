import db from '../data-base/db.js';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { sendActivationMail } from './mail-service.js';
import { findToken, generateTokens, removeToken, saveToken, validateRefreshToken } from './token-service.js';
import UserDto from '../dtos/user-dto.js';
import ApiError from '../exceptions/api-error.js';

export async function registration(email, password) {
    //Перевіряємо чи є такий користувач

    const [candidates] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (candidates.length > 0) {
        // Если пользователь с таким email уже существует, выбрасываем ошибку
        throw ApiError.BadRequest(`Користувач з такою поштою ${email} вже існує`);
    }

    //Хешируємо пароль
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    //Створюємо користувача
    const [result] = await db.query(
        'INSERT INTO users (email, password, activationLink) VALUES (?, ?, ?)',
        [email, hashPassword, activationLink],
    );

    const user = {
        id: result.insertId,
        email,
        password: hashPassword,
        isActivated: false,
        activationLink,
    };
    const userDto = new UserDto(user);
    //Відправляємо листа
    await sendActivationMail(
        email,
        `${process.env.API_URL}/api/activate/${activationLink}`,
    );

    //Створюємо токени

    const tokens = generateTokens({ ...userDto });
    await saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
}

export async function activate(activationLink) {
    const [users] = await db.query('SELECT * FROM users WHERE activationLink = ?', [
        activationLink,
    ]);
    if (users.length === 0) {
        throw ApiError.BadRequest('Некорректна активаційна силка');
    }

    await db.query('UPDATE users SET isActivated = true WHERE activationLink = ?', [
        activationLink,
    ]);
}

export async function login(email, password) {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
        throw ApiError.BadRequest(`Користувач з такою поштою не знайдено`);
    }
    const user = users[0];

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
        throw ApiError.BadRequest(`Неправильний пароль`);
    }

    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });
    await saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
}

export async function logout(refreshToken) {
    const token = await removeToken(refreshToken);
    return token;
}

export async function refresh(refreshToken) {
    if (!refreshToken) {
        throw ApiError.UnauthorizedError();
    }
    const userData = validateRefreshToken(refreshToken);
    const tokenFromDb = await findToken(refreshToken);
    if (!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError();
    }
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userData.id]);
    const user = users[0];
    const userDto = new UserDto(user);
    const tokens = generateTokens({ ...userDto });

    await saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
}

export async function getAllUsers() {
    const [users] = await db.query('SELECT * FROM users');
    return users;
}
