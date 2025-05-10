import './RegistrationForm.css'
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Context } from "../../../index";

function RegistrationForm({ isForMember = false }) {
    const { registrationStore, memberStore } = useContext(Context);
    const store = isForMember ? memberStore : registrationStore;

    // Перевірка, чи потрібно завантажити інформацію для члена
    useEffect(() => {
        if (isForMember && memberStore.selectedMember && !memberStore.isLoading) {
            memberStore.fetchMemberInfo(memberStore.selectedMember.id); // Запит на отримання даних для обраного члена
        }
    }, [isForMember, memberStore.selectedMember, memberStore]);

    if (isForMember && !store) {
        // Ще не завантажено дані — можна показати заглушку або нічого
        return <div>Завантаження даних...</div>;
    }

    const handleChange = (field) => (e) => {
        if (isForMember) {
            memberStore.setField(field, e.target.value);
        } else {
            registrationStore.setField(field, e.target.value);
        }
    };

    const handleSelect = (sex) => {
        if (isForMember) {
            memberStore.setSex(sex === memberStore.sex ? "" : sex);
        } else {
            registrationStore.setSex(sex === registrationStore.sex ? "" : sex);
        }
    };

    return (
        <section className="total_block">
            <section className="form_block">
                <form className="block first">
                    <div className="block">
                        <label htmlFor="name">Ім'я</label>
                        <input className="input" type="text" id="name" value={store?.name || ''} onChange={handleChange("name")} />
                    </div>

                    <div className="block">
                        <label htmlFor="dob">Дата народження</label>
                        <input className="input" type="date" id="dob" value={store?.dob || ''} onChange={handleChange("dob")} />
                    </div>
                    <div className="block">
                        <h2>Стать</h2>
                        <div className="sex-buttons">
                            <button type="button"
                                className={`sex-button ${store?.sex === "female" ? "active" : ""}`}
                                onClick={() => handleSelect("female")}
                            >
                                Жінка
                            </button>
                            <button type="button"
                                className={`sex-button ${store?.sex === "male" ? "active" : ""}`}
                                onClick={() => handleSelect("male")}
                            >
                                Чоловік
                            </button>
                        </div>
                    </div>
                </form>
            </section>
            <form className="block small ">
                <div className="block first">
                    <label htmlFor="weight">Вага, кг</label>
                    <input className="input small" type="number" id="weight" value={store?.weight || ''} onChange={handleChange("weight")} />
                </div>

                <div className="block">
                    <label htmlFor="height">Зріст, см</label>
                    <input className="input small" type="number" id="height" value={store?.height || ''} onChange={handleChange("height")} />
                </div>
            </form>
        </section>
    );
}

export default observer(RegistrationForm);
