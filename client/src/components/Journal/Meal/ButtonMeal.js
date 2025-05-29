import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './Meal.module.css';

const ButtonMeal = ({ mealName, isActive, onToggle, onAddDish }) => {
    return (
        <div className={styles.buttonMeal}>
            <button
                className={`${styles.mealButton} ${isActive ? styles.active : ''}`}
                onClick={onToggle}
            >
                <span className={styles.mealName}>{mealName}</span>
                <span className={styles.mealIcon}>
                    {isActive ? (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19 15L12 8L5 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    ) : (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 5V19M5 12H19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </span>
            </button>
        </div>
    );
};

export default observer(ButtonMeal);
