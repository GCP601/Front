import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  redirect
} from 'react-router-dom';

import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import NewProductPage from './pages/NewProductPage.jsx';
import initialData from './data.json';

// Array para armazenar os produtos em memória
// O '...initialData.products' agora funciona porque o JSON foi corrigido.
let productsData = [...initialData.products];

const router = createBrowserRouter(
  createRoutesFromElements(
    // A rota principal '/' usa o componente Layout
    <Route path="/" element={<Layout />}>
      {/* A página inicial renderiza o HomePage */}
      <Route
        index
        element={<HomePage />}
        // O 'loader' carrega os dados antes da renderização do componente
        loader={() => productsData}
      />

      {/* A rota 'novo-produto' renderiza a página do formulário */}
      <Route
        path="novo-produto"
        element={<NewProductPage />}
        // A 'action' lida com os dados do formulário enviado
        action={async ({ request }) => {
          const formData = await request.formData();
          const newProduct = {
            // Gera um ID único para o novo produto
            id: productsData.length > 0 ? Math.max(...productsData.map(p => p.id)) + 1 : 1,
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            pictureUrl: formData.get('pictureUrl')
          };

          // Adiciona o novo produto ao array em memória
          productsData.push(newProduct);

          // Redireciona o usuário para a página inicial
          return redirect('/');
        }}
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
