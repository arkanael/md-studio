import {
  PlayerDirection,
  PlayerStartPosition,
  PlayerState,
  PlayerSettings,
  PlayerVisibility,
  createDefaultPlayerSettings,
} from './playerTypes';
import { SceneType } from '../scenes/sceneTypes';

// Direction helpers
export const DIRECTION_VECTORS: Record<PlayerDirection, { dx: number; dy: number }> = {
  up:    { dx:  0, dy: -1 },
  down:  { dx:  0, dy:  1 },
  left:  { dx: -1, dy:  0 },
  right: { dx:  1, dy:  0 },
};

// Opposite direction map (for bounce-back on collision)
export const OPPOSITE_DIRECTION: Record<PlayerDirection, PlayerDirection> = {
  up:    'down',
  down:  'up',
  left:  'right',
  right: 'left',
};

// Convert keyboard input to player direction
export const keyToDirection = (key: string): PlayerDirection | null => {
  switch (key) {
    case 'ArrowUp':    return 'up';
    case 'ArrowDown':  return 'down';
    case 'ArrowLeft':  return 'left';
    case 'ArrowRight': return 'right';
    default:           return null;
  }
};

// Create initial player state from settings
export const createPlayerState = (
  settings: PlayerSettings,
  sceneType: SceneType
): PlayerState => {
  const spriteEntry = settings.defaultSprites.find(
    (s) => s.sceneType === sceneType
  );
  return {
    sceneId:      settings.startPosition.sceneId,
    x:            settings.startPosition.x,
    y:            settings.startPosition.y,
    direction:    settings.startPosition.direction,
    visibility:   'visible' as PlayerVisibility,
    spriteSheetId: spriteEntry?.spriteSheetId ?? '',
    moveSpeed:    settings.moveSpeed,
    animSpeed:    settings.animSpeed,
  };
};

// Move player one step in a direction
export const movePlayer = (
  state: PlayerState,
  direction: PlayerDirection
): PlayerState => {
  const { dx, dy } = DIRECTION_VECTORS[direction];
  return {
    ...state,
    x:         state.x + dx * state.moveSpeed,
    y:         state.y + dy * state.moveSpeed,
    direction,
  };
};

// Toggle player visibility
export const setPlayerVisibility = (
  state: PlayerState,
  visibility: PlayerVisibility
): PlayerState => ({ ...state, visibility });

// Override sprite sheet mid-scene (only affects current scene)
export const setPlayerSpriteSheet = (
  state: PlayerState,
  spriteSheetId: string
): PlayerState => ({ ...state, spriteSheetId });

// Reset player to scene start (used when entering a new scene)
export const resetPlayerToSceneStart = (
  state: PlayerState,
  startPosition: PlayerStartPosition,
  spriteSheetId: string
): PlayerState => ({
  ...state,
  sceneId:      startPosition.sceneId,
  x:            startPosition.x,
  y:            startPosition.y,
  direction:    startPosition.direction,
  visibility:   'visible',  // always visible at scene start per GB Studio spec
  spriteSheetId,
});

// Get default sprite for a given scene type from settings
export const getDefaultSpriteForSceneType = (
  settings: PlayerSettings,
  sceneType: SceneType
): string => {
  const entry = settings.defaultSprites.find((s) => s.sceneType === sceneType);
  return entry?.spriteSheetId ?? '';
};

// Update the default sprite for a scene type (from Settings view)
export const updateDefaultSpriteForSceneType = (
  settings: PlayerSettings,
  sceneType: SceneType,
  spriteSheetId: string
): PlayerSettings => {
  const existing = settings.defaultSprites.findIndex(
    (s) => s.sceneType === sceneType
  );
  const defaultSprites =
    existing >= 0
      ? settings.defaultSprites.map((s, i) =>
          i === existing ? { ...s, spriteSheetId } : s
        )
      : [...settings.defaultSprites, { sceneType, spriteSheetId }];
  return { ...settings, defaultSprites };
};

// Update player start position (from drag or right-click in world view)
export const updatePlayerStartPosition = (
  settings: PlayerSettings,
  patch: Partial<PlayerStartPosition>
): PlayerSettings => ({
  ...settings,
  startPosition: { ...settings.startPosition, ...patch },
});

// Factory for fresh default settings
export { createDefaultPlayerSettings };
