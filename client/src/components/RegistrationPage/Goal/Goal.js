import { goals } from './dataGoals.js';
import './Goal.css';
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../index";

function GoalButton({ id, isActive, onClick, type }) {
  return (
    <li>
      <button
        onClick={() => onClick(id)}
        className={`button_goal ${isActive ? 'active' : ''}`}
      >
        <h2 className="title_goal">{type}</h2>
      </button>
    </li>
  );
}

function Goal({ isForMember = false }) {
  const { registrationStore, memberStore } = useContext(Context);
  const store = isForMember ? memberStore : registrationStore;

  const handleSelect = (id) => {
    // Якщо isForMember, то змінюємо goalId в MemberStore, інакше в RegistrationStore
    store.setGoal(store.goalId === id ? null : id);
  };

  // Отримуємо обране значення goalId залежно від того, чи це для члена групи
  const selectedId = isForMember ? memberStore.goalId : store.goalId;

  return (
    <>
      <h1>Ціль</h1>
      <ul>
        {goals.map((goal) => (
          <GoalButton
            key={goal.id}
            isActive={goal.id === selectedId}
            id={goal.id}
            onClick={handleSelect}
            type={goal.type}
          />
        ))}
      </ul>
    </>
  );
}

export default observer(Goal);
