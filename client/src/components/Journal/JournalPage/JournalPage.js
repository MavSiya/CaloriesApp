import HeaderForJournal from '../HeaderForJournal/HeaderForJournal.js';
import DateSelector from '../DateSelector/DateSelector.js';
import Bmr from '../Bmr/Bmr.js';
import Meal from '../Meal/Meal.js';

import { useContext} from 'react';
import { Context } from '../../../index.js';
import { observer } from "mobx-react-lite";



 function JournalPage(){
    return(
      <div className="journal">
        <HeaderForJournal />
        <DateSelector />
        <Bmr />
        <Meal/>
     </div>
    )
  }

  export default JournalPage;