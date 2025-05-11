import { useState } from 'react';
import IngredientService from '../../../services/IngredientService';
import './AddIngridientModal.css';

const AddIngredientToBdModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(title, calories, proteins, fats, carbs);
      await IngredientService.addIngredientToDB(title, calories, proteins, fats, carbs);
      setMessage('Інгредієнт успішно додано!');
      setTimeout(onClose, 1000); 
    } catch (error) {
      setMessage('Помилка: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Додати інгредієнт</h2>
        <form onSubmit={handleSubmit}>
          <input className='input-modal-to-db' type="text" placeholder="Назва" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className='input-modal-to-db' type="number" placeholder="Калорії" value={calories} onChange={(e) => setCalories(e.target.value)} required />
          <input className='input-modal-to-db' type="number" placeholder="Білки" value={proteins} onChange={(e) => setProteins(e.target.value)} required />
          <input className='input-modal-to-db' type="number" placeholder="Жири" value={fats} onChange={(e) => setFats(e.target.value)} required />
          <input className='input-modal-to-db' type="number" placeholder="Вуглеводи" value={carbs} onChange={(e) => setCarbs(e.target.value)} required />
          <button type="submit">Зберегти</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AddIngredientToBdModal;
