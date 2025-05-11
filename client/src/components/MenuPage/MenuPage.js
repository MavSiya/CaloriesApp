import { useEffect, useState,useContext } from 'react';
import { observer } from "mobx-react-lite";
import MealPlanning from "./MealPlanning/MealPlanning";
import ProductList from './ProductList/ProductList';
import { Context } from '../../index.js';
import Header from '../Header/Header.js';
const MenuPage = observer(() => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
const { menuStore } = useContext(Context);
  useEffect(() => {
    menuStore.fetchMenu();
  }, []);

  const dayToId = {
    'Понеділок': 1, 'Вівторок': 2, 'Середа': 3, 'Четвер': 4,
    'П\'ятниця': 5, 'Субота': 6, 'Неділя': 7
  };
  const mealToId = {
    'Сніданок': 1, 'Обід': 2, 'Вечеря': 3, 'Перекус': 4
  };

  const addDish = async (dishId) => {
    const dayId = dayToId[selectedDay];
    const mealId = mealToId[selectedMeal];
    await menuStore.addDish({ dayOfWeekId: dayId, typeOfMealId: mealId, dishId });
  };

  const deleteDish = async (mpwDishId) => {
    await menuStore.deleteDish(mpwDishId);
  };

  return (
    <div className="menu-planner">
 <Header/>

      <div className="days-container">
        {Object.keys(dayToId).map(day => (
          <button
            key={day}
            className={`day-button ${selectedDay === day ? 'active' : ''}`}
            onClick={() => {
              setSelectedDay(day);
              setSelectedMeal(null);
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="meals-container">
          {Object.keys(mealToId).map(meal => (
            <button
              key={meal}
              className={`meal-button ${selectedMeal === meal ? 'active' : ''}`}
              onClick={() => setSelectedMeal(meal)}
            >
              {meal}
            </button>
          ))}
        </div>
      )}

      {selectedDay && selectedMeal && (
        <MealPlanning
          day={selectedDay}
          meal={selectedMeal}
          dishes={menuStore.getDishesFor(selectedDay, selectedMeal)}
          onAddDish={addDish}
          onDeleteDish={deleteDish}
        />
      )}

      <ProductList />
    </div>
  );
});

export default MenuPage;
