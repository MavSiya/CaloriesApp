import $api from '../http';

export async function login(email, password) {
    return $api.post('/login', { email, password });
}

export async function registration(email, password) {
    return $api.post('/registration', { email, password });
}

export async function logout() {
    return $api.post('/logout');
}
