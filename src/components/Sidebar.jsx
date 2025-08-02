import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside style={sidebarStyle}>
      <nav>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <Link
              to="/"
              className={`link-button ${location.pathname === '/' ? 'active' : ''}`}
            >
              Início
            </Link>
          </li>
          <li style={liStyle}>
            <Link
              to="/novo-produto"
              className={`link-button ${location.pathname === '/novo-produto' ? 'active' : ''}`}
            >
              Novo Produto
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const sidebarStyle = {
  width: '250px',
  padding: '2rem 1rem',
  backgroundColor: 'var(--primary-color)',
  color: 'var(--card-bg)', // Cor do texto base
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
};

const ulStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const liStyle = {
  marginBottom: '1rem',
};

export default Sidebar;
