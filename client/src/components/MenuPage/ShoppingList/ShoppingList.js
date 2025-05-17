import React, { useEffect, useContext } from 'react';
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

  const chunkSize = 10; // Количество продуктов в каждом столбце
  const chunks = [];
  
  // Разделим список продуктов на куски по 10 элементов
  for (let i = 0; i < products.length; i += chunkSize) {
    chunks.push(products.slice(i, i + chunkSize));
  }

  return (
    <div className="shopping-list">
      <h1>Список продуктів</h1>
      <div className="product-list">
        {chunks.map((chunk, index) => (
          <div key={index} className="product-column">
            {chunk.map((product) => (
              <div key={product.id} className="product-item">
                <label>
                  <input type="checkbox" className="product-checkbox" />
                  <span className="product-name">
                    {product.title} {product.totalWeight} гр
                  </span>
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export default ShoppingList;
