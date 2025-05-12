import React, { useEffect,useContext, } from 'react';
import './ShoppingList.css';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';// залежить від твоєї структури
import { toJS } from 'mobx';

const ShoppingList = observer(() => {
  const { menuStore, store } = useContext(Context);
  const userId = store.user.id;
  useEffect(() => {
    if (userId) {
      menuStore.fetchAggregatedIngredients(userId);
    }
  }, [userId, menuStore.isUpdated]);

  const products = toJS(menuStore.aggregatedIngredients);

  return (
    <div className="shopping-list">
      <h1>Список продуктів</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <label>
              <input type="checkbox" className="product-checkbox" />
              <span className="product-name">
                {product.title} {product.totalWeight} гр
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ShoppingList;
