import AddDishModal from './AddDishModal';
import AddIngredientToBdModal from './AddIngredientModal/AddIngredientToBdModal.js';
import './DishList.css';

import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Context } from '../../index.js';
import { observer } from 'mobx-react-lite';

const DishList = () => {
    const { dishStore } = useContext(Context);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);

    useEffect(() => {
        dishStore.fetchAllDishesWithBmr();
    }, []);

    const addDish = (newDish) => {
        setShowAddModal(false);
    };

    const handleDelete = async (dishId) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю страву?')) {
            try {
                await dishStore.deleteDish(dishId);
                await dishStore.fetchAllDishesWithBmr();
            } catch (error) {
                alert('Помилка при видаленні страви: ' + error.message);
            }
        }
    };

    return (
        <div className="dish-list-container">
            <h1>Перелік страв</h1>

            {dishStore.isLoading ? (
                <div>Завантаження...</div>
            ) : dishStore.error ? (
                <div>Помилка: {dishStore.error}</div>
            ) : (
                <table className="dishes-table">
                    <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Тип</th>
                            <th>КБЖУ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dishStore.dishes.map((dish) => (
                            <tr key={dish.id}>
                                <td>{dish.title}</td>
                                <td>{dish.type}</td>
                                <td className="td_prelast">
                                    {dish.calories || 0} / {dish.proteins || 0} / {dish.fats || 0} /{' '}
                                    {dish.carbs || 0}
                                </td>
                                <td className="td_last">
                                    <button
                                        onClick={() => handleDelete(dish.id)}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <img
                                            src="./img/btn_delete.png"
                                            alt="Delete"
                                            width="20"
                                            height="20"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button className="add-dish-button" onClick={() => setShowAddModal(true)}>
                Додати страву
            </button>
            <button className="add-dish-button" onClick={() => setShowAddIngredientModal(true)}>
                Додати інгредієнт
            </button>

            {showAddModal && (
                <AddDishModal onClose={() => setShowAddModal(false)} onSave={addDish} />
            )}

            {showAddIngredientModal && (
                <AddIngredientToBdModal onClose={() => setShowAddIngredientModal(false)} />
            )}
        </div>
    );
};

export default observer(DishList);
