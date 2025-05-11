import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import dishStore from '../../../store/dishStore';





const DishSelectionModal = observer(({ isOpen, onClose, onAddDish }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDishId, setSelectedDishId] = useState(null);

  useEffect(() => {
    dishStore.fetchAllDishes();
  }, []);

  const filteredDishes = dishStore.dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedDishId) {
      onAddDish(selectedDishId);
      onClose();
      setSearchTerm('');
      setSelectedDishId(null);
    }
  };

  return (
    <div isOpen={isOpen} onClose={onClose}>
      <h2>Виберіть страву</h2>
      <input
        type="text"
        placeholder="Пошук страви..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <ul className="dish-list">
        {filteredDishes.map((dish) => (
          <li
            key={dish.id}
            onClick={() => setSelectedDishId(dish.id)}
            className={`dish-item ${selectedDishId === dish.id ? 'selected' : ''}`}
          >
            {dish.name}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit} disabled={!selectedDishId}>
        Додати страву
      </button>
    </div>
  );
});

export default DishSelectionModal;
