// Player module — barrel exports
// Mirrors GB Studio's player feature module, adapted for Mega Drive / SGDK

// Types
export type {
  PlayerDirection,
  PlayerStartPosition,
  PlayerVisibility,
  PlayerMoveSpeed,
  PlayerAnimSpeed,
  PlayerSettings,
  PlayerState,
  SceneTypeDefaultSprite,
} from './playerTypes';

export { createDefaultPlayerSettings } from './playerTypes';

// Utilities
export {
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTION,
  keyToDirection,
  createPlayerState,
  movePlayer,
  setPlayerVisibility,
  setPlayerSpriteSheet,
  resetPlayerToSceneStart,
  getDefaultSpriteForSceneType,
  updateDefaultSpriteForSceneType,
  updatePlayerStartPosition,
} from './playerUtils';

// UI Components
export { default as PlayerStartPositionEditor } from './PlayerStartPositionEditor';
export { default as PlayerDefaultSpritesEditor } from './PlayerDefaultSpritesEditor';
export { default as PlayerWorldIcon } from './PlayerWorldIcon';
