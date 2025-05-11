import { useState } from 'react';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Підчеревина свинина', quantity: '300 гр', completed: false },
    { id: 2, name: 'Підчеревина свинина', quantity: '300 гр', completed: false },
    { id: 3, name: 'Морква', quantity: '300 гр', completed: true },
    { id: 4, name: 'Морква', quantity: '300 гр', completed: true },
    { id: 5, name: 'Підчеревина свинина', quantity: '300 гр', completed: false },
    { id: 6, name: 'Підчеревина свинина', quantity: '300 гр', completed: true },
    { id: 7, name: 'Морква', quantity: '300 гр', completed: true },
    { id: 8, name: 'Морква', quantity: '300 гр', completed: true },
  ]);

  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const toggleProduct = (id) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, completed: !product.completed } : product
    ));
  };

  const addProduct = () => {
    if (newProduct.trim() && newQuantity.trim()) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          name: newProduct.trim(),
          quantity: newQuantity.trim(),
          completed: false
        }
      ]);
      setNewProduct('');
      setNewQuantity('');
    }
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="product-list-container">
      <h2>Список продуктів</h2>
      
      <div className="add-product-form">
        <input
          type="text"
          placeholder="Назва продукту"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
        />
        <input
          type="text"
          placeholder="Кількість"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />
        <button onClick={addProduct}>Додати</button>
      </div>

      <ul className="product-list">
        {products.map(product => (
          <li key={product.id} className={product.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={product.completed}
              onChange={() => toggleProduct(product.id)}
            />
            <span className="product-name">{product.name}</span>
            <span className="product-quantity">{product.quantity}</span>
            <button 
              className="delete-btn"
              onClick={() => deleteProduct(product.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;