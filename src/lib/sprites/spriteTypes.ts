// Sprite Types - SGDK/Mega Drive adaptation of GB Studio sprites
// Sprites are graphics used by actors/player in scenes

// SGDK Mega Drive sprite size options (in tiles, 1 tile = 8x8 px)
export type SpriteSizeH = 1 | 2 | 3 | 4; // height in tiles
export type SpriteSizeV = 1 | 2 | 3 | 4; // width in tiles

// GB Studio compatible sprite types adapted for MD
export type SpriteType =
  | 'static'         // single frame, no animation
  | 'animated'       // multiple frames, simple animation
  | 'actor'          // 3 direction frames (front/up/right, left auto-flipped)
  | 'actor_animated' // 6 frames: 2 per direction (full walk cycle)
  | 'platformer_player'; // platformer with idle/run/jump/climb states

export interface SpriteTile {
  id: string;
  x: number;        // tile x position in frame canvas
  y: number;        // tile y position in frame canvas
  tileX: number;    // source tile x in palette PNG
  tileY: number;    // source tile y in palette PNG
  flipH: boolean;
  flipV: boolean;
  priority: boolean; // render in front of background
}

export interface SpriteFrame {
  id: string;
  tiles: SpriteTile[];
}

export interface SpriteAnimationState {
  id: string;
  name: string;
  frames: SpriteFrame[];
  // Animation playback speed (frames per second)
  animSpeed: number | null; // null = no animation
  flipRightToLeft: boolean; // auto-flip right frames for left direction
}

export interface SpriteCanvasSize {
  width: number;  // in pixels (multiple of 8)
  height: number; // in pixels (multiple of 8)
}

export interface SpriteCollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpriteCanvasOrigin {
  x: number; // anchor point x (0,0 = top-left)
  y: number; // anchor point y
}

export interface SpriteSheetData {
  id: string;
  name: string;
  // Path to source PNG in assets/sprites/
  filename: string;
  type: SpriteType;
  canvasSize: SpriteCanvasSize;
  origin: SpriteCanvasOrigin;
  collisionBox: SpriteCollisionBox;
  // Animation states (at least one: 'default')
  states: SpriteAnimationState[];
  // SGDK: which hardware palette slot (PAL0-PAL3)
  palette: 0 | 1 | 2 | 3;
  notes?: string;
}

// SGDK Mega Drive limits
export const SPRITE_TILE_SIZE = 8;       // px per tile
export const SPRITE_MIN_CANVAS_PX = 8;
export const SPRITE_MAX_CANVAS_PX = 128; // 16 tiles max dimension
export const SPRITE_DEFAULT_CANVAS_W = 16;
export const SPRITE_DEFAULT_CANVAS_H = 16;
export const SPRITE_MAX_TILES_PER_SCENE = 512; // hardware VRAM limit

// Simple sprite frame layout constants (GB Studio compat)
export const SIMPLE_FRAME_WIDTH = 16;
export const SIMPLE_FRAME_HEIGHT = 16;
export const ACTOR_FRAMES = 3;          // front, up, right
export const ACTOR_ANIMATED_FRAMES = 6; // 2x front, 2x up, 2x right

export interface SpriteState {
  spriteSheets: SpriteSheetData[];
  selectedSpriteId: string | null;
  selectedStateId: string | null;
  selectedFrameId: string | null;
  showOnionSkin: boolean;
  showGrid: boolean;
  darkBackground: boolean;
  precisionMode: boolean;
}
