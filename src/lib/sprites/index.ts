// Sprites module - SGDK/Mega Drive adaptation of GB Studio sprites
// Mega Drive sprite hardware: up to 80 sprites per screen, 4x4 tiles max (32x32px)
// VRAM: 64KB total, sprites share space with backgrounds

// Types
export type {
  SpriteSheet,
  SpriteAnimation,
  SpriteAnimationType,
  SpriteFrame,
  SpriteTile,
  SpritePalette,
  SpritePaletteColor,
  SpriteState,
} from './spriteTypes';

export {
  SPRITE_ANIMATION_TYPES,
  SPRITE_ANIMATION_TYPE_LABELS,
  MD_MAX_SPRITES_PER_SCREEN,
  MD_MAX_SPRITE_TILES,
  MD_VRAM_SIZE,
  MD_TILE_BYTES,
  MD_PALETTE_SIZE,
  MD_PALETTE_COUNT,
} from './spriteTypes';

// Utils
export {
  createDefaultSpriteSheet,
  createDefaultAnimation,
  createDefaultFrame,
  createDefaultTile,
  createDefaultPalette,
  updateSpriteSheet,
  updateSpriteAnimation,
  updateSpriteFrame,
  updateSpriteTile,
  calculateVRAMUsage,
  canAddSprite,
  getSpriteSheetById,
  getAllSpriteSheets,
} from './spriteUtils';

// Components
export { default as SpriteEditor } from './SpriteEditor';
export { default as SpriteAnimationEditor } from './SpriteAnimationEditor';
export { default as SpriteFrameEditor } from './SpriteFrameEditor';
export { default as SpriteTileEditor } from './SpriteTileEditor';
