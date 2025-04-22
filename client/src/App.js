import './App.css';
import PersonalPage from './components/PersonalPage/PersonalPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import LoginForm from './components/LoginForm/LoginForm';
import { useContext, useEffect } from 'react';
import { Context } from '.';
import { observer } from "mobx-react-lite";

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
    return (
      <LoginForm />
    );
  }

  return (
    <div>
      <h1>{store.isAuth ? 'Користувач авторизований' : 'Авторизуйтесь'}</h1>
     <h1>{store.user.isActivated ? 'Акаунт підтверджений по пошті' : 'Підтвердіть акаунт!'}</h1> 
      <button onClick={() => store.logout()}>Вийти</button>
    </div>
  );
};

export default observer(App);


