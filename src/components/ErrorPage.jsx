import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  console.error('🚨 Erro de rota:', error);

  return (
    <div style={containerStyle}>
      <div style={errorCardStyle}>
        <div style={iconStyle}>⚠️</div>
        
        <h1 style={titleStyle}>Ops! Algo deu errado</h1>
        
        <div style={errorInfoStyle}>
          <p style={messageStyle}>
            {error?.status === 404 
              ? 'Página não encontrada' 
              : 'Ocorreu um erro inesperado'}
          </p>
          
          {error?.statusText && (
            <p style={detailStyle}>
              <strong>Detalhes:</strong> {error.statusText}
            </p>
          )}
          
          {error?.message && (
            <p style={detailStyle}>
              <strong>Mensagem:</strong> {error.message}
            </p>
          )}
        </div>

        <div style={actionsStyle}>
          <Link to="/" style={buttonStyle}>
            🏠 Voltar ao início
          </Link>
          
          <button 
            onClick={() => window.location.reload()} 
            style={secondaryButtonStyle}
          >
            🔄 Recarregar página
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details style={debugStyle}>
            <summary style={debugSummaryStyle}>
              🔍 Detalhes técnicos (desenvolvimento)
            </summary>
            <pre style={stackStyle}>
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

// Estilos
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  padding: '20px',
  fontFamily: 'Arial, sans-serif'
};

const errorCardStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '40px',
  maxWidth: '500px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0'
};

const iconStyle = {
  fontSize: '4rem',
  marginBottom: '20px',
  filter: 'grayscale(20%)'
};

const titleStyle = {
  color: '#333',
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '20px',
  margin: '0 0 20px 0'
};

const errorInfoStyle = {
  marginBottom: '30px'
};

const messageStyle = {
  fontSize: '1.1rem',
  color: '#666',
  marginBottom: '10px'
};

const detailStyle = {
  fontSize: '0.9rem',
  color: '#888',
  marginBottom: '5px',
  textAlign: 'left',
  backgroundColor: '#f8f9fa',
  padding: '10px',
  borderRadius: '4px',
  borderLeft: '4px solid #dc3545'
};

const actionsStyle = {
  display: 'flex',
  gap: '15px',
  justifyContent: 'center',
  flexWrap: 'wrap'
};

const buttonStyle = {
  backgroundColor: '#1e88e5',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px'
};

const secondaryButtonStyle = {
  backgroundColor: 'white',
  color: '#666',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
  border: '2px solid #e0e0e0',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px'
};

const debugStyle = {
  marginTop: '30px',
  textAlign: 'left',
  fontSize: '0.8rem'
};

const debugSummaryStyle = {
  cursor: 'pointer',
  color: '#666',
  fontWeight: 'bold',
  marginBottom: '10px'
};

const stackStyle = {
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '4px',
  overflow: 'auto',
  maxHeight: '200px',
  fontSize: '0.75rem',
  color: '#dc3545',
  border: '1px solid #dee2e6'
};

export default ErrorPage;