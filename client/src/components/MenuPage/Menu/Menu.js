import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';
import MenuMeal from '../MenuMeal/MenuMeal.js';
import './Menu.css';

const Menu = () => {
  const { store } = useContext(Context);
  const daysOfWeek = [
    { id: 1, title: 'Понеділок' },
    { id: 2, title: 'Вівторок' },
    { id: 3, title: 'Середа' },
    { id: 4, title: 'Четвер' },
    { id: 5, title: 'Пятниця' },
    { id: 6, title: 'Субота' },
    { id: 7, title: 'Неділя' }
  ];

  return (
    <div className="menu-page-container">
      <h1>Меню</h1>
      
      {/* Понеділок вівторок середа */}
      <div className="week-row">
        {daysOfWeek.slice(0, 3).map(day => (
          <div key={day.id} className="day-card">
            <h2>{day.title}</h2>
            <MenuMeal dayOfWeekId={day.id}/>
          </div>
        ))}
      </div>
      
      {/* Четвер пятниця субота*/}
      <div className="week-row">
        {daysOfWeek.slice(3, 6).map(day => (
          <div key={day.id} className="day-card">
            <h2>{day.title}</h2>
            <MenuMeal dayOfWeekId={day.id}/>
          </div>
        ))}
      </div>
      
      {/* Неділя */}
      <div className="single-day-row">
        <div className="day-card">
          <h2>{daysOfWeek[6].title}</h2>
          <MenuMeal dayOfWeekId={daysOfWeek[6].id}/>
        </div>
      </div>
    </div>
  );
};

export default observer(Menu);