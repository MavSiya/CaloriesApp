import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';

import './ModalAddDishToMenu.css';

const ModalAddDishToMenu = ({ isOpen, onClose, typeOfMealId, dayOfWeekId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [ingredientWeight, setIngredientWeight] = useState('');
  const [type, setType] = useState('dish');
  const [message, setMessage] = useState('');

  const { store, menuStore, dishStore } = useContext(Context);
  const userId = store.user.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItem) return;

    try {
      console.log({
  userId,
  dayOfWeekId,
  typeOfMealId,
  dishId: null,
  ingredientId: selectedItem?.id,
  weight: Number(ingredientWeight)
});
      if (type === 'dish') {
        await menuStore.addDish({
          userId,
          dayOfWeekId,
          typeOfMealId,
          dishId: selectedItem.id,
          ingredientId: null,
          weight: null
        });
      } else {
        if (!ingredientWeight || Number(ingredientWeight) <= 0) {
          setMessage('Вкажіть вагу інгредієнта');
          return;
        }

        await menuStore.addDish({
          userId,
          dayOfWeekId,
          typeOfMealId,
          dishId: null,
          ingredientId: selectedItem.id,
          weight: Number(ingredientWeight)
        });
      }

      console.log('Додано страву/інгредієнт:', selectedItem);
      setMessage('Успішно додано!');

      setTimeout(() => {
        setMessage('');
        setSearchTerm('');
        setSelectedItem(null);
        setIngredientWeight('');
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
    <div className="modal-overlay-menu">
      <div className="modal-content-menu">
        <button className="modal-close-menu" onClick={onClose}>×</button>
        <h3>Додати до прийому їжі</h3>

        <div className="type-switcher-menu">
          <button
            className={type === 'dish' ? 'button-modal-journal-menu active' : 'button-modal-journal-menu'}
            onClick={() => setType('dish')}
          >
            Страва
          </button>
          <button
            className={type === 'ingredient' ? 'button-modal-journal-menu active' : 'button-modal-journal-menu'}
            onClick={() => setType('ingredient')}
          >
            Інгредієнт
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group-menu">
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
              <div className="autocomplete-list-menu">
                {filteredList.map(item => (
                  <div
                    key={item.id}
                    className="autocomplete-item-menu"
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
          {type === 'ingredient' && selectedItem && (
            <div className="form-group-menu">
              <label>Вага (г):</label>
              <input
                type="number"
                min="1"
                value={ingredientWeight}
                onChange={(e) => setIngredientWeight(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="modal-submit-menu">Додати</button>
        </form>
        {message && <p className="success-message-menu">{message}</p>}
      </div>

    </div>
  );
};

export default observer(ModalAddDishToMenu);
