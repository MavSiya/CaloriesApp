import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Context } from '../../index.js';
import { observer } from "mobx-react-lite";
import AddIngredientModal from './AddIngredientModal';
import './Modal.css';

const AddDishModal = ({ onClose, onSave }) => {
  const {dishStore } = useContext(Context);

  const [dishName, setDishName] = useState('');
  const [dishType, setDishType] = useState('');
  const [dishTypes, setDishTypes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [nutrition, setNutrition] = useState({
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  });

  // Загрузка типов блюд при монтировании компонента
  useEffect(() => {
    const loadDishTypes = async () => {
      try {
        await dishStore.fetchAllDishTypes();
        console.log(dishStore.typesOfDish);
        setDishTypes(dishStore.typesOfDish || []);
        if (dishStore.typesOfDish.length > 0) {
          setDishType(dishStore.typesOfDish[0].id); 
        }
      } catch (error) {
        console.error('Error loading dish types:', error);
      }
    };
    
    loadDishTypes();
  }, []);

  const addIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
    setNutrition(prev => ({
      calories: parseFloat((prev.calories + Number(ingredient.calories)).toFixed(2)),
      proteins: parseFloat((prev.proteins + Number(ingredient.proteins)).toFixed(2)),
      fats: parseFloat((prev.fats + Number(ingredient.fats)).toFixed(2)),
      carbs: parseFloat((prev.carbs + Number(ingredient.carbs)).toFixed(2)),
    }));
  };

  const handleSave = async () => {
    console.log("dishType:", dishType);

    const dish = {
      title: dishName,
      type: dishType,
      ingredients
    };
  
    try {
      await dishStore.createDish(dish);
      onSave(dish);
      onClose();
      dishStore.fetchAllDishesWithBmr();
    } catch (error) {
      alert(error.message);
    }
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

        <div className="form-group">
          <label>Тип страви:</label>
          <select
            value={dishType}
            onChange={(e) => setDishType(e.target.value)}
            className="dish-type-select"
          >
            {dishTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="ingredients-list">
          {ingredients.map((ing, index) => (
            <div key={index} className="ingredient-item">
              {ing.title} {ing.weight} гр | {ing.calories} ккал | {ing.proteins} б | {ing.fats} ж | {ing.carbs} в
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
          disabled={!dishName || !dishType || ingredients.length === 0}
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

export default observer(AddDishModal);