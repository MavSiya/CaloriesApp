import ButtonHeader from "../ButtonHeader/ButtonHeader";
import '../ButtonHeader/ButtonHeader.css';


export default function Header(){
    return(
      <div className="header">
        <div> <img src="/img/logo.png" alt="logo" /></div>
      <div>
      <ButtonHeader>Щоденник калорій</ButtonHeader>
      <ButtonHeader className="btn_small">Сім'я</ButtonHeader>
      <ButtonHeader className="btn_small">Блюда</ButtonHeader>
      <ButtonHeader className="btn_small">Меню</ButtonHeader>
      <ButtonHeader className="btn_small">Увійти</ButtonHeader>
      </div>
     </div>
    )
  }