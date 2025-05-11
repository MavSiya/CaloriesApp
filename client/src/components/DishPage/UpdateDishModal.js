import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../index.js';
import { observer } from 'mobx-react-lite';
import AddIngredientModal from './AddIngredientModal';
import './Modal.css';

const UpdateDishModal = ({ dish, onClose, onSave }) => {
  const { dishStore } = useContext(Context);

  const [dishName, setDishName] = useState(dish.title);
  const [dishType, setDishType] = useState(dish.typeId || dish.type); // depends on what exactly comes
  const [dishTypes, setDishTypes] = useState([]);
  const [ingredients, setIngredients] = useState([...dish.ingredients]);
  const [showIngredientModal, setShowIngredientModal] = useState(false);

  useEffect(() => {
    const loadTypes = async () => {
      await dishStore.fetchAllDishTypes();
      setDishTypes(dishStore.typesOfDish);
    };
    loadTypes();
  }, []);

  const handleWeightChange = (index, weight) => {
    const updated = [...ingredients];
    updated[index].weight = Number(weight);
    setIngredients(updated);
  };

  const handleDeleteIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  const addIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleSave = async () => {
    const updatedDish = {
      id: dish.id,
      title: dishName,
      type: dishType,
      ingredients: ingredients,
    };

    try {
      await dishStore.updateDish(updatedDish);
      await dishStore.fetchAllDishesWithBmr();
      onSave(updatedDish);
      onClose();
    } catch (error) {
      alert("Помилка при оновленні страви: " + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Редагування страви</h2>

        <div className="form-group">
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Тип страви:</label>
          <select
            value={dishType}
            onChange={(e) => setDishType(e.target.value)}
          >
            {dishTypes.map(type => (
              <option key={type.id} value={type.id}>{type.title}</option>
            ))}
          </select>
        </div>

        <div className="ingredients-list">
          {ingredients.map((ing, index) => (
            <div key={index} className="ingredient-item">
              {ing.title} 
              <input
                type="number"
                value={ing.weight}
                onChange={(e) => handleWeightChange(index, e.target.value)}
                min="1"
              />
              гр
              <button onClick={() => handleDeleteIngredient(index)}>🗑</button>
            </div>
          ))}
        </div>

        <button className="add-ingredient-button" onClick={() => setShowIngredientModal(true)}>
          Додати інгредієнт
        </button>

        <button
          className="create-dish-button"
          onClick={handleSave}
          disabled={!dishName || !dishType || ingredients.length === 0}
        >
          Зберегти зміни
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

export default observer(UpdateDishModal);
