// colorTypes.ts
// Tipos para o sistema de cores/paletas do MD Studio
// Adaptado do GB Studio Color Tool para SGDK/Mega Drive
// SGDK: paletas de 16 cores (4 bpp), 4 paletas por cena
// GB Color: 8 paletas de 4 cores - adaptamos para SGDK

// --------------------------------------------------
// Tipos de pincel de cor
// --------------------------------------------------
export type ColorBrushTool = 'pencil' | 'eraser' | 'magic';

// --------------------------------------------------
// Paleta SGDK - 4 paletas por cena, cada uma com 16 cores
// Paleta 0-2: tiles de fundo
// Paleta 3: reservada para UI/dialogo (como GB palette 8)
// --------------------------------------------------
export const MAX_SCENE_PALETTES = 4;
export const SGDK_COLORS_PER_PALETTE = 16;
export const DIALOGUE_PALETTE_INDEX = 3;

// --------------------------------------------------
// Tile priority flag - tiles com prioridade aparecem
// na frente dos sprites (como GB Color priority tiles)
// --------------------------------------------------
export const PRIORITY_FLAG = 0x8000;

// --------------------------------------------------
// Interface de uma paleta de cores SGDK
// --------------------------------------------------
export interface SGDKPalette {
  id: string;
  name: string;
  colors: string[]; // hex colors, 16 entries
}

// Paletas padrao para cenas SGDK
export const DEFAULT_PALETTES: SGDKPalette[] = [
  {
    id: 'pal0',
    name: 'Palette 0',
    colors: [
      '#000000', '#222222', '#444444', '#666666',
      '#888888', '#aaaaaa', '#cccccc', '#ffffff',
      '#550000', '#aa0000', '#ff0000', '#ff5500',
      '#ffaa00', '#ffff00', '#00aa00', '#0000aa',
    ],
  },
  {
    id: 'pal1',
    name: 'Palette 1',
    colors: [
      '#000000', '#001133', '#002266', '#003399',
      '#0044cc', '#0055ff', '#3377ff', '#55aaff',
      '#77ccff', '#aaeeff', '#ddf6ff', '#ffffff',
      '#ff8800', '#ffcc00', '#00cc44', '#884422',
    ],
  },
  {
    id: 'pal2',
    name: 'Palette 2',
    colors: [
      '#000000', '#110011', '#330033', '#550055',
      '#770077', '#990099', '#bb00bb', '#dd00dd',
      '#ff00ff', '#ff33ff', '#ff77ff', '#ffaaf0',
      '#ffd4ff', '#ffffff', '#003300', '#006600',
    ],
  },
  {
    id: 'pal3',
    name: 'Palette 3 (UI/Dialogue)',
    colors: [
      '#000000', '#111111', '#333333', '#555555',
      '#777777', '#999999', '#bbbbbb', '#dddddd',
      '#ffffff', '#0044aa', '#0088ff', '#00ccff',
      '#ff4400', '#ff8800', '#ffcc00', '#00aa44',
    ],
  },
];

// --------------------------------------------------
// Tile de cor - associa um tile (tx, ty) a uma paleta
// --------------------------------------------------
export interface ColorTile {
  tx: number;
  ty: number;
  paletteIndex: number; // 0-3 para SGDK
  priority: boolean;    // tile priority flag
}

// --------------------------------------------------
// Mapa de cores da cena: array de uint16
// bits 0-1: palette index (0-3)
// bit 15: priority flag
// valor 0 = sem cor definida (usa paleta 0)
// --------------------------------------------------
export type SceneColorMap = number[];

// --------------------------------------------------
// Utilitario: cria mapa de cores vazio
// --------------------------------------------------
export function createEmptyColorMap(width: number, height: number): SceneColorMap {
  return new Array(width * height).fill(0);
}

// --------------------------------------------------
// Utilitario: obtem palette index de um tile
// --------------------------------------------------
export function getPaletteIndex(colorValue: number): number {
  return colorValue & 0x03;
}

// --------------------------------------------------
// Utilitario: verifica se tile tem prioridade
// --------------------------------------------------
export function hasPriorityFlag(colorValue: number): boolean {
  return (colorValue & PRIORITY_FLAG) !== 0;
}

// --------------------------------------------------
// Utilitario: cria valor de tile com palette + priority
// --------------------------------------------------
export function makeColorTileValue(paletteIndex: number, priority: boolean): number {
  return (paletteIndex & 0x03) | (priority ? PRIORITY_FLAG : 0);
}

// --------------------------------------------------
// Cores visuais para cada paleta no editor
// --------------------------------------------------
export const PALETTE_EDITOR_COLORS: Record<string, string> = {
  pal0: '#e8a020',
  pal1: '#2080e8',
  pal2: '#c020e8',
  pal3: '#20c840',
};

export const PALETTE_LABELS: string[] = [
  'PAL0', 'PAL1', 'PAL2', 'PAL3 (UI)',
];

// --------------------------------------------------
// Tipo de modo de background (como GB: Manual / Automatic)
// --------------------------------------------------
export type BackgroundPaletteMode = 'manual' | 'automatic' | 'extract';

export interface ColorEditorState {
  activeTool: ColorBrushTool;
  selectedPalette: number; // 0-3
  showPriority: boolean;
  paletteMode: BackgroundPaletteMode;
}
