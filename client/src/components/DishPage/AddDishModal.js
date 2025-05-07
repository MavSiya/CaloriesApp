import React, { useState } from 'react';
import AddIngredientModal from './AddIngredientModal';
import './Modal.css';

const AddDishModal = ({ onClose, onSave }) => {
  const [dishName, setDishName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [nutrition, setNutrition] = useState({
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  });

  const addIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
    // Обновляем КБЖУ (упрощенный расчет)
    setNutrition({
      calories: nutrition.calories + ingredient.calories,
      proteins: nutrition.proteins + ingredient.proteins,
      fats: nutrition.fats + ingredient.fats,
      carbs: nutrition.carbs + ingredient.carbs
    });
  };

  const handleSave = () => {
    const dish = {
      name: dishName,
      type: 'Гаряча страва', // Можно сделать выбор типа
      ingredients: ingredients.map(i => `${i.name} ${i.weight}г`).join(', '),
      calories: nutrition.calories,
      proteins: nutrition.proteins,
      fats: nutrition.fats,
      carbs: nutrition.carbs
    };
    onSave(dish);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Додавання страви</h2>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Введіть назву..."
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
          />
        </div>
        
        <div className="ingredients-list">
          {ingredients.map((ing, index) => (
            <div key={index} className="ingredient-item">
              {ing.name} {ing.weight} гр | {ing.calories} ккал | {ing.proteins} б | {ing.fats} ж | {ing.carbs} в
            </div>
          ))}
        </div>
        
        <button 
          className="add-ingredient-button"
          onClick={() => setShowIngredientModal(true)}
        >
          Додати інгрідієнт...
        </button>
        
        <div className="nutrition-info">
          <h3>КБЖУ страви на 100 гр:</h3>
          <div className="nutrition-values">
            <div className="nutrition-value">
              <span>{nutrition.calories}</span>
              <span>Ккал</span>
            </div>
            <div className="nutrition-value">
              <span>{nutrition.proteins}</span>
              <span>Білки</span>
            </div>
            <div className="nutrition-value">
              <span>{nutrition.fats}</span>
              <span>Жири</span>
            </div>
            <div className="nutrition-value">
              <span>{nutrition.carbs}</span>
              <span>Вуглеводи</span>
            </div>
          </div>
        </div>
        
        <button 
          className="create-dish-button"
          onClick={handleSave}
          disabled={!dishName || ingredients.length === 0}
        >
          Створити
        </button>
        
        {showIngredientModal && (
          <AddIngredientModal
            onClose={() => setShowIngredientModal(false)}
            onSave={addIngredient}
          />
        )}
      </div>
    </div>
  );
};

export default AddDishModal;