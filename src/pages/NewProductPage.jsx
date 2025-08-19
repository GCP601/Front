import React from 'react';
import { Form, useNavigate } from 'react-router-dom';

const NewProductPage = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Cadastrar Novo Produto</h1>
      <Form method="post" style={formStyle}>
        <label style={labelStyle}>
          Nome:
          <input type="text" name="name" required style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Descrição:
          <textarea name="description" required style={{ ...inputStyle, minHeight: '100px' }}></textarea>
        </label>
        <label style={labelStyle}>
          Preço:
          <input type="number" name="price" step="0.01" required style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Categoria:
          <input type="text" name="category" required style={inputStyle} />
        </label>
        <label style={labelStyle}>
          URL da Imagem:
          <input type="text" name="pictureUrl" required style={inputStyle} />
        </label>
        <div style={buttonsContainerStyle}>
          <button type="submit" style={createButtonStyle}>Criar</button>
          <button type="button" onClick={() => navigate('/')} style={cancelButtonStyle}>Cancelar</button>
        </div>
      </Form>
    </div>
  );
};

const containerStyle = {
  maxWidth: '700px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '600',
  color: '#333',
  marginBottom: '2rem',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  fontWeight: '500',
  color: '#555',
  gap: '0.5rem',
};

const inputStyle = {
  padding: '12px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  fontSize: '1rem',
  transition: 'border-color 0.2s',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonsContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  marginTop: '1.5rem',
};

const buttonBaseStyle = {
  padding: '12px 24px',
  borderRadius: '25px',
  fontWeight: '600',
  cursor: 'pointer',
  border: 'none',
  transition: 'transform 0.1s ease-in-out',
};

const createButtonStyle = {
  ...buttonBaseStyle,
  backgroundColor: '#007bff',
  color: 'white',
};

const cancelButtonStyle = {
  ...buttonBaseStyle,
  backgroundColor: '#f0f0f0',
  color: '#333',
};

export default NewProductPage;
