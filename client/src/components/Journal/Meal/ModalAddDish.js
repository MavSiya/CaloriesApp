import React, { useEffect, useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';

import styles from './Meal.module.css';

const ModalAddDish = ({ isOpen, onClose, typeOfMealId, memberId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [type, setType] = useState('dish');
    const [weight, setWeight] = useState('');
    const [message, setMessage] = useState('');

    const { store, journalStore, dishStore } = useContext(Context);
    const userId = store.user.id;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedItem || !weight) return;
        const date = journalStore.currentDate?.format('YYYY-MM-DD');
        try {
            if (type === 'dish') {
                await journalStore.addDishToMeal({
                    userId,
                    memberId,
                    typeOfMealId,
                    date,
                    dishId: selectedItem.id,
                    weight: parseFloat(weight),
                });
            } else {
                await journalStore.addIngredientToMeal({
                    userId,
                    memberId,
                    typeOfMealId,
                    date,
                    ingredientId: selectedItem.id,
                    weight: parseFloat(weight),
                });
            }
            console.log('Додано страву/інгредієнт:', selectedItem);
            console.log('Викликаємо onClose');
            setMessage('Успішно додано!');
            setTimeout(() => {
                setMessage('');
                setSearchTerm('');
                setSelectedItem(null);
                setWeight('');
                onClose();
            }, 1000);
        } catch (e) {
            console.error('Error adding item to meal', e);
            setMessage('Помилка при додаванні');
        }
    };

    const filteredList =
        type === 'dish'
            ? dishStore.dishes
            : dishStore.ingredients.filter((item) =>
                  item.title.toLowerCase().includes(searchTerm.toLowerCase()),
              );

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.modalClose} onClick={onClose}>
                    ×
                </button>
                <h3>Додати до прийому їжі</h3>

                <div className={styles.typeSwitcher}>
                    <button
                        className={`${styles.buttonModalJournal} ${type === 'dish' ? styles.active : ''}`}
                        onClick={() => setType('dish')}
                    >
                        Страва
                    </button>
                    <button
                        className={`${styles.buttonModalJournal} ${type === 'ingredient' ? styles.active : ''}`}
                        onClick={() => setType('ingredient')}
                    >
                        Інгредієнт
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
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
                            <div className={styles.autocompleteList}>
                                {filteredList.map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles.autocompleteItem}
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

                    <div className={styles.formGroup}>
                        <label>Вага (г):</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.modalSubmit}>
                        Додати
                    </button>
                </form>
                {message && <p className={styles.successMessage}>{message}</p>}
            </div>
        </div>
    );
};

export default observer(ModalAddDish);
