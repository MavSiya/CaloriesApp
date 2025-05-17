import React from 'react';
import { observer } from "mobx-react-lite";
import './ButtonMenuMeal.css';

const ButtonMenuMeal = ({ mealName, isActive, onAddDish }) => {
  return (
    <div className="button-meal-menu">
      <button 
        className={`meal-button-menu ${isActive ? 'active' : ''}`}
        onClick={onAddDish}
      >
        <span className="meal-name-menu">{mealName}</span>
        <span className="meal-icon-menu">
          {isActive ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 15L12 8L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
};

export default observer(ButtonMenuMeal);
