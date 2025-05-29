import { useContext, useEffect } from 'react';
import { Context } from '../../../index.js';
import { observer } from 'mobx-react-lite';
import { dayjs } from 'dayjs';
import './DateSelector.css';

function DateSelector() {
    const { journalStore } = useContext(Context);

    const selectedDate = journalStore.currentDate;

    const days = journalStore.daysRange;

    useEffect(() => {
        if (!journalStore.currentDate) {
            journalStore.setDate(dayjs());
        }
    }, [journalStore]);

    const handleClick = (date) => {
        journalStore.setDate(date);
    };

    const monthName = selectedDate.format('MMMM');

    return (
        <div className="button-day-container">
            <h2 className="month-title">
                {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </h2>

            <div className="button-row">
                {days.map((date, index) => {
                    const isSelected = journalStore.isSelected(date);
                    return (
                        <button
                            key={index}
                            className={`day-button ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleClick(date)}
                        >
                            {date.date()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default observer(DateSelector);
