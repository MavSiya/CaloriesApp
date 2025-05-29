const API_URL = 'http://localhost:5000/api';

// Створення даних про користувача
export async function createUserInfo({
    activityId,
    goalId,
    weight,
    height,
    dateOfBirth,
    sex,
    name,
}) {
    try {
        const response = await fetch(`${API_URL}/userInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                activityId,
                goalId,
                weight,
                height,
                dateOfBirth,
                sex,
                name,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Помилка при створенні інформації про користувача');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Помилка при створенні інформації про користувача:', error.message);
        throw error;
    }
}

// Оновлення даних про користувача
export async function updateUserInfo({
    activityId,
    goalId,
    weight,
    height,
    dateOfBirth,
    sex,
    name,
}) {
    try {
        const response = await fetch(`${API_URL}/userInfo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                activityId,
                goalId,
                weight,
                height,
                dateOfBirth,
                sex,
                name,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Помилка при оновлені інформації про користувача');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Помилка при оновлені інформації про користувача:', error.message);
        throw error;
    }
}

// Метод для отримання даних про користувача
export async function getUserInfo() {
    try {
        const response = await fetch(`${API_URL}/userInfo`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Токен из localStorage
            },
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Помилка при отриманні інформації про користувача');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Помилка при отриманні інформації про користувача:', error.message);
        throw error;
    }
}
