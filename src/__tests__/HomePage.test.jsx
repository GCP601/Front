// src/__tests__/HomePage.test.jsx
import React from 'react';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../pages/HomePage';
import { 
  renderWithRouter, 
  mockProducts, 
  clearAllMocks,
  waitForDebounce,
  expectProductToBeDisplayed
} from './test-utils';

// Mock para console.log para reduzir ruído nos testes
jest.mock('console', () => ({
  ...console,
  log: jest.fn(),
}));

describe('HomePage Component', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Renderização Inicial', () => {
    test('deve renderizar o título da página', () => {
      renderWithRouter(<HomePage />);
      
      expect(screen.getByText('Lista de Produtos')).toBeInTheDocument();
    });

    test('deve renderizar o campo de filtro com label e placeholder', () => {
      renderWithRouter(<HomePage />);
      
      expect(screen.getByLabelText('Código:')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite o código do produto...')).toBeInTheDocument();
    });

    test('deve renderizar o botão "Novo Produto"', () => {
      renderWithRouter(<HomePage />);
      
      expect(screen.getByRole('link', { name: /novo produto/i })).toBeInTheDocument();
    });
  });

  describe('Exibição de Produtos do Loader', () => {
    test('deve exibir todos os produtos retornados pelo loader', () => {
      const { container } = renderWithRouter(<HomePage />);
      
      // Verifica se todos os produtos mock são exibidos
      mockProducts.forEach(product => {
        expectProductToBeDisplayed(container, product);
      });
    });

    test('deve exibir produtos com dados corretos do loader', () => {
      renderWithRouter(<HomePage />);
      
      // Verifica detalhes específicos dos produtos
      expect(screen.getByText('(1)')).toBeInTheDocument();
      expect(screen.getByText('Smartphone Test')).toBeInTheDocument();
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
      expect(screen.getByText('R$ 999,99')).toBeInTheDocument();
      
      expect(screen.getByText('(2)')).toBeInTheDocument();
      expect(screen.getByText('Notebook Test')).toBeInTheDocument();
      expect(screen.getByText('Informática')).toBeInTheDocument();
      expect(screen.getByText('R$ 2.499,99')).toBeInTheDocument();
    });

    test('deve exibir imagens dos produtos com src e alt corretos', () => {
      renderWithRouter(<HomePage />);
      
      const smartphoneImage = screen.getByAltText('Smartphone Test');
      expect(smartphoneImage).toHaveAttribute('src', 'https://example.com/smartphone.jpg');
      
      const notebookImage = screen.getByAltText('Notebook Test');
      expect(notebookImage).toHaveAttribute('src', 'https://example.com/notebook.jpg');
    });

    test('deve exibir botões de editar e excluir para cada produto', () => {
      renderWithRouter(<HomePage />);
      
      const editButtons = screen.getAllByText('Editar');
      const deleteButtons = screen.getAllByText('Excluir');
      
      expect(editButtons).toHaveLength(mockProducts.length);
      expect(deleteButtons).toHaveLength(mockProducts.length);
    });
  });

  describe('Tratamento de Dados Vazios', () => {
    test('deve exibir mensagem quando não há produtos', () => {
      renderWithRouter(<HomePage />, { loaderData: [] });
      
      expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument();
    });

    test('deve lidar com loader retornando null', () => {
      renderWithRouter(<HomePage />, { loaderData: null });
      
      expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();
    });

    test('deve lidar com loader retornando undefined', () => {
      renderWithRouter(<HomePage />, { loaderData: undefined });
      
      expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();
    });
  });

  describe('Funcionalidade de Filtro com Debounce', () => {
    test('deve filtrar produto por código após debounce', async () => {
      renderWithRouter(<HomePage />);
      
      const filterInput = screen.getByLabelText('Código:');
      
      // Digita o código do primeiro produto
      await user.type(filterInput, '1');
      
      // Antes do debounce, ainda deve mostrar todos os produtos
      expect(screen.getByText('Smartphone Test')).toBeInTheDocument();
      expect(screen.getByText('Notebook Test')).toBeInTheDocument();
      
      // Avança o tempo para ativar o debounce
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Após o debounce, deve mostrar apenas o produto filtrado
      await waitFor(() => {
        expect(screen.getByText('Smartphone Test')).toBeInTheDocument();
        expect(screen.queryByText('Notebook Test')).not.toBeInTheDocument();
        expect(screen.queryByText('Fone Test')).not.toBeInTheDocument();
      });
    });

    test('deve mostrar todos os produtos quando filtro é limpo', async () => {
      renderWithRouter(<HomePage />);
      
      const filterInput = screen.getByLabelText('Código:');
      
      // Primeiro filtra
      await user.type(filterInput, '1');
      act(() => { jest.advanceTimersByTime(500); });
      
      await waitFor(() => {
        expect(screen.queryByText('Notebook Test')).not.toBeInTheDocument();
      });
      
      // Depois limpa o filtro
      await user.clear(filterInput);
      act(() => { jest.advanceTimersByTime(500); });
      
      // Deve mostrar todos os produtos novamente
      await waitFor(() => {
        expect(screen.getByText('Smartphone Test')).toBeInTheDocument();
        expect(screen.getByText('Notebook Test')).toBeInTheDocument();
        expect(screen.getByText('Fone Test')).toBeInTheDocument();
      });
    });

    test('deve exibir mensagem quando nenhum produto corresponde ao filtro', async () => {
      renderWithRouter(<HomePage />);
      
      const filterInput = screen.getByLabelText('Código:');
      
      // Digita um código que não existe
      await user.type(filterInput, '999');
      act(() => { jest.advanceTimersByTime(500); });
      
      // Deve exibir mensagem de "nenhum produto encontrado"
      await waitFor(() => {
        expect(screen.getByText('Nenhum produto encontrado com o código "999"')).toBeInTheDocument();
      });
    });

    test('deve cancelar timer anterior quando usuário continua digitando', async () => {
      const timerSpy = jest.spyOn(global, 'setTimeout');
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      renderWithRouter(<HomePage />);
      
      const filterInput = screen.getByLabelText('Código:');
      
      // Digite múltiplos caracteres rapidamente
      await user.type(filterInput, '1');
      await user.type(filterInput, '2');
      await user.type(filterInput, '3');
      
      // Deve ter cancelado os timers anteriores
      expect(clearTimeoutSpy).toHaveBeenCalled();
      
      timerSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
    });

    test('deve filtrar apenas por ID numérico exato', async () => {
      renderWithRouter(<HomePage />);
      
      const filterInput = screen.getByLabelText('Código:');
      
      // Testa filtro com ID que é substring de outro
      await user.type(filterInput, '1');
      act(() => { jest.advanceTimersByTime(500); });
      
      await waitFor(() => {
        // Deve mostrar apenas produto com ID 1, não produtos que contém "1"
        expect(screen.getByText('Smartphone Test')).toBeInTheDocument();
        expect(screen.queryByText('Notebook Test')).not.toBeInTheDocument();
        expect(screen.queryByText('Fone Test')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navegação', () => {
    test('deve ter link para nova produto funcionando', () => {
      renderWithRouter(<HomePage />);
      
      const newProductLink = screen.getByRole('link', { name: /novo produto/i });
      expect(newProductLink).toHaveAttribute('href', '/novo-produto');
    });
  });

  describe('Interações de UI', () => {
    test('deve manter o valor digitado no campo de filtro', async () => {
      renderWithRouter(<HomePage />);
      
      const filterInput = screen.getByLabelText('Código:');
      
      await user.type(filterInput, '123');
      
      expect(filterInput).toHaveValue('123');
    });

    test('deve tratar erro de imagem graciosamente', () => {
      renderWithRouter(<HomePage />);
      
      const image = screen.getByAltText('Smartphone Test');
      
      // Simula erro de carregamento da imagem
      fireEvent.error(image);
      
      // Deve ter fallback de imagem
      expect(image).toHaveAttribute('src', expect.stringContaining('placeholder') || expect.stringContaining('Erro'));
    });
  });

  describe('Performance e Otimizações', () => {
    test('deve usar debounce de 500ms', async () => {
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      
      renderWithRouter(<HomePage />);
      
      const filterInput = screen.getByLabelText('Código:');
      await user.type(filterInput, '1');
      
      // Verifica se setTimeout foi chamado com 500ms
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);
      
      setTimeoutSpy.mockRestore();
    });
  });
});