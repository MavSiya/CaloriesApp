import React from 'react';
import Header from '../Header/Header';
import Menu from './Menu/Menu';
import ShoppingList from './ShoppingList/ShoppingList';

function MenuPage() {
  return (
    <div className="menu-page">
      <Header />
      <Menu />
      <ShoppingList />
    </div>
  );
}

export default MenuPage;