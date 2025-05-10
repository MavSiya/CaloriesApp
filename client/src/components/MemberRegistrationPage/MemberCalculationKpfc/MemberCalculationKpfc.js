import './MemberCalculationKpfc.css'

import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../index";

function MemberCalculationKpfc({ isForMember = false }) {
  const { registrationStore, memberStore } = useContext(Context);
  const store = isForMember ? memberStore.memberInfo : registrationStore;

  return (
    <>
      <h1>Ваші потреби</h1>
      <div className="elements">
        <section className="element"> 
          <h2>{store.totalCalories || 0}</h2>
          <h2>Ккал</h2>
        </section>
        <div className="vertical-line"></div>
        <section className="element"> 
          <h2>{store.proteins || 0}</h2>
          <h2>Білки</h2>
        </section>
        <div className="vertical-line"></div>
        <section className="element"> 
          <h2>{store.fats || 0}</h2>
          <h2>Жири</h2>
        </section>
        <div className="vertical-line"></div>
        <section className="element"> 
          <h2>{store.carbs || 0}</h2>
          <h2>Вуглеводи</h2>
        </section>
      </div>
    </>
  );
}


export default observer(MemberCalculationKpfc);
