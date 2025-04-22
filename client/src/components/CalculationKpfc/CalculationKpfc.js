import { useState } from "react";
import './CalculationKpfc.css'

export default function CalculationKpfc() {
    const [kkal, setKkal] = useState('1700')
    const [proteins, setProteins] = useState('100')
    const [fats, setFats] = useState('100')
    const [carbohydrates, setCarbohydrates] = useState('100')
  return (
   <>
<h1>Ваші потреби</h1>

<div className="elements">
    <section className="element"> 
        <h2>{kkal}</h2>
        <h2>Ккал</h2>
    </section>
<div className="vertical-line"></div>
<section className="element"> 
        <h2>{proteins}</h2>
        <h2>Білки</h2>
    </section>
<div className="vertical-line"></div>
<section className="element"> 
        <h2>{fats}</h2>
        <h2>Жири</h2>
    </section>
<div className="vertical-line"></div>
<section className="element"> 
        <h2>{carbohydrates}</h2>
        <h2>Вуглеводи</h2>
    </section>
</div>
 </>
  );
}