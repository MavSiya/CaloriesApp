import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../Header/Header.js';
import DateSelector from '../DateSelector/DateSelector.js';
import Bmr from '../Bmr/Bmr.js';
import Meal from '../Meal/Meal.js';

function JournalPage() {
  const { memberId } = useParams();
  const location = useLocation();
  const isGroupJournal = location.pathname.startsWith('/group');
  
  const [isGroupJournalPage, setIsGroupJournalPage] = useState(isGroupJournal);
  useEffect(() => {
    setIsGroupJournalPage(isGroupJournal);
  }, [isGroupJournal]);

  return (
    <div className="journal">
      <Header />
      <DateSelector />
      {isGroupJournalPage ? (
        <>
          <Bmr memberId={memberId} />
          <Meal memberId={memberId} />
        </>
      ) : (
        <>
          <Bmr memberId={null} />
          <Meal memberId={null} />
        </>
      )}
    </div>
  );
}

export default JournalPage;
