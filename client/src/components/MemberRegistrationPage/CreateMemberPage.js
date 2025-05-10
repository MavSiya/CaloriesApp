import Header from '../Header/Header';
import MemberRegistrationForm from './MemberRegistrationForm/MemberRegistrationForm.js';
import MemberActivityChoice from './MemberActivityChoice/MemberActivityChoice.js'
import MemberCalculationKpfc from './MemberCalculationKpfc/MemberCalculationKpfc.js'
import '../RegistrationPage/RegistrationPage.css'
import ButtonHeader from '../ButtonHeader/ButtonHeader.js';
import MemberGoal from './MemberGoal/MemberGoal.js';

import { useContext} from 'react';
import { Context } from '../../index.js';
import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function CreateMemberPage() {
  const { store, memberStore  } = useContext(Context);
   const navigate = useNavigate();
  const userId = store.user.id;
 

   useEffect(() => {
    memberStore.reset();
  }, [memberStore]);

  const handleCreateMember = async () => {
    try {
      await memberStore.createMember(userId);
      navigate("/group");
    } catch (error) {
      console.error("Помилка при створенні мембера:", error.message);
    }
  };

  return (
   <>
 <Header />
 <main className='main'>
  <div className='form_and_activity'>
 <MemberRegistrationForm />
 <MemberGoal/>
 <MemberActivityChoice />
 </div>
 <div className='calculationKpfc'>
 <MemberCalculationKpfc />
 </div>
 <ButtonHeader
    onClick={handleCreateMember}
          disabled={!memberStore.isValid || memberStore.isLoading}
  >
    Створити члена
  </ButtonHeader>
 <ButtonHeader onClick={() => navigate("/group")}>Скасувати</ButtonHeader>
 </main>
 </>
  );
}

export default observer(CreateMemberPage);