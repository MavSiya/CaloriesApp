import { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';
import ButtonMenuMeal from '../ButtonMenuMeal/ButtonMenuMeal.js';
import ModalAddDishToMenu from '../ModalAddDishToMenu/ModalAddDishToMenu.js';
import './MenuMeal.css';
import deleteIcon from '../../../styles/icon/btn_delete.png';

const MenuMeal = ({ dayOfWeekId }) => {
  const [modalMealId, setModalMealId] = useState(null);
  const { menuStore, store } = useContext(Context);
  const userId = store.user.id;

  const meals = [
    { id: 1, name: 'Сніданок' },
    { id: 2, name: 'Обід' },
    { id: 3, name: 'Вечеря' },
    { id: 4, name: 'Перекус' },
  ];

  useEffect(() => {
    menuStore.fetchMenu(userId);
  }, [menuStore.isUpdated]);

  const openModal = (mealId) => {
    setModalMealId(mealId);
  };

  const closeModal = async () => {
    await menuStore.fetchMenu(userId);
      await menuStore.fetchAggregatedIngredients(userId); 
    setModalMealId(null);
  };

  const handleDelete = async (mpwDishId) => {
    await menuStore.deleteDish(userId, mpwDishId);
     await menuStore.fetchAggregatedIngredients(userId); 
  };

  return (
    <div className="meal-container-menu">
      {meals.map((meal) => {
        const dishes = menuStore.getDishesFor(dayOfWeekId, meal.id);
        return (
          <div key={meal.id} className="meal-block-menu">
            <div className="meal-header-menu">
              <ButtonMenuMeal
                mealName={meal.name}
                isActive={false}
                onAddDish={() => openModal(meal.id)}
              />
            </div>

            <div className="dishes-list-menu">
              {dishes.length > 0 ? (
                dishes.map((item) => (
                  <div key={item.id} className="dish-item-menu">
                    <div className="dish-and-gram-menu">
                      <span className="dish-name-menu">{item.dishTitle || item.ingredientTitle}</span>
                      {item.ingredientTitle && item.weight_ingredient && (
                        <span className="dish-weight-menu">{`${item.weight_ingredient} г`}</span>
                      )}
                    </div>
                    <button
                      className="delete-button-menu"
                      onClick={() => handleDelete(item.id)}
                      style={{ border: "none", background: "transparent", cursor: "pointer" }}
                    >
                      <img src={deleteIcon} alt="Delete" width="20" height="20" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-dishes-menu">Немає доданих страв.</p>
              )}
            </div>
          </div>
        );
      })}

      {modalMealId && (

        <ModalAddDishToMenu
          isOpen={true}
          onClose={closeModal}
          typeOfMealId={modalMealId}
          dayOfWeekId={dayOfWeekId}
        />
      )}
    </div>
  );
};

export default observer(MenuMeal);
