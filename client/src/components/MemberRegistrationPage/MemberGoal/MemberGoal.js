import { goals } from './MemberdataGoals.js';
import './MemberGoal.css';
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

function MemberGoal() {
  const { memberStore } = useContext(Context);
  const { goalId, setGoal } = memberStore;

  const handleSelect = (id) => {
      setGoal(goalId === id ? null : id); 
  };

  return (
    <>
      <h1>Ціль</h1>
      <ul>
        {goals.map((goal) => (
          <GoalButton
            key={goal.id}
            isActive={goal.id === goalId}
            id={goal.id}
            onClick={handleSelect}
            type={goal.type}
          />
        ))}
      </ul>
    </>
  );
}

export default observer(MemberGoal);
