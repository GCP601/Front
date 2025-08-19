import React, { useState, useEffect } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

const HomePage = () => {
  const allProducts = useLoaderData();
  console.log('🔍 Dados recebidos do loader:', allProducts);
  
  const [filterCode, setFilterCode] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState(allProducts || []);

  // ✅ Atualizar displayedProducts quando allProducts mudar
  useEffect(() => {
    setDisplayedProducts(allProducts || []);
  }, [allProducts]);

  // ✅ Implementação do debounce para filtragem automática
// ✅ Código corrigido
useEffect(() => {
  const timer = setTimeout(() => {
    if (filterCode === '') {
      setDisplayedProducts(allProducts || []);
    } else {
      const searchTerm = filterCode.trim();
      const filteredProducts = (allProducts || []).filter(product => {
        // Converte ambos para string para comparação consistente
        return String(product.id) === searchTerm;
      });
      setDisplayedProducts(filteredProducts);
    }
  }, 500);

  return () => clearTimeout(timer);
}, [filterCode, allProducts]);

  // ✅ Verificação de segurança
  if (!allProducts) {
    return <div>Carregando produtos...</div>;
  }

  if (allProducts.length === 0) {
    return <div>Nenhum produto encontrado.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={pageTitleStyle}>Lista de Produtos</h1>

      <div style={filterContainerStyle}>
        <label htmlFor="filterCode" style={filterLabelStyle}>Código:</label>
        <input
          id="filterCode"
          type="text"
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
          placeholder="Digite o código do produto..."
          style={filterInputStyle}
        />
        {/* ❌ Botão "Filtrar" removido - filtragem é automática */}
      </div>

      {/* ✅ Feedback visual durante a busca */}
      {filterCode && displayedProducts.length === 0 && (
        <div style={noResultsStyle}>
          Nenhum produto encontrado com o código "{filterCode}"
        </div>
      )}

      <ul style={listStyle}>
        {displayedProducts.map(product => (
          <li key={product.id} style={productCardStyle}>
            <div style={imageContainerStyle}>
              <div style={circularImageStyle}>
                <img 
                  src={product.pictureUrl} 
                  alt={product.name} 
                  style={imageStyle}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/240x240?text=Sem+Imagem';
                  }}
                />
              </div>
            </div>

            <div style={infoContainerStyle}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', marginRight: '8px' }}>({product.id})</span>
                <span style={{ fontWeight: 600 }}>{product.name}</span>
              </div>
              <div style={categoryInfoStyle}>
                <span style={categoryTextStyle}>{product.category}</span>
              </div>
              <div style={{ marginTop: '20px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div style={buttonsContainerStyle}>
              <button style={editButtonStyle}>Editar</button>
              <button style={deleteButtonStyle}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/novo-produto">
          <button style={newProductButtonStyle}>Novo Produto</button>
        </Link>
      </div>
    </div>
  );
};

// Estilos
const pageTitleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#212121',
  marginBottom: '1.5rem',
};

const filterContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
  gap: '10px'
};

const filterLabelStyle = {
  fontWeight: 'bold',
  minWidth: '60px'
};

const filterInputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '2px solid #e0e0e0',
  flexGrow: 1,
  maxWidth: '300px',
  fontSize: '16px',
  transition: 'border-color 0.2s ease',
  outline: 'none',
  ':focus': {
    borderColor: '#1e88e5'
  }
};

const noResultsStyle = {
  padding: '20px',
  textAlign: 'center',
  color: '#666',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  marginBottom: '20px',
  fontStyle: 'italic'
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const productCardStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '288px',
  padding: '12px',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  marginBottom: '16px',
  position: 'relative',
  border: '1px solid #e0e0e0',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const imageContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '240px',
  height: '264px',
  marginRight: '20px'
};

const circularImageStyle = {
  width: '240px',
  height: '240px',
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #e0e0e0'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const infoContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
  paddingTop: '20px',
  flexGrow: 1
};

const categoryInfoStyle = {
  marginTop: '12px',
  marginBottom: '8px'
};

const categoryTextStyle = {
  fontSize: '0.8em',
  color: 'white',
  backgroundColor: '#9e9e9e',
  padding: '4px 8px',
  borderRadius: '4px'
};

const buttonsContainerStyle = {
  position: 'absolute',
  bottom: '20px',
  right: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
};

const editButtonStyle = {
  backgroundColor: 'white',
  color: '#212121',
  border: '1px solid #ccc',
  borderRadius: '20px',
  padding: '8px 20px',
  cursor: 'pointer',
  minWidth: '90px',
  transition: 'all 0.2s ease'
};

const deleteButtonStyle = {
  backgroundColor: '#d32f2f',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  padding: '8px 20px',
  cursor: 'pointer',
  minWidth: '90px',
  transition: 'all 0.2s ease'
};

const newProductButtonStyle = {
  backgroundColor: '#43a047',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease'
};

export default HomePage;