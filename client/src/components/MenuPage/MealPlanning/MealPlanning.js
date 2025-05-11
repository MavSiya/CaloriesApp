import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import DishSelectionModal from "../DishSelectionModal/DishSelectionModal";
import '../MenuPage.css';

const MealPlanning = ({ day, meal, dishes, onAddDish, onDeleteDish }) => {
  const [showDishModal, setShowDishModal] = useState(false);
const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="meal-planning">
      <h2>{day} - {meal}</h2>
      


<button className="add-dish-btn" onClick={() => setModalOpen(true)}>Додати страву</button>

      <div className="dishes-list">
        {dishes.length > 0 ? (
          dishes.map(dish => (
            <div key={dish.id} className="dish-item">
              <span>{dish.name}</span>
              <button 
                className="delete-btn"
                onClick={() => onDeleteDish(dish.id)}
              >
                ✘
              </button>
            </div>
          ))
        ) : (
          <p className="no-dishes-message">Немає доданих страв</p>
        )}
      </div>

      {showDishModal && (
        <DishSelectionModal
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  onAddDish={onAddDish}
/>
      )}

      
    </div>
  );
};

export default observer(MealPlanning);