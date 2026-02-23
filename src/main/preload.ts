import { contextBridge, ipcRenderer } from 'electron';

// -------------------------------------------------
// preload.ts - Ponte segura entre renderer e main
// Expoe APIs do Node.js de forma controlada
// usando contextBridge para seguranca
// -------------------------------------------------

export type FileResult = { success: boolean; data?: string; error?: string };
export type WriteResult = { success: boolean; error?: string };

// API exposta para o renderer via window.mdStudio
const mdStudioAPI = {
  // --- Sistema de Arquivos ---
  readFile: (filePath: string): Promise<FileResult> =>
    ipcRenderer.invoke('fs:read-file', filePath),

  writeFile: (filePath: string, content: string): Promise<WriteResult> =>
    ipcRenderer.invoke('fs:write-file', filePath, content),

  // --- Dialogs ---
  openDialog: (options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue> =>
    ipcRenderer.invoke('dialog:open', options),

  saveDialog: (options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue> =>
    ipcRenderer.invoke('dialog:save', options),

  // --- Shell ---
  openExternal: (url: string): Promise<void> =>
    ipcRenderer.invoke('shell:open', url),

  // --- Menu Events ---
  onMenuEvent: (channel: string, callback: (...args: unknown[]) => void) => {
    const validChannels = [
      'menu:new-project',
      'menu:open-project',
      'menu:save-project',
      'menu:save-as',
      'menu:generate-code',
      'menu:export-sgdk',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },

  removeMenuListener: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // --- Projeto ---
  getAppVersion: (): string => process.env.npm_package_version || '0.1.0',
  getPlatform: (): string => process.platform,
};

// Expoe a API via contextBridge (seguro - sem expor ipcRenderer diretamente)
contextBridge.exposeInMainWorld('mdStudio', mdStudioAPI);

// Tipos TypeScript para o renderer
declare global {
  interface Window {
    mdStudio: typeof mdStudioAPI;
  }
}
