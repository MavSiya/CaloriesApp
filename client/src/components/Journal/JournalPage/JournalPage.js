import Header from '../../Header/Header.js';
import DateSelector from '../DateSelector/DateSelector.js';
import Bmr from '../Bmr/Bmr.js';
import Meal from '../Meal/Meal.js';


 function JournalPage(){
    return(
      <div className="journal">
        <Header />
        <DateSelector />
        <Bmr />
        <Meal/>
     </div>
    )
  }

  export default JournalPage;