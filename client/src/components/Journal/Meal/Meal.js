import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';
import ButtonMeal from './ButtonMeal';
import ModalAddDish from './ModalAddDish';
import './Meal.css';

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
    console.log('Toggling meal:', mealId, isExpanding);
    if (isExpanding) {
      await journalStore.fetchMealDishes(mealId,memberIdToSend);
      await journalStore.fetchMealNutrients({memberId: memberIdToSend, typeOfMealId:mealId});
    }

    setExpandedMealId(isExpanding ? mealId : null);
  };

  const openModal = (mealId) => {
    console.log('Opening modal for mealId:', mealId);
    setModalMealId(mealId);
  };

  const closeModal = async () => {
    if (modalMealId) {
      await journalStore.fetchMealDishes(modalMealId,memberIdToSend);
      await journalStore.fetchConsumed({ userId: userIdToSend, memberId: memberIdToSend });
    }
    setModalMealId(null);
  };

  return (
    <div className="meal-container">
      {meals.map((meal) => (
        <div key={meal.id}>
          <ButtonMeal
            mealName={meal.name}
            isActive={expandedMealId === meal.id}
            onToggle={() => toggleMeal(meal.id)}
            onAddDish={() => openModal(meal.id)}
          />

          {expandedMealId === meal.id && (
            <div className="meal-details">
              <div className="dishes-list">
                {journalStore.meals[meal.id]?.length > 0 ? (
                  journalStore.meals[meal.id].map((item, index) => (
                    <div key={index} className="dish-item">
                      <span className="dish-name">{item.dishTitle || item.ingredientTitle}</span>
                      <span className="dish-weight">{item.weight} г</span>
                      <button
    className="delete-button"
    onClick={async () => {
      await journalStore.deleteFromMeal(item.id); 
      await journalStore.fetchMealDishes(meal.id, memberIdToSend); 
      await journalStore.fetchMealNutrients({ memberId: memberIdToSend, typeOfMealId: meal.id }); 
      await journalStore.fetchConsumed({ userId: userIdToSend, memberId: memberIdToSend }); 
    }}
  >
    ❌
  </button>
                    </div>
                  ))
                ) : (
                  <p>Немає доданих страв.</p>
                )}
              </div>

              <div className="nutrition-summary">
                {['calories', 'proteins', 'fats', 'carbs'].map((key) => (
                  <div className="summary-item" key={key}>
                    <span className="summary-value">
                      {journalStore.nutrientsByMeal[meal.id]?.[key] || 0}
                    </span>
                    <span className="summary-label">
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

              <button className="add-dish-button" onClick={() => openModal(meal.id)}>
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
