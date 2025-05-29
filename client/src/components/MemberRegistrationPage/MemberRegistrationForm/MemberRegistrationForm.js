import './RegistrationForm.css';

import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';

function MemberRegistrationForm() {
    const { memberStore } = useContext(Context);

    const handleChange = (field) => (e) => {
        memberStore.setField(field, e.target.value); // обновляем данные в store
    };

    const handleSelect = (sex) => {
        memberStore.setSex(sex); // устанавливаем пол
    };

    return (
        <section className="total_block">
            <section className="form_block">
                <form className="block first">
                    <div className="block">
                        <label htmlFor="name">Ім'я</label>
                        <input
                            className="input"
                            type="text"
                            id="name"
                            value={memberStore.name}
                            onChange={handleChange('name')} // передаем в store
                        />
                    </div>
                    <div className="block">
                        <label htmlFor="dob">Дата народження</label>
                        <input
                            className="input"
                            type="date"
                            id="dob"
                            value={memberStore.dob}
                            onChange={handleChange('dob')}
                        />
                    </div>
                    <div className="block">
                        <h2>Стать</h2>
                        <div className="sex-buttons">
                            <button
                                type="button"
                                className={`sex-button ${memberStore.sex === 'female' ? 'active' : ''}`}
                                onClick={() => handleSelect('female')}
                            >
                                Жінка
                            </button>
                            <button
                                type="button"
                                className={`sex-button ${memberStore.sex === 'male' ? 'active' : ''}`}
                                onClick={() => handleSelect('male')}
                            >
                                Чоловік
                            </button>
                        </div>
                    </div>
                </form>
            </section>
            <form className="block small">
                <div className="block first">
                    <label htmlFor="weight">Вага, кг</label>
                    <input
                        className="input small"
                        type="number"
                        id="weight"
                        value={memberStore.weight}
                        onChange={handleChange('weight')}
                    />
                </div>
                <div className="block">
                    <label htmlFor="height">Зріст, см</label>
                    <input
                        className="input small"
                        type="number"
                        id="height"
                        value={memberStore.height}
                        onChange={handleChange('height')}
                    />
                </div>
            </form>
        </section>
    );
}

export default observer(MemberRegistrationForm);
