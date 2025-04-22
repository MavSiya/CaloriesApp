import { useState } from "react"
import './RegistrationForm.css'

export default function RegistrationForm(){
    const [name, setName] = useState('')
    const [dob, setDob] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')

    return(<section className="total_block">
    <section className="form_block">
<form className="block first">
    <div className="block">
    <label htmlFor="name">Ім'я</label>
    <input className="input" type="text" id="name" value={name} onChange={event => setName(event.target.value)}/>
    </div>

    <div className="block">
    <label htmlFor="dob">Дата народження</label>
    <input className="input" type="date" id="dob" value={dob} onChange={event => setDob(event.target.value)}/>
    </div>
    </form>

    <form>
    <div className="block">
    <label htmlFor="mail">Пошта</label>
    <input className="input" type="email" id="mail" value={mail} onChange={event => setMail(event.target.value)}/>
    </div>

    <div className="block">
    <label htmlFor="password">Пароль</label>
    <input className="input" type="text" id="password" value={password} onChange={event => setPassword(event.target.value)}/>
    </div>
</form>
</section>
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
</section>
    )
}