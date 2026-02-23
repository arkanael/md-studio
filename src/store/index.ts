import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './features/editor/editorSlice';
import entitiesReducer from './features/entities/entitiesSlice';

// -------------------------------------------------
// Store Redux - MD Studio
// Estado global do editor visual
// -------------------------------------------------

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    entities: entitiesReducer,
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
