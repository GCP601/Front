import React, { useState, useEffect } from 'react';
import ProductCard from './Componentes/ProductCard';
import productsData from './data.json';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  // Função para lidar com a mudança no campo de texto
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Função para lidar com o clique no botão "Filtrar"
  const handleFilterClick = () => {
    if (searchTerm === '') {
      setFilteredProducts(productsData); // Exibe todos os produtos se o campo estiver vazio
    } else {
      // Filtra os produtos com base no ID fornecido
      const filtered = productsData.filter(product =>
        product.id.toString() === searchTerm
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Listagem de Produtos</h1>
        <div className="filter-section">
          <label htmlFor="productCode">Código:</label>
          <input
            type="text"
            id="productCode"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Digite o código do produto"
          />
          <button onClick={handleFilterClick}>Filtrar</button>
        </div>
      </header>
      <div className="product-list">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default App;
