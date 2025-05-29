import './CalculationKpfc.css';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';

function MemberCalculationKpfc() {
    const { memberStore } = useContext(Context);

    return (
        <>
            <h1>Ваші потреби</h1>
            <div className="elements">
                <section className="element">
                    <h2>{memberStore.totalCalories || 0}</h2>
                    <h2>Ккал</h2>
                </section>
                <div className="vertical-line"></div>
                <section className="element">
                    <h2>{memberStore.proteins || 0}</h2>
                    <h2>Білки</h2>
                </section>
                <div className="vertical-line"></div>
                <section className="element">
                    <h2>{memberStore.fats || 0}</h2>
                    <h2>Жири</h2>
                </section>
                <div className="vertical-line"></div>
                <section className="element">
                    <h2>{memberStore.carbs || 0}</h2>
                    <h2>Вуглеводи</h2>
                </section>
            </div>
        </>
    );
}

export default observer(MemberCalculationKpfc);
