import { activities } from "../../dataActivity"
import ActivityButton from './ActivityButton'
import './ActivityChoice.css'
import { useState } from 'react';

function ActivityChoiceButton(props){
    return(
    <li>
    <p>
    <ActivityButton id={props.id} 
    isActive={props.isActive} 
    onClick={() => props.onClick(props.id)}>
        <h2 className="title_activity">{props.title}</h2>
        <span className="description_activity">{props.description}</span>
    </ActivityButton>
    </p>
</li>
    )
}

export default function ActivityChoice(){
    const [isPressedId, setIsPressedId] = useState(null);
    const toggleClass = (id) => {
        setIsPressedId(id === isPressedId ? null : id)
       };
  return(
<>
<section className="all_activities">
<h1>Активність</h1>
    <ul className="activities">
        {activities.map((activity) => (
     <ActivityChoiceButton
     key={activity.id} 
     isActive={activity.id === isPressedId}
     id={activity.id}
     onClick ={toggleClass}
     title={activity.title} 
     description={activity.description}/>
        ))
        }
    </ul>
</section>
</>)
}