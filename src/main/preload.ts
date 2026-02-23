import { contextBridge, ipcRenderer } from 'electron';

// -----------------------------------------------
// preload.ts - Ponte segura entre renderer e main
// Expoe APIs do Node.js de forma controlada
// usando contextBridge para seguranca
// -----------------------------------------------

export type FileResult = { success: boolean; data?: string; error?: string };
export type WriteResult = { success: boolean; error?: string };

// API exposta para o renderer via window.mdStudio
const mdStudioAPI = {
  // --- Sistema de Arquivos ---
  readFile: (filePath: string): Promise<FileResult> =>
    ipcRenderer.invoke('fs:readFile', filePath),

  writeFile: (filePath: string, content: string): Promise<WriteResult> =>
    ipcRenderer.invoke('fs:writeFile', filePath, content),

  // --- Dialogo de Arquivos (Getting Started) ---

  // Seleciona uma pasta para salvar o projeto
  selectDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('dialog:selectDirectory'),

  // Abre um projeto existente (retorna path do .mdsproj)
  openProject: (): Promise<{ filePath: string; name: string } | null> =>
    ipcRenderer.invoke('dialog:openProject'),

  // Salva projeto atual
  saveProject: (filePath: string, data: object): Promise<WriteResult> =>
    ipcRenderer.invoke('project:save', filePath, data),

  // --- Compilador SGDK ---

  // Dispara compilacao SGDK e retorna output
  compileSGDK: (projectPath: string): Promise<{ success: boolean; output: string; error?: string }> =>
    ipcRenderer.invoke('sgdk:compile', projectPath),

  // Abre emulador com a ROM gerada
  runEmulator: (romPath: string): Promise<WriteResult> =>
    ipcRenderer.invoke('sgdk:runEmulator', romPath),

  // --- Sistema (info do app) ---
  getAppVersion: (): Promise<string> =>
    ipcRenderer.invoke('app:getVersion'),

  // --- Eventos do menu Electron ---
  onMenuNewProject: (callback: () => void) => {
    ipcRenderer.on('menu:newProject', callback);
    return () => ipcRenderer.removeListener('menu:newProject', callback);
  },

  onMenuOpenProject: (callback: () => void) => {
    ipcRenderer.on('menu:openProject', callback);
    return () => ipcRenderer.removeListener('menu:openProject', callback);
  },

  onMenuSaveProject: (callback: () => void) => {
    ipcRenderer.on('menu:saveProject', callback);
    return () => ipcRenderer.removeListener('menu:saveProject', callback);
  },
};

// Expoe como window.mdStudio
contextBridge.exposeInMainWorld('mdStudio', mdStudioAPI);

// Tipos globais para TypeScript no renderer
declare global {
  interface Window {
    mdStudio: typeof mdStudioAPI;
  }
}
