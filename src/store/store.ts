// -------------------------------------------------------
// store.ts - Re-exporta store configurado via index.ts
// Alias para compatibilidade com imports: '../store/store'
// -------------------------------------------------------
export { store } from './index';
export type { RootState, AppDispatch } from './index';
