import { useState } from 'react';
import {goals} from './dataGoals.js'
import './Goal.css'

function GoalButton(props){
    return(
<li>
<p>

<button 
id={props.id} 
isActive={props.isActive} 
onClick={() => props.onClick(props.id)}
className={`button_goal ${props.isActive === props.id ? "active" : ""}` }>
<h2 className="title_goal">{props.type}</h2>
</button>

</p>
</li>
)}

export default function Goal(){
    const [isPressedId, setIsPressedId] = useState(null);
        const toggleClass = (id) => {
            setIsPressedId(id === isPressedId ? null : id)
           };
    return(<>
<h1>Ціль</h1>
<ul>
    {goals.map((goal) => (
        <GoalButton 
        key={goal.id} 
        isActive={goal.id === isPressedId}
        id={goal.id}
        onClick ={toggleClass}>{goal.type}</GoalButton>
    ))}
</ul>
</>)
}