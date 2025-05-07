import { useContext, useEffect } from "react";
import { Context } from "../../../index";
import { observer } from "mobx-react-lite";
import "./Bmr.css";

function Bmr() {
  const { journalStore, store } = useContext(Context);
  const userId = store.user.id;
  const memberId = store.selectedMemberId || null;

  useEffect(() => {
    if (userId) {
      journalStore.fetchConsumed(userId, memberId);
      journalStore.fetchAllowed(userId, memberId);
    }
  }, [journalStore.currentDate, userId, memberId]);

  const { calories, proteins, fats, carbs } = journalStore.consumed;
  const { calories: maxCalories, proteins: maxProteins, fats: maxFats, carbs: maxCarbs } = journalStore.allowed;

  return (
    <div className="bmr-container">
      <div className="bmr-item">
        <div className="bmr-value">{calories}/{maxCalories}</div>
        <div className="bmr-label">Ккал</div>
      </div>
      <div className="bmr-item">
        <div className="bmr-value">{proteins}/{maxProteins}</div>
        <div className="bmr-label">Білки</div>
      </div>
      <div className="bmr-item">
        <div className="bmr-value">{fats}/{maxFats}</div>
        <div className="bmr-label">Жири</div>
      </div>
      <div className="bmr-item">
        <div className="bmr-value">{carbs}/{maxCarbs}</div>
        <div className="bmr-label">Вуглеводи</div>
      </div>
    </div>
  );
}

export default observer(Bmr);
