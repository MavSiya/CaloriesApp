import Header from '../Header/Header';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import ActivityChoice from '../ActivityChoice/ActivityChoice.js'
import CalculationKpfc from '../CalculationKpfc/CalculationKpfc'
import './RegistrationPage.css'
import ButtonHeader from '../ButtonHeader/ButtonHeader.js';
import Goal from '../Goal/Goal.js';

import { useContext} from 'react';
import { Context } from '../../index.js';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';


function RegistrationPage() {
  const { store, registrationStore  } = useContext(Context);
  const [hasUserInfo, setHasUserInfo] = useState(false);

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
 <Goal/>
 <ActivityChoice />
 </div>
 <div className='calculationKpfc'>
 <CalculationKpfc />
 </div>
 <ButtonHeader
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
 </main>
 </>
  );
}

export default observer(RegistrationPage);