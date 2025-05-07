import React, { useState } from 'react';
import AddDishModal from './AddDishModal';
import './DishList.css';

const DishList = () => {
  const [dishes, setDishes] = useState([
    { id: 1, name: 'Жаркое', type: 'Гаряча страва', ingredients: 'Курка, песто...', calories: 250, proteins: 20, fats: 20, carbs: 100 },
    { id: 2, name: 'Жарке', type: 'Гаряча страва', ingredients: 'Курка, песто...', calories: 250, proteins: 20, fats: 20, carbs: 100 },
    { id: 3, name: 'Жарке', type: 'Гаряча страва', ingredients: 'Курка, песто...', calories: 250, proteins: 20, fats: 20, carbs: 100 },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);

  const addDish = (newDish) => {
    setDishes([...dishes, { ...newDish, id: dishes.length + 1 }]);
    setShowAddModal(false);
  };

  return (
    <div className="dish-list-container">
      <h1>Перелік блюд</h1>
      
      <table className="dishes-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Тип</th>
            <th>Інгрідієнти</th>
            <th>КБЖУ</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map(dish => (
            <tr key={dish.id}>
              <td>{dish.name}</td>
              <td>{dish.type}</td>
              <td>{dish.ingredients}</td>
              <td>{dish.calories} / {dish.proteins} / {dish.fats} / {dish.carbs}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button 
        className="add-dish-button"
        onClick={() => setShowAddModal(true)}
      >
        Додати блюдо
      </button>
      
      {showAddModal && (
        <AddDishModal 
          onClose={() => setShowAddModal(false)}
          onSave={addDish}
        />
      )}
    </div>
  );
};

export default DishList;