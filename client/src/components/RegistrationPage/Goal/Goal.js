import {goals} from './dataGoals.js'
import './Goal.css'

import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../index";

function GoalButton({ id, isActive, onClick, type }) {
    return (
      <li className='goal_item_li'>
        <button
          onClick={() => onClick(id)}
          className={`button_goal ${isActive ? 'active' : ''}`}
        >
          <h2 className="title_goal">{type}</h2>
        </button>
      </li>
    );
  }

 function Goal(){
    const { registrationStore } = useContext(Context);
    const handleSelect = (id) => {
        registrationStore.setGoal(id === registrationStore.goalId ? null : id);
      };
    
    return(<>
    <section className='goal_block'>
<h1>Ціль</h1>
<ul className='goal_item'>
    {goals.map((goal) => (
      <GoalButton 
      key={goal.id} 
      isActive={goal.id === registrationStore.goalId}
      id={goal.id}
      onClick={handleSelect}
      type={goal.type}
    />
    ))}
</ul>
</section>
</>)
}

export default observer(Goal);