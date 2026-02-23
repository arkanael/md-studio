import { app, BrowserWindow, ipcMain, dialog, shell, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// -------------------------------------------------
// main.ts - Processo principal Electron MD Studio
// Gerencia janela, menus, IPC, sistema de arquivos
// -------------------------------------------------

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'MD Studio - Mega Drive Game Creator',
    backgroundColor: '#1a1a2e',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // Icone do app
    // icon: path.join(__dirname, '../../assets/icon.png'),
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupMenu();
}

function setupMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Novo Projeto',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu:new-project'),
        },
        {
          label: 'Abrir Projeto...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow!, {
              title: 'Abrir Projeto MD Studio',
              filters: [{ name: 'MD Studio Project', extensions: ['mdstudio', 'json'] }],
              properties: ['openFile'],
            });
            if (!result.canceled && result.filePaths[0]) {
              mainWindow?.webContents.send('menu:open-project', result.filePaths[0]);
            }
          },
        },
        {
          label: 'Salvar Projeto',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu:save-project'),
        },
        {
          label: 'Salvar Como...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow!, {
              title: 'Salvar Projeto MD Studio',
              filters: [{ name: 'MD Studio Project', extensions: ['mdstudio'] }],
            });
            if (!result.canceled && result.filePath) {
              mainWindow?.webContents.send('menu:save-as', result.filePath);
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Gerar Codigo C (SGDK)',
          accelerator: 'CmdOrCtrl+G',
          click: () => mainWindow?.webContents.send('menu:generate-code'),
        },
        {
          label: 'Exportar para pasta SGDK...',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow!, {
              title: 'Selecionar pasta do projeto SGDK',
              properties: ['openDirectory'],
            });
            if (!result.canceled && result.filePaths[0]) {
              mainWindow?.webContents.send('menu:export-sgdk', result.filePaths[0]);
            }
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Sair' },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
      ],
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'forceReload', label: 'Forcar recarga' },
        { role: 'toggleDevTools', label: 'DevTools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom padrao' },
        { role: 'zoomIn', label: 'Zoom +' },
        { role: 'zoomOut', label: 'Zoom -' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela cheia' },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Documentacao SGDK',
          click: () => shell.openExternal('https://github.com/Stephane-D/SGDK'),
        },
        {
          label: 'GitHub MD Studio',
          click: () => shell.openExternal('https://github.com/arkanael/md-studio'),
        },
        { type: 'separator' },
        {
          label: 'Sobre MD Studio',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              title: 'MD Studio',
              message: 'MD Studio v0.1.0',
              detail: 'Editor visual de jogos para Sega Mega Drive\nBaseado no GB Studio, adaptado para SGDK\n\nDesenvolvido por FuturoOn',
              type: 'info',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers - Comunicacao renderer <-> main
ipcMain.handle('fs:read-file', async (_event, filePath: string) => {
  try {
    return { success: true, data: fs.readFileSync(filePath, 'utf-8') };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('fs:write-file', async (_event, filePath: string, content: string) => {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('dialog:open', async (_event, options: Electron.OpenDialogOptions) => {
  return dialog.showOpenDialog(mainWindow!, options);
});

ipcMain.handle('dialog:save', async (_event, options: Electron.SaveDialogOptions) => {
  return dialog.showSaveDialog(mainWindow!, options);
});

ipcMain.handle('shell:open', async (_event, url: string) => {
  shell.openExternal(url);
});

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
