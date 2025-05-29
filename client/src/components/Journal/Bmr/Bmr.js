import { useContext, useEffect } from 'react';
import { Context } from '../../../index';
import { observer } from 'mobx-react-lite';
import './Bmr.css';

function Bmr({ memberId }) {
    const { journalStore, store } = useContext(Context);
    const userId = store.user.id;
    const userIdToSend = memberId ? null : userId;
    const memberIdToSend = memberId || null;

    useEffect(() => {
        if (userIdToSend || memberIdToSend) {
            console.log('memberId in bmr:', memberIdToSend);
            console.log('userId in bmr:', userIdToSend);
            journalStore.fetchConsumed(userIdToSend, memberIdToSend);
            journalStore.fetchAllowed({ userId: userIdToSend, memberId: memberIdToSend });
        }
    }, [journalStore.currentDate, userId, memberId]);

    const { calories, proteins, fats, carbs } = journalStore.consumed;
    const {
        calories: maxCalories,
        proteins: maxProteins,
        fats: maxFats,
        carbs: maxCarbs,
    } = journalStore.allowed;

    return (
        <div className="bmr-container">
            <div className="bmr-item">
                <div className="bmr-value">
                    {calories}/{maxCalories}
                </div>
                <div className="bmr-label">Ккал</div>
            </div>
            <div className="bmr-item">
                <div className="bmr-value">
                    {proteins}/{maxProteins}
                </div>
                <div className="bmr-label">Білки</div>
            </div>
            <div className="bmr-item">
                <div className="bmr-value">
                    {fats}/{maxFats}
                </div>
                <div className="bmr-label">Жири</div>
            </div>
            <div className="bmr-item">
                <div className="bmr-value">
                    {carbs}/{maxCarbs}
                </div>
                <div className="bmr-label">Вуглеводи</div>
            </div>
        </div>
    );
}

export default observer(Bmr);
