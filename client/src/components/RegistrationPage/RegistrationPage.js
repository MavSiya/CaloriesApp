import Header from '../Header/Header';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import ActivityChoice from '../ActivityChoice/ActivityChoice.js'
import CalculationKpfc from '../CalculationKpfc/CalculationKpfc'
import './RegistrationPage.css'
import ButtonHeader from '../ButtonHeader/ButtonHeader.js';

export default function RegistrationPage() {
  return (
   <>
 <Header />
 <main className='main'>
  <div className='form_and_activity'>
 <RegistrationForm />
 <ActivityChoice />
 </div>
 <div className='calculationKpfc'>
 <CalculationKpfc />
 </div>
  <ButtonHeader>Зареєструватись</ButtonHeader>
 </main>
 </>
  );
}