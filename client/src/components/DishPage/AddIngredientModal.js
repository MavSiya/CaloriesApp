import './Modal.css';

import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../index.js';
import { observer } from 'mobx-react-lite';

const AddIngredientModal = ({ onClose, onSave }) => {
    const { dishStore } = useContext(Context);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [weight, setWeight] = useState(100);
    const [message, setMessage] = useState('');

    const handleSearch = async (query) => {
        setSearchTerm(query);
        setSelectedIngredient(null);

        if (query.length >= 2) {
            await dishStore.searchIngredientByName(query);
        }
    };

    const handleSelectIngredient = (ingredient) => {
        setSelectedIngredient(ingredient);
        setSearchTerm(ingredient.title);
    };

    const handleSave = () => {
        if (!selectedIngredient || !weight) return;

        onSave({
            ...selectedIngredient,
            weight: parseFloat(weight),
        });

        setMessage('Інгредієнт додано!');
        setTimeout(() => {
            setMessage('');
            setSearchTerm('');
            setSelectedIngredient(null);
            setWeight(100);
            onClose();
        }, 1000);
    };

    const filteredList = dishStore.ingredients.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>
                <h2>Додайте інгредієнт до страви</h2>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Оберіть інгредієнт..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchTerm && filteredList.length > 0 && (
                        <ul className="search-results">
                            {filteredList.map((ing) => (
                                <li key={ing.id} onClick={() => handleSelectIngredient(ing)}>
                                    {ing.title} ({ing.calories} ккал)
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
                    disabled={!selectedIngredient || !weight}
                >
                    Додати
                </button>

                {message && <p className="success-message">{message}</p>}
            </div>
        </div>
    );
};

export default observer(AddIngredientModal);
