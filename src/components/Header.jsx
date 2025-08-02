import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={headerStyle}>
      <Link to="/" style={titleLinkStyle}>
        <h1 style={titleStyle}>Portal de Produtos</h1>
      </Link>
      <div style={userInfoStyle}>
        <span>Olá, Usuário!</span>
      </div>
    </header>
  );
};

const headerStyle = {
  padding: '1.5rem 2rem',
  backgroundColor: 'var(--primary-color)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: 'var(--card-bg)', // Cor branca para contraste
};

const titleLinkStyle = {
  textDecoration: 'none',
  color: 'inherit',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  margin: 0,
  letterSpacing: '1px',
};

const userInfoStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: 'var(--card-bg)',
};

export default Header;
