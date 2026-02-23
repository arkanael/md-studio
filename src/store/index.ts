import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './features/editor/editorSlice';
import entitiesReducer from './features/entities/entitiesSlice';
import projectReducer from './projectSlice';

// -------------------------------------------------
// Store Redux - MD Studio
// Estado global do editor visual + projeto
// -------------------------------------------------
export const store = configureStore({
  reducer: {
    project: projectReducer,   // tela atual, metadados do projeto
    editor: editorReducer,     // estado do editor (zoom, pan, tool)
    entities: entitiesReducer, // atores, triggers, backgrounds, tilesets
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora campos com canvas/buffers nao serializaveis
        ignoredActions: ['editor/setCanvasRef'],
        ignoredPaths: ['editor.canvasRef'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
