import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Store from './store/store';
import RegistrationStore from './store/registrationStore';
import JournalStore from './store/journalStore';
import DishStore from './store/dishStore';
import MemberStore from './store/memberStore';


const store = new Store();
const registrationStore = new RegistrationStore();
const journalStore = new JournalStore();
const dishStore = new DishStore();
const memberStore = new MemberStore();

export const Context = createContext({
  store,registrationStore,journalStore,dishStore,memberStore
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{ store, registrationStore, journalStore, dishStore, memberStore}}>
  <React.StrictMode>
  <BrowserRouter>
      <App />
      </BrowserRouter>
  </React.StrictMode>
  </Context.Provider>
);

reportWebVitals();
