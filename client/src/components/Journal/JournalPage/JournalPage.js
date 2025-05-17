import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Context } from '../../../index.js'; 
import Header from '../../Header/Header.js';
import DateSelector from '../DateSelector/DateSelector.js';
import Bmr from '../Bmr/Bmr.js';
import Meal from '../Meal/Meal.js';

function JournalPage() {
  const { memberId } = useParams();
  const location = useLocation();
  const isGroupJournal = location.pathname.startsWith('/group');
    const { memberStore } = useContext(Context);

  const [isGroupJournalPage, setIsGroupJournalPage] = useState(isGroupJournal);
    const [memberName, setMemberName] = useState('');

  useEffect(() => {
    setIsGroupJournalPage(isGroupJournal);
  }, [isGroupJournal]);

 useEffect(() => {
    if (isGroupJournalPage && memberId) {
      const name = memberStore.getMemberName(memberId); 
      setMemberName(name);
    } else {
      setMemberName('Ваш журнал');
    }
  }, [isGroupJournalPage, memberId, memberStore]);

  return (
    <div className="journal">
      <Header />
      <DateSelector />
      <br/>
       <h2>{memberName} журнал</h2> 
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
