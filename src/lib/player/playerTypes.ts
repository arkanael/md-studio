import { SceneType } from '../scenes/sceneTypes';

// Player facing direction (adapted for Mega Drive 8-direction support)
export type PlayerDirection = 'up' | 'down' | 'left' | 'right';

// Player start position in the game world
export interface PlayerStartPosition {
  sceneId: string;          // ID of the scene where player starts
  x: number;               // Tile X position within the scene
  y: number;               // Tile Y position within the scene
  direction: PlayerDirection; // Initial facing direction
}

// Default sprite sheet per scene type
export interface SceneTypeDefaultSprite {
  sceneType: SceneType;
  spriteSheetId: string;    // ID referencing the sprite asset
}

// Player visibility state
export type PlayerVisibility = 'visible' | 'hidden';

// Player movement speed (tiles per frame, adapted for SGDK)
export type PlayerMoveSpeed = 1 | 2 | 3 | 4;

// Player animation speed
export type PlayerAnimSpeed = 1 | 2 | 3 | 4 | 8;

// Core player settings stored in the project
export interface PlayerSettings {
  startPosition: PlayerStartPosition;
  defaultSprites: SceneTypeDefaultSprite[]; // One entry per scene type
  moveSpeed: PlayerMoveSpeed;
  animSpeed: PlayerAnimSpeed;
}

// Player state at runtime (not persisted, used in game logic)
export interface PlayerState {
  sceneId: string;
  x: number;
  y: number;
  direction: PlayerDirection;
  visibility: PlayerVisibility;
  spriteSheetId: string;    // Current sprite (can change mid-scene via script)
  moveSpeed: PlayerMoveSpeed;
  animSpeed: PlayerAnimSpeed;
}

// Default player settings factory
export const createDefaultPlayerSettings = (): PlayerSettings => ({
  startPosition: {
    sceneId: '',
    x: 0,
    y: 0,
    direction: 'down',
  },
  defaultSprites: [],
  moveSpeed: 1,
  animSpeed: 4,
});
