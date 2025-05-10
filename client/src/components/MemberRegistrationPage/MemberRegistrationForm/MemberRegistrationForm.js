import './MemberRegistrationForm.css'

import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../index";

function MemberRegistrationForm({ isForMember = false }){
    const { registrationStore, memberStore } = useContext(Context);
 const store = isForMember ? memberStore.memberInfo : registrationStore;
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
            memberStore.memberInfo = {
                ...memberStore.memberInfo,
                sex: memberStore.memberInfo.sex === sex ? "" : sex
            };
        } else {
            registrationStore.setSex(sex === registrationStore.sex ? "" : sex);
        }
    };

    const handleInputChange = (field, value) => {
 if (isForMember) {
         memberStore.setField(field, value); 
        } else {
            registrationStore.setField(field, value);
        }
};


    return(<section className="total_block">
    <section className="form_block">
<form className="block first">
    <div className="block">
    <label htmlFor="name">Ім'я</label>
    <input className="input" type="text" id="name" value={store.name || ''}  onChange={(e) => handleInputChange('name', e.target.value)} />
    </div>

    <div className="block">
    <label htmlFor="dob">Дата народження</label>
    <input className="input" type="date" id="dob"  value={store.dob} onChange={handleChange("dob") || ''}/>
    </div>
    <div className="block">
      <h2>Стать</h2>
      <div className="sex-buttons">
        <button type="button"
          className={`sex-button ${store.sex === "female" ? "active" : ""}`}
          onClick={() => handleSelect("female")}
        >
          Жінка
        </button>
        <button  type="button"
          className={`sex-button ${store.sex === "male" ? "active" : ""}`}
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
    <input className="input small" type="number" id="weight" value={store.weight} onChange={handleChange("weight") || ''} />
    </div>

    <div className="block">
    <label htmlFor="height">Зріст, см</label>
    <input className="input small" type="number" id="height" value={store.height} onChange={handleChange("height")}/>
    </div>
</form>
</section>
    )
}

export default observer(MemberRegistrationForm);