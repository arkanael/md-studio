// ============================================================
// MD Studio - entitiesTypes.ts
// Tipos das entidades do editor, adaptados do GB Studio
// para o hardware do Sega Mega Drive / SGDK
// ============================================================

import type { MDSceneType } from '../../../lib/scenes/sceneTypes';

// ---------------------------
// Constantes do Mega Drive
// ---------------------------
export const MD_SCREEN_WIDTH = 320;
export const MD_SCREEN_HEIGHT = 224;
export const MD_TILE_SIZE = 8;
export const MD_TILES_X = 40;
export const MD_TILES_Y = 28;
export const MD_MAX_SPRITES = 80;
export const MD_PALETTE_COLORS = 16;
export const MD_NUM_PALETTES = 4;
export const MD_MAX_PLANES = 2;

// ---------------------------
// IDs
// ---------------------------
export type EntityId = string;

// ---------------------------
// Posicao
// ---------------------------
export interface Position { x: number; y: number; }
export interface PixelPosition { x: number; y: number; }

// ---------------------------
// Direcao do ator
// ---------------------------
export type ActorDirection = 'down' | 'up' | 'left' | 'right';

// ---------------------------
// Paleta
// ---------------------------
export interface MDPalette {
  id: EntityId;
  name: string;
  colors: string[];
}

// ---------------------------
// Colisao
// ---------------------------
export type CollisionTileType =
  | 'none' | 'solid' | 'top' | 'bottom'
  | 'left' | 'right' | 'ladder'
  | 'slope_up' | 'slope_down';

export interface CollisionTile {
  x: number; y: number; type: CollisionTileType;
}

// ---------------------------
// Sprite
// ---------------------------
export interface MDSprite {
  id: EntityId;
  name: string;
  filename: string;
  width: number;
  height: number;
  paletteId: EntityId;
  animationFrames: number;
  animations: MDAnimation[];
}

export interface MDAnimation {
  id: EntityId;
  name: string;
  frames: number[];
  speed: number;
  loop: boolean;
}

// ---------------------------
// Ator
// ---------------------------
export interface MDActor {
  id: EntityId;
  name: string;
  x: number;
  y: number;
  spriteId: EntityId;
  direction: ActorDirection;
  moveSpeed: number;
  animSpeed: number;
  paletteId: EntityId;
  collisionGroup: string;
  isPersistent: boolean;
  script: MDScriptEvent[];
  startScript: MDScriptEvent[];
  updateScript: MDScriptEvent[];
  hitScript: MDScriptEvent[];
}

// ---------------------------
// Trigger
// ---------------------------
export interface MDTrigger {
  id: EntityId;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  script: MDScriptEvent[];       // OnEnter
  leaveScript: MDScriptEvent[];  // OnLeave
}

// ---------------------------
// Background
// ---------------------------
export interface MDBackground {
  id: EntityId;
  name: string;
  filename: string;
  width: number;
  height: number;
  paletteIds: EntityId[];
  tileData: number[];
  plane: 'A' | 'B';
}

// ---------------------------
// Configs por tipo de cena
// ---------------------------

export interface MDSceneTopDownSettings {
  gridSize: 8 | 16;
  allowDiagonal: boolean;
}

export interface MDScenePlatformerSettings {
  gravity: number;
  jumpForce: number;
  maxFallSpeed: number;
  runEnabled: boolean;
  doubleJumpEnabled: boolean;
  wallJumpEnabled: boolean;
  floatEnabled: boolean;
  dashEnabled: boolean;
  laddersEnabled: boolean;
  scrollDirection: 'horizontal' | 'vertical';
}

export interface MDSceneAdventureSettings {
  movementType: 'free' | '4way' | 'horizontal_only';
  runEnabled: boolean;
  dashEnabled: boolean;
  pushEnabled: boolean;
}

export interface MDSceneShmupSettings {
  scrollDirection: 'horizontal' | 'vertical';
  autoScroll: boolean;
  scrollSpeed: number;
  lockPlayerToEdge: boolean;
  playerBulletSpeed: number;
}

export interface MDScenePointAndClickSettings {
  cursorSpriteId?: EntityId;
  cursorSpeed: number;
}

export type MDSceneTypeSettings =
  | MDSceneTopDownSettings
  | MDScenePlatformerSettings
  | MDSceneAdventureSettings
  | MDSceneShmupSettings
  | MDScenePointAndClickSettings
  | null;

// ---------------------------
// Cena
// ---------------------------
export interface MDScene {
  id: EntityId;
  name: string;
  type: MDSceneType;
  typeSettings: MDSceneTypeSettings;
  backgroundId: EntityId;
  width: number;
  height: number;
  paletteIds: EntityId[];
  actors: MDActor[];
  triggers: MDTrigger[];
  collisions: CollisionTile[];
  playerStartX: number;
  playerStartY: number;
  playerStartDirection: ActorDirection;
  script: MDScriptEvent[];
  playerHitScript: MDScriptEvent[];
  musicId?: EntityId;
  scrollX: boolean;
  scrollY: boolean;
  planeAId?: EntityId;
  planeBId?: EntityId;
}

// ---------------------------
// Script Event
// ---------------------------
export interface MDScriptEvent {
  id: EntityId;
  command: string;
  args: Record<string, unknown>;
  children?: Record<string, MDScriptEvent[]>;
}

// ---------------------------
// Variavel
// ---------------------------
export interface MDVariable {
  id: EntityId;
  name: string;
  defaultValue: number;
  isGlobal: boolean;
}

// ---------------------------
// Musica (XGM/VGM para SGDK)
// ---------------------------
export interface MDMusic {
  id: EntityId;
  name: string;
  filename: string;
  type: 'xgm' | 'vgm';
}

// ---------------------------
// Efeito Sonoro
// ---------------------------
export interface MDSoundEffect {
  id: EntityId;
  name: string;
  filename: string;
  type: 'pcm' | 'wav';
}

// ---------------------------
// Projeto
// ---------------------------
export interface MDProject {
  name: string;
  version: string;
  targetSystem: 'megadrive';
  videoMode: 'NTSC' | 'PAL';
  startSceneId: EntityId;
  startX: number;
  startY: number;
  startDirection: ActorDirection;
  scenes: MDScene[];
  backgrounds: MDBackground[];
  sprites: MDSprite[];
  palettes: MDPalette[];
  variables: MDVariable[];
  music: MDMusic[];
  soundEffects: MDSoundEffect[];
  settings: MDProjectSettings;
}

// ---------------------------
// Configuracoes do projeto
// ---------------------------
export interface MDProjectSettings {
  customColors: boolean;
  windowPaletteId?: EntityId;
  playerSpriteId: EntityId;
  defaultPlayerPaletteId: EntityId;
  sgdkPath: string;
  outputPath: string;
  maxActorsPerScene: number;
  maxTriggersPerScene: number;
}
