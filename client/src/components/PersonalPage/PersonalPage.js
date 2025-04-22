import { useState } from "react";
import CalculationKpfc from "../CalculationKpfc/CalculationKpfc";
import Header from "../Header/Header";
import './PersonalPage.css'
import ActivityChoice from "../ActivityChoice/ActivityChoice";
import Goal from "../Goal/Goal";


export default function PersonalPage(){
    const [name, setName] = useState('User')
    const [weight, setWeight] = useState('60')
    const [height, setHeight] = useState('165')
    return(<>
        <Header/>
        <div className="data">
     <div className="block_name_and_activity"> 
        <div className="block_name_and_wh">
        <div className="name">
        <label> Ім'я:</label> 
        <text className="text">{name}</text>
        </div>

        <form className="block small ">
<div className="block first">
    <label htmlFor="weight">Вага, кг</label>
    <input className="input small" type="number" id="weight" value={weight} onChange={event => setWeight(event.target.value)}/>
    </div>

    <div className="block">
    <label htmlFor="height">Зріст, см</label>
    <input className="input small" type="number" id="height" value={height} onChange={event => setHeight(event.target.value)}/>
    </div>
</form>
<Goal />
</div>
<ActivityChoice/>
</div>
</div>   
       <div className='calculationKpfc'>
        <CalculationKpfc/>
        </div>
        </>)
}