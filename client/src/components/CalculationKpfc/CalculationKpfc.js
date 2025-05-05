import './CalculationKpfc.css'

import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../index";

function CalculationKpfc() {
    const { registrationStore } = useContext(Context);
  return (
   <>
<h1>Ваші потреби</h1>

<div className="elements">
    <section className="element"> 
        <h2>{registrationStore.totalCalories || 0}</h2>
        <h2>Ккал</h2>
    </section>
<div className="vertical-line"></div>
<section className="element"> 
        <h2>{registrationStore.proteins || 0}</h2>
        <h2>Білки</h2>
    </section>
<div className="vertical-line"></div>
<section className="element"> 
        <h2>{registrationStore.fats || 0}</h2>
        <h2>Жири</h2>
    </section>
<div className="vertical-line"></div>
<section className="element"> 
        <h2>{registrationStore.carbs || 0}</h2>
        <h2>Вуглеводи</h2>
    </section>
</div>
 </>
  );
}

export default observer(CalculationKpfc);