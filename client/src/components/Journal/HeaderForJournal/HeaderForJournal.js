import ButtonHeader from "../../ButtonHeader/ButtonHeader.js";
import '../../ButtonHeader/ButtonHeader.css';

import { useNavigate } from 'react-router-dom';
import { useContext} from 'react';
import { Context } from '../../../index.js';
import { observer } from "mobx-react-lite";


 function Header(){
   const { store } = useContext(Context);
   const navigate = useNavigate();
    return(
      <div className="header_for_journal">
        <div> <img src="/img/logo.png" alt="logo" /></div>
      <div>
      <ButtonHeader  onClick={() => navigate('/journal')}>Щоденник калорій</ButtonHeader>
      <ButtonHeader className="btn_small" onClick={() => navigate('/family')}>Сім'я</ButtonHeader>
      <ButtonHeader className="btn_small" onClick={() => navigate('/dishes')}>Блюда</ButtonHeader>
      <ButtonHeader className="btn_small" onClick={() => navigate('/menu')}>Меню</ButtonHeader>
      <ButtonHeader onClick={() => navigate('/personal')} className="btn_small">Акаунт</ButtonHeader>
      </div>
     </div>
    )
  }

  export default observer(Header);