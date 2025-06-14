import './App.css';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import LoginForm from './components/LoginForm/LoginForm';
import { useContext, useEffect } from 'react';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import { Routes, Route, Navigate } from 'react-router-dom';

import JournalPage from './components/Journal/JournalPage/JournalPage';
import DishPage from './components/DishPage/DishPage';
import GroupPage from './components/GroupPage/GroupPage';
import CreateMemberPage from './components/MemberRegistrationPage/CreateMemberPage';
import MenuPage from './components/MenuPage/MenuPage';

function App() {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, [store]);

    if (store.isLoading) {
        return <div>Завантаження...</div>;
    }

    if (!store.isAuth) {
        return <LoginForm />;
    }

    return (
        <div>
            <h1>{store.isAuth ? '' : 'Авторизуйтесь'}</h1>
            <h1>{store.user.isActivated ? '' : 'Підтвердіть акаунт!'}</h1>
            <Routes>
                <Route path="/personal" element={<RegistrationPage />} />
                <Route path="/" element={<Navigate to="/personal" />} />
                <Route path="/journal" element={<JournalPage />} /> {/* Личный журнал */}
                <Route path="/group/journal/:memberId" element={<JournalPage />} />{' '}
                {/* Журнал члена группы */}
                <Route path="/dishes" element={<DishPage />} />
                <Route path="/group" element={<GroupPage />} />
                <Route path="/group/create" element={<CreateMemberPage />} />
                <Route path="/menu" element={<MenuPage />} />
            </Routes>
        </div>
    );
}

export default observer(App);
