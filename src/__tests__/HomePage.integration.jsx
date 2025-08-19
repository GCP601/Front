// src/__tests__/HomePage.integration.test.jsx
import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import { loadProducts } from '../Routes';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock do Layout
const MockLayout = () => (
  <div data-testid="layout">
    <main><HomePage /></main>
  </div>
);

// Dados de teste mais realistas
const mockApiResponse = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "Smartphone Apple com chip A17 Pro e câmera de 48MP",
    price: 7999.99,
    category: "Smartphones",
    pictureUrl: "https://example.com/iphone15.jpg"
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    description: "Notebook Apple com processador M3 e 16GB RAM",
    price: 12999.99,
    category: "Notebooks",
    pictureUrl: "https://example.com/macbook.jpg"
  },
  {
    id: 10,
    name: "AirPods Pro 2",
    description: "Fones sem fio com cancelamento de ruído ativo",
    price: 1899.99,
    category: "Áudio",
    pictureUrl: "https://example.com/airpods.jpg"
  }
];

describe('HomePage Integration Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.useFakeTimers();
    mockedAxios.get.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const createRouterWithRealLoader = (mockData = mockApiResponse) => {
    // Mock da resposta do axios
    mockedAxios.get.mockResolvedValue({ data: mockData });

    return createMemoryRouter([
      {
        path: '/',
        element: <MockLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
            loader: loadProducts // Usa o loader real
          }
        ]
      }
    ]);
  };

  describe('Integração com Loader Real', () => {
    test('deve carregar e exibir produtos do loader real', async () => {
      const router = createRouterWithRealLoader();
      
      render(<RouterProvider router={router} />);

      // Aguarda o carregamento dos dados
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
        expect(screen.getByText('MacBook Pro M3')).toBeInTheDocument();
        expect(screen.getByText('AirPods Pro 2')).toBeInTheDocument();
      });

      // Verifica se o axios foi chamado corretamente
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/products');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test('deve exibir preços formatados corretamente', async () => {
      const router = createRouterWithRealLoader();
      
      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText('R$ 7.999,99')).toBeInTheDocument();
        expect(screen.getByText('R$ 12.999,99')).toBeInTheDocument();
        expect(screen.getByText('R$ 1.899,99')).toBeInTheDocument();
      });
    });

    test('deve lidar com erro da API graciosamente', async () => {
      // Mock de erro na API
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));
      
      const router = createRouterWithRealLoader();
      
      render(<RouterProvider router={router} />);

      // Como o loader retorna array vazio em caso de erro
      await waitFor(() => {
        expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument();
      });
    });

    test('deve lidar com resposta da API vazia', async () => {
      const router = createRouterWithRealLoader([]);
      
      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument();
      });
    });
  });

  describe('Filtro com Dados Reais', () => {
    test('deve filtrar produto por ID específico', async () => {
      const router = createRouterWithRealLoader();
      
      render(<RouterProvider router={router} />);

      // Aguarda carregamento inicial
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      const filterInput = screen.getByLabelText('Código:');
      
      // Filtra pelo ID 10 (AirPods)
      await user.type(filterInput, '10');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText('AirPods Pro 2')).toBeInTheDocument();
        expect(screen.queryByText('iPhone 15 Pro')).not.toBeInTheDocument();
        expect(screen.queryByText('MacBook Pro M3')).not.toBeInTheDocument();
      });
    });

    test('deve mostrar todos os produtos após limpar filtro', async () => {
      const router = createRouterWithRealLoader();
      
      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      const filterInput = screen.getByLabelText('Código:');
      
      // Primeiro filtra
      await user.type(filterInput, '1');
      act(() => { jest.advanceTimersByTime(500); });
      
      await waitFor(() => {
        expect(screen.queryByText('MacBook Pro M3')).not.toBeInTheDocument();
      });
      
      // Depois limpa
      await user.clear(filterInput);
      act(() => { jest.advanceTimersByTime(500); });
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
        expect(screen.getByText('MacBook Pro M3')).toBeInTheDocument();
        expect(screen.getByText('AirPods Pro 2')).toBeInTheDocument();
      });
    });

    test('deve exibir mensagem para código inexistente', async () => {
      const router = createRouterWithRealLoader();
      
      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      const filterInput = screen.getByLabelText('Código:');
      
      // Busca por ID que não existe
      await user.type(filterInput, '999');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText('Nenhum produto encontrado com o código "999"')).toBeInTheDocument();
      });
    });
  });

  describe('Comportamento Completo da Aplicação', () => {
    test('deve manter estado do filtro após re-render', async () => {
      const router = createRouterWithRealLoader();
      const { rerender } = render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      const filterInput = screen.getByLabelText('Código:');
      await user.type(filterInput, '2');

      // Re-renderiza o componente
      rerender(<RouterProvider router={router} />);

      // O valor do input deve ser mantido
      expect(filterInput).toHaveValue('2');
    });

    test('deve funcionar com dados de diferentes formatos de preço', async () => {
      const productsWithVariedPrices = [
        { ...mockApiResponse[0], price: 99.9 }, // Preço com uma casa decimal
        { ...mockApiResponse[1], price: 1000 }, // Preço inteiro
        { ...mockApiResponse[2], price: 15.50 } // Preço com duas casas decimais
      ];

      const router = createRouterWithRealLoader(productsWithVariedPrices);
      
      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText('R$ 99,90')).toBeInTheDocument();
        expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument();
        expect(screen.getByText('R$ 15,50')).toBeInTheDocument();
      });
    });
  });
});