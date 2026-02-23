import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from '../store/store';
import { createGlobalStyle } from 'styled-components';
import WorldEditor from '../components/world/WorldEditor';
import NewProjectScreen from '../components/start/NewProjectScreen';
import { createProject, closeProject } from '../store/projectSlice';
import type { RootState } from '../store/store';

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
// AppRouter - Controla qual tela exibir
// new-project -> NewProjectScreen (Getting Started)
// editor      -> WorldEditor (editor principal)
// -------------------------------------------------------
const AppRouter: React.FC = () => {
  const dispatch = useDispatch();
  const currentScreen = useSelector(
    (state: RootState) => state.project.currentScreen
  );

  const handleCreateProject = (
    name: string,
    path: string,
    templateId: string
  ) => {
    dispatch(createProject({ name, path, templateId }));
  };

  const handleOpenProject = () => {
    // No Electron, abre dialogo de arquivo via IPC
    if (window.mdStudio?.openProject) {
      window.mdStudio.openProject().then((projectMeta: any) => {
        if (projectMeta) {
          dispatch(createProject(projectMeta));
        }
      });
    }
  };

  if (currentScreen === 'new-project') {
    return (
      <NewProjectScreen
        onCreateProject={handleCreateProject}
        onOpenProject={handleOpenProject}
      />
    );
  }

  return <WorldEditor />;
};

// -------------------------------------------------------
// App - Raiz da aplicacao MD Studio
// Electron + React + Redux
// -------------------------------------------------------
const App: React.FC = () => (
  <Provider store={store}>
    <GlobalStyle />
    <AppRouter />
  </Provider>
);

export default App;
