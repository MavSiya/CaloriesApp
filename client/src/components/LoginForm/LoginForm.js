import { useContext, useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import './LoginForm.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { store } = useContext(Context);

    return (
        <div className="login-form">
            <div>
                {' '}
                <img src="/img/logo.png" alt="logo" />
            </div>

            <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="Email"
            />

            <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
            />

            <button className="button login" onClick={() => store.login(email, password)}>
                Логин
            </button>
            <button className="button login" onClick={() => store.registration(email, password)}>
                Регистрация
            </button>
        </div>
    );
}

export default observer(LoginForm);
