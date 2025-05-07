import React, { useState } from 'react';
import './Modal.css';

const AddIngredientModal = ({ onClose, onSave }) => {
  const [ingredientName, setIngredientName] = useState('');
  const [weight, setWeight] = useState(100);
  const [searchResults, setSearchResults] = useState([]);
  
  // Пример данных ингредиентов
  const allIngredients = [
    { id: 1, name: 'Цибуля', calories: 43, proteins: 0.2, fats: 0.3, carbs: 10 },
    { id: 2, name: 'Курка', calories: 150, proteins: 20, fats: 5, carbs: 0 },
    { id: 3, name: 'Песто', calories: 300, proteins: 5, fats: 25, carbs: 10 },
  ];

  const handleSearch = (query) => {
    setIngredientName(query);
    if (query.length > 2) {
      const results = allIngredients.filter(ing => 
        ing.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectIngredient = (ingredient) => {
    setIngredientName(ingredient.name);
    setSearchResults([]);
  };

  const handleSave = () => {
    const selectedIngredient = allIngredients.find(ing => ing.name === ingredientName);
    if (selectedIngredient) {
      onSave({
        ...selectedIngredient,
        weight: weight
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Додайте інгрідієнт до страви</h2>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Оберіть інгрідієнт..."
            value={ingredientName}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map(ing => (
                <li key={ing.id} onClick={() => handleSelectIngredient(ing)}>
                  {ing.name} ({ing.calories} ккал)
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="form-group">
          <input
            type="number"
            placeholder="Введіть вагу..."
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
            min="1"
          />
          <span>гр</span>
        </div>
        
        <button 
          className="add-button"
          onClick={handleSave}
          disabled={!ingredientName || !weight}
        >
          Додати
        </button>
      </div>
    </div>
  );
};

export default AddIngredientModal;