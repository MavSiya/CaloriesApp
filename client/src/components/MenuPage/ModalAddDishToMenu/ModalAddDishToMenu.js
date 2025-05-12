import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';

import './ModalAddDishToMenu.css';

const ModalAddDishToMenu = ({ isOpen, onClose, typeOfMealId, dayOfWeekId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [type, setType] = useState('dish'); 
  const [message, setMessage] = useState('');

  const { store, menuStore, dishStore } = useContext(Context);
  const userId = store.user.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedItem) return;

    try {
      if (type === 'dish') {
        await menuStore.addDish({
          userId,
          dayOfWeekId,
          typeOfMealId,
          dishId: selectedItem.id,
          ingredientId: null,
        });
      } else {
        await menuStore.addDish({
          userId,
          dayOfWeekId,
          typeOfMealId,
          dishId: null,
          ingredientId: selectedItem.id,
        });
      }
      
      console.log('Додано страву/інгредієнт:', selectedItem);
      setMessage('Успішно додано!');
      
      setTimeout(() => {
        setMessage('');
        setSearchTerm('');
        setSelectedItem(null);
        onClose();
      }, 1000);
    } catch (e) {
      console.error('Помилка при додаванні елемента до меню', e);
      setMessage('Помилка при додаванні');
    }
  };

  const filteredList = type === 'dish'
    ? dishStore.dishes.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : dishStore.ingredients.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Додати до прийому їжі</h3>

        <div className="type-switcher">
          <button 
            className={type === 'dish' ? 'button-modal-journal active' : 'button-modal-journal'} 
            onClick={() => setType('dish')}
          >
            Страва
          </button>
          <button 
            className={type === 'ingredient' ? 'button-modal-journal active' : 'button-modal-journal'} 
            onClick={() => setType('ingredient')}
          >
            Інгредієнт
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Назва:</label>
            <input 
              type="text" 
              value={searchTerm}
              onChange={async (e) => {
                const value = e.target.value;
                setSearchTerm(value);
                setSelectedItem(null);
                
                if (type === 'dish') {
                  await dishStore.searchDishByName(value);
                } else if (type === 'ingredient') {
                  await dishStore.searchIngredientByName(value);
                }
              }}
              required 
            />
            {searchTerm && (
              <div className="autocomplete-list">
                {filteredList.map(item => (
                  <div 
                    key={item.id}
                    className="autocomplete-item"
                    onClick={() => {
                      setSelectedItem(item);
                      setSearchTerm(item.title);
                    }}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="modal-submit">Додати</button>
        </form>
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default observer(ModalAddDishToMenu);
