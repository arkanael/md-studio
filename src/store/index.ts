import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './features/editor/editorSlice';
import entitiesReducer from './features/entities/entitiesSlice';
import scenesReducer from './features/scenes/scenesSlice';
import projectReducer from './projectSlice';

// ------------------------------------------
// Store Redux - MD Studio
// Estado global do editor visual + projeto
// ------------------------------------------
export const store = configureStore({
  reducer: {
    project: projectReducer,    // tela atual, metadados do projeto
    editor: editorReducer,      // estado do editor (zoom, pan, tool)
    entities: entitiesReducer,  // sprites, backgrounds, paletas, musica
    scenes: scenesReducer,      // cenas com atores, triggers, colisoes
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora campos de clipboard (pode ter objetos complexos)
        ignoredActions: ['editor/setClipboard'],
        ignoredPaths: ['editor.clipboard'],
      },
    }),
});

// Tipos exportados para uso nos componentes
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Middleware helper para acesso ao store fora de componentes React
export function middleware() {
  return store.getState();
}
