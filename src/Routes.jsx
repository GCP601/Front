import axios from 'axios';
import { createBrowserRouter, redirect } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import NewProductPage from './pages/NewProductPage.jsx';
// import ErrorPage from './components/ErrorPage.jsx'; // ❌ Comentado temporariamente

// URL do JSON Server
const API_URL = 'http://localhost:3001/products';

// Função para carregar todos os produtos
const loadProducts = async () => {
  try {
    console.log('🔍 Carregando produtos da API:', API_URL);
    const response = await axios.get(API_URL);
    console.log('✅ Produtos carregados:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao carregar produtos:', error);
    // Em caso de erro, retorna array vazio para não quebrar a aplicação
    return [];
  }
};

// Função para adicionar um novo produto
const addProduct = async (productData) => {
  try {
    console.log('📝 Adicionando produto:', productData);
    const response = await axios.post(API_URL, productData);
    console.log('✅ Produto adicionado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao adicionar produto:', error);
    throw error; // Re-throw para que a action possa lidar com o erro
  }
};

// Função para deletar um produto (para uso futuro)
const deleteProduct = async (productId) => {
  try {
    console.log('🗑️ Deletando produto ID:', productId);
    await axios.delete(`${API_URL}/${productId}`);
    console.log('✅ Produto deletado');
    return true;
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    throw error;
  }
};

// Função para atualizar um produto (para uso futuro)
const updateProduct = async (productId, productData) => {
  try {
    console.log('📝 Atualizando produto ID:', productId, 'Dados:', productData);
    const response = await axios.put(`${API_URL}/${productId}`, productData);
    console.log('✅ Produto atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    throw error;
  }
};

// Configuração das rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // errorElement: <ErrorPage />, // ❌ Comentado temporariamente
    children: [
      {
        // Rota principal - Lista de produtos
        index: true,
        element: <HomePage />,
        loader: loadProducts,
      },
      {
        // Rota para adicionar novo produto
        path: 'novo-produto',
        element: <NewProductPage />,
        action: async ({ request }) => {
          const formData = await request.formData();
          
          try {
            const newProduct = {
              name: formData.get('name'),
              description: formData.get('description'),
              price: parseFloat(formData.get('price')),
              category: formData.get('category'),
              pictureUrl: formData.get('pictureUrl'),
            };

            // Validação básica
            if (!newProduct.name || !newProduct.price || isNaN(newProduct.price)) {
              throw new Error('Nome e preço são obrigatórios');
            }

            await addProduct(newProduct);
            
            // Redireciona para a página inicial após sucesso
            return redirect('/');
            
          } catch (error) {
            console.error('❌ Erro na action de novo produto:', error);
            
            // Retorna o erro para ser tratado pelo componente
            return {
              error: error.message || 'Erro ao adicionar produto',
              formData: Object.fromEntries(formData)
            };
          }
        },
      },
      {
        // Rota para editar produto (implementação futura)
        path: 'editar-produto/:id',
        element: <div>Página de edição (em desenvolvimento)</div>,
        loader: async ({ params }) => {
          try {
            const response = await axios.get(`${API_URL}/${params.id}`);
            return response.data;
          } catch (error) {
            throw new Response('Produto não encontrado', { status: 404 });
          }
        },
      },
      {
        // Rota catch-all para páginas não encontradas
        path: '*',
        element: <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: '#666'
        }}>
          <h2>404 - Página não encontrada</h2>
          <p>A página que você procura não existe.</p>
          <a href="/" style={{ color: '#1e88e5', textDecoration: 'none' }}>
            ← Voltar para a página inicial
          </a>
        </div>
      }
    ],
  },
]);

// Exportar o router e as funções utilitárias
export { router, loadProducts, addProduct, deleteProduct, updateProduct };
export default router;