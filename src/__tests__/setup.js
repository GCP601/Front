// src/__tests__/test-utils.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

// Mock do Layout para simplificar os testes
const MockLayout = ({ children }) => (
  <div data-testid="layout">
    <header data-testid="header">Header Mock</header>
    <main data-testid="main">{children}</main>
    <footer data-testid="footer">Footer Mock</footer>
  </div>
);

// Dados mock para testes
export const mockProducts = [
  {
    id: 1,
    name: "Smartphone Test",
    description: "Produto de teste para smartphone",
    price: 999.99,
    category: "Eletrônicos",
    pictureUrl: "https://example.com/smartphone.jpg"
  },
  {
    id: 2,
    name: "Notebook Test",
    description: "Produto de teste para notebook",
    price: 2499.99,
    category: "Informática",
    pictureUrl: "https://example.com/notebook.jpg"
  },
  {
    id: 3,
    name: "Fone Test",
    description: "Produto de teste para fone",
    price: 299.99,
    category: "Áudio",
    pictureUrl: "https://example.com/fone.jpg"
  }
];

// Função para criar um router de teste
export const createTestRouter = (component, loaderData = mockProducts, initialPath = '/') => {
  return createMemoryRouter([
    {
      path: '/',
      element: <MockLayout />,
      children: [
        {
          index: true,
          element: component,
          loader: () => loaderData
        },
        {
          path: 'novo-produto',
          element: <div data-testid="new-product-page">Nova Produto Page</div>
        }
      ]
    }
  ], {
    initialEntries: [initialPath]
  });
};

// Função customizada para renderizar com router
export const renderWithRouter = (component, options = {}) => {
  const {
    loaderData = mockProducts,
    initialPath = '/',
    ...renderOptions
  } = options;

  const router = createTestRouter(component, loaderData, initialPath);

  return {
    ...render(<RouterProvider router={router} />, renderOptions),
    router
  };
};

// Mock para axios (será usado nos testes de integração)
export const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Função para limpar todos os mocks
export const clearAllMocks = () => {
  Object.values(mockAxios).forEach(mock => mock.mockClear());
  jest.clearAllTimers();
  jest.clearAllMocks();
};

// Função para aguardar debounce nos testes
export const waitForDebounce = (ms = 600) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Helpers para assertions comuns
export const expectProductToBeDisplayed = (container, product) => {
  expect(container).toHaveTextContent(`(${product.id})`);
  expect(container).toHaveTextContent(product.name);
  expect(container).toHaveTextContent(product.category);
  expect(container).toHaveTextContent(`R$ ${product.price.toFixed(2).replace('.', ',')}`);
};

export default {
  renderWithRouter,
  mockProducts,
  createTestRouter,
  clearAllMocks,
  waitForDebounce,
  expectProductToBeDisplayed
};