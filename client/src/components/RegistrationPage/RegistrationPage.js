import Header from '../Header/Header';
import RegistrationForm from './RegistrationForm/RegistrationForm.js';
import ActivityChoice from './ActivityChoice/ActivityChoice.js'
import CalculationKpfc from './CalculationKpfc/CalculationKpfc.js'
import './RegistrationPage.css'
import ButtonHeader from '../ButtonHeader/ButtonHeader.js';
import Goal from './Goal/Goal.js';

import { useContext} from 'react';
import { Context } from '../../index.js';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';


function RegistrationPage() {
  const { store, registrationStore  } = useContext(Context);
  const [hasUserInfo, setHasUserInfo] = useState(false);
const [pdfModalOpen, setPdfModalOpen] = useState(false);

  useEffect(() => {
    registrationStore.loadUserInfo().then(() => {
      if (registrationStore.dob) {
        setHasUserInfo(true);
      }
    });
  }, [registrationStore]);
  return (
   <>
 <Header />
 <main className='main'>
  <div className='form_and_activity'>
 <RegistrationForm />
 <div className='goal_and_activity'> 
 <Goal/>
 <ActivityChoice />
 </div>
 </div>
 <div className='calculationKpfc'>
 <CalculationKpfc />
 </div>
 <div className='block_buttons'>
 <ButtonHeader className = "personal"
    onClick={async () => {
      if (hasUserInfo) {
        await registrationStore.updateUserInfo();
      } else {
        await registrationStore.submitUserInfo();
        setHasUserInfo(true); 
      }
    }}
    disabled={!registrationStore.isValid || registrationStore.isLoading}
  >
    {hasUserInfo ? "Змінити" : "Зберегти"}
  </ButtonHeader>
  <ButtonHeader onClick={() => store.logout()}>Вийти</ButtonHeader>

   </div>
 </main>
 </>
  );
  
}

export default observer(RegistrationPage);