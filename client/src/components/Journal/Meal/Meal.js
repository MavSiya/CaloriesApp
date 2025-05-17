import { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';
import ButtonMeal from './ButtonMeal';
import ModalAddDish from './ModalAddDish';
import styles from './Meal.module.css';
import deleteIcon from '../../../styles/icon/btn_delete.png';

const Meal = ({ memberId }) => {
  const [expandedMealId, setExpandedMealId] = useState(null);
  const [modalMealId, setModalMealId] = useState(null);

  const { journalStore, store } = useContext(Context);
  const userId = store.user.id;

  const userIdToSend = memberId ? null : userId;
  const memberIdToSend = memberId || null;

  const meals = [
    { id: 1, name: 'Сніданок' },
    { id: 2, name: 'Обід' },
    { id: 3, name: 'Вечеря' },
    { id: 4, name: 'Перекус' },
  ];

  const toggleMeal = async (mealId) => {
    const isExpanding = expandedMealId !== mealId;
    if (isExpanding) {
      await journalStore.fetchMealDishes(mealId, memberIdToSend);
      await journalStore.fetchMealNutrients({ memberId: memberIdToSend, typeOfMealId: mealId });
    }

    setExpandedMealId(isExpanding ? mealId : null);
  };

  const openModal = (mealId) => {
    console.log('Opening modal for mealId:', mealId);
    setModalMealId(mealId);
  };

  const closeModal = async () => {
    if (modalMealId) {
      await journalStore.fetchMealDishes(modalMealId, memberIdToSend);
      await journalStore.fetchConsumed({ userId: userIdToSend, memberId: memberIdToSend });
      await journalStore.fetchMealNutrients({ memberId: memberIdToSend, typeOfMealId: modalMealId });
    }
    setModalMealId(null);
      window.location.reload();
  };

return (
    <div className={styles.mealContainer}>
      {meals.map((meal) => (
        <div key={meal.id}>
          <ButtonMeal
            mealName={meal.name}
            isActive={expandedMealId === meal.id}
            onToggle={() => toggleMeal(meal.id)}
            onAddDish={() => openModal(meal.id)}
          />

          {expandedMealId === meal.id && (
            <div className={styles.mealDetails}>
              <div className={styles.dishesList}>
                {journalStore.meals[meal.id]?.length > 0 ? (
                  journalStore.meals[meal.id].map((item, index) => (
                    <div key={index} className={styles.dishItem}>
                      <div className={styles.dishAndGram}>
                        <span className={styles.dishName}>
                          {item.dishTitle || item.ingredientTitle}
                        </span>
                        <span className={styles.dishWeight}>{item.weight} г</span>
                      </div>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                        className={styles.deleteButton}
                        onClick={async () => {
                          await journalStore.deleteFromMeal(item.id);
                          await journalStore.fetchMealDishes(meal.id, memberIdToSend);
                          await journalStore.fetchMealNutrients({ memberId: memberIdToSend, typeOfMealId: meal.id });
                          await journalStore.fetchConsumed({ userId: userIdToSend, memberId: memberIdToSend });
                          window.location.reload();
                        }}
                      >
                        <img src={deleteIcon} alt="Delete" width="20" height="20" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Немає доданих страв.</p>
                )}
              </div>

              <div className={styles.nutritionSummary}>
                {['calories', 'proteins', 'fats', 'carbs'].map((key) => (
                  <div className={styles.summaryItem} key={key}>
                    <span className={styles.summaryValue}>
                      {journalStore.nutrientsByMeal[meal.id]?.[key] || 0}
                    </span>
                    <span className={styles.summaryLabel}>
                      {{
                        calories: 'Ккал',
                        proteins: 'Білки',
                        fats: 'Жири',
                        carbs: 'Вуглеводи',
                      }[key]}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={styles.addDishButtonJournal}
                onClick={() => openModal(meal.id)}
              >
                +
              </button>
            </div>
          )}
        </div>
      ))}

      {modalMealId && (
        <ModalAddDish
          isOpen={true}
          onClose={closeModal}
          typeOfMealId={modalMealId}
          memberId={memberIdToSend}
        />
      )}
    </div>
  );
};

export default observer(Meal);
