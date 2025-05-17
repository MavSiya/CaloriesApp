import * as userService from '../service/user-service.js';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api-error.js';

export async function registration(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Помилка при валідації', errors.array()));
    }
    const { email, password } = req.body;
    const userData = await userService.registration(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    return res.json(userData);
}

export async function login(req, res) {
    const { email, password } = req.body;
    const userData = await userService.login(email, password);
    res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    return res.json(userData);
}

export async function logout(req, res) {
    const { refreshToken } = req.cookies;
    const token = await userService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
}

export async function activate(req, res) {
    const activationLink = req.params.link;
    await userService.activate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
}

export async function refresh(req, res) {
    const { refreshToken } = req.cookies;
    const userData = await userService.refresh(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    return res.json(userData);
}

export async function getUsers(req, res) {
    const users = await userService.getAllUsers();
    return res.json(users);
}
