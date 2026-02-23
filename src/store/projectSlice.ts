import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppScreen = 'new-project' | 'editor';

export interface ProjectMeta {
  name: string;
  path: string;
  templateId: string;
  createdAt: string;
  lastModified: string;
  sgdkVersion: string;
}

interface ProjectState {
  // Tela atual do app
  currentScreen: AppScreen;

  // Metadados do projeto ativo
  meta: ProjectMeta | null;

  // Estado de carregamento
  isLoading: boolean;
  error: string | null;

  // Historico de projetos recentes (para exibir no New Project Screen)
  recentProjects: Array<{
    name: string;
    path: string;
    lastModified: string;
  }>;
}

const initialState: ProjectState = {
  currentScreen: 'new-project',
  meta: null,
  isLoading: false,
  error: null,
  recentProjects: [],
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Cria um novo projeto e vai para o editor
    createProject(
      state,
      action: PayloadAction<{ name: string; path: string; templateId: string }>
    ) {
      const now = new Date().toISOString();
      state.meta = {
        name: action.payload.name,
        path: action.payload.path,
        templateId: action.payload.templateId,
        createdAt: now,
        lastModified: now,
        sgdkVersion: '2.00',
      };
      state.currentScreen = 'editor';
      state.error = null;

      // Adiciona ao historico de recentes
      state.recentProjects.unshift({
        name: action.payload.name,
        path: action.payload.path,
        lastModified: now,
      });
      // Mante apenas os ultimos 10 projetos recentes
      if (state.recentProjects.length > 10) {
        state.recentProjects.pop();
      }
    },

    // Abre um projeto existente
    openProject(
      state,
      action: PayloadAction<ProjectMeta>
    ) {
      state.meta = action.payload;
      state.currentScreen = 'editor';
      state.error = null;
    },

    // Volta para a tela inicial
    closeProject(state) {
      state.meta = null;
      state.currentScreen = 'new-project';
    },

    // Atualiza metadados do projeto (ex: salvar)
    updateProjectMeta(
      state,
      action: PayloadAction<Partial<ProjectMeta>>
    ) {
      if (state.meta) {
        state.meta = {
          ...state.meta,
          ...action.payload,
          lastModified: new Date().toISOString(),
        };
      }
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Navega direto para uma tela
    setScreen(state, action: PayloadAction<AppScreen>) {
      state.currentScreen = action.payload;
    },
  },
});

export const {
  createProject,
  openProject,
  closeProject,
  updateProjectMeta,
  setLoading,
  setError,
  setScreen,
} = projectSlice.actions;

export default projectSlice.reducer;
