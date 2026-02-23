import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './app/App';

// -------------------------------------------------
// index.tsx - Ponto de entrada do React
// MD Studio - Editor Visual para Mega Drive / SGDK
// -------------------------------------------------

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento root nao encontrado no DOM. Verifique public/index.html');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Suporte a Hot Module Replacement em dev
if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./app/App', () => {
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  });
}
