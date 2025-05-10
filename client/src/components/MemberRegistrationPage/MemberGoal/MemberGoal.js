import {goals} from './MemberdataGoals.js'
import './MemberGoal.css'

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

 function MemberGoal({ isForMember = false }) {
  const { registrationStore, memberStore } = useContext(Context);
  const store = isForMember ? memberStore : registrationStore;

  const handleSelect = (id) => {
    if (isForMember) {
      memberStore.setMemberInfo({
        ...memberStore.memberInfo,
        goalId: memberStore.memberInfo.goalId === id ? null : id,
      });
    } else {
      store.setGoal(id === store.goalId ? null : id);
    }
  };

  const selectedId = isForMember ? memberStore.memberInfo.goalId : store.goalId;

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

export default observer(MemberGoal);