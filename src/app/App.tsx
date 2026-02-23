import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import WorldEditor from '../components/world/WorldEditor';
import { createGlobalStyle } from 'styled-components';

// -------------------------------------------------------
// Estilos globais do MD Studio
// -------------------------------------------------------
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root {
    width: 100%; height: 100%;
    overflow: hidden;
    background: #1a1a2e;
    color: #e0e0e0;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #0f3460; }
  ::-webkit-scrollbar-thumb { background: #e94560; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #c73652; }
  select, input, button { font-family: inherit; }
`;

// -------------------------------------------------------
// App - Raiz da aplicacao MD Studio
// Electron + React + Redux
// -------------------------------------------------------
const App: React.FC = () => (
  <Provider store={store}>
    <GlobalStyle />
    <WorldEditor />
  </Provider>
);

export default App;
