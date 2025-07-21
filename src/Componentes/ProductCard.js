import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.pictureUrl} alt={product.name} className="product-image" />
      </div>
      <div className="product-details">
        <p className="product-id-name">({product.id}) {product.name}</p>
        <p className="product-category">{product.category}</p>
        <p className="product-price">R${product.price.toFixed(2).replace('.', ',')}</p>
        <div className="product-actions">
          <button className="edit-button">Editar</button>
          <button className="delete-button">Excluir</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
