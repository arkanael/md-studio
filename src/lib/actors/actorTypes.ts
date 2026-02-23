import { SceneType } from '../scenes/sceneTypes';
import { PlayerDirection } from '../player/playerTypes';

// ─── Movement & Animation speeds ────────────────────────────────────────────
export type ActorMoveSpeed = 1 | 2 | 3 | 4;
export type ActorAnimSpeed = 1 | 2 | 3 | 4 | 8;

// ─── Collision group ─────────────────────────────────────────────────────────
// Mirrors GB Studio collision groups; used for On Hit scripting triggers.
export type CollisionGroup = 'none' | '1' | '2' | '3' | 'player';

// ─── Collision flags (scene-type-dependent) ──────────────────────────────────
// isSolid  : Platform + Adventure — blocks player walking through
// isPlatform : Platform only — player can stand on top but walk through
export interface ActorCollisionFlags {
  isSolid: boolean;
  isPlatform: boolean;
}

// ─── Script event hooks ───────────────────────────────────────────────────────
// Each hook holds an ordered list of script event IDs (resolved elsewhere).
export interface ActorScripts {
  onInteract: string[];  // Player faces actor + presses Interact
  onHit: string[];       // Collision with player/projectile (requires collisionGroup)
  onInit: string[];      // Scene load
  onUpdate: string[];    // Repeated while actor is on screen
}

// ─── Pin-to-screen ────────────────────────────────────────────────────────────
// When pinned, actor stays at a fixed screen position as camera scrolls.
// Pinned actors do NOT produce actor-vs-actor collisions.
export interface PinnedPosition {
  screenX: number;  // px from left of 320x224 screen
  screenY: number;  // px from top
}

// ─── Core Actor entity ───────────────────────────────────────────────────────
export interface Actor {
  id: string;
  name: string;

  // World-space tile position (unpinned) OR screen-space px (pinned)
  x: number;
  y: number;

  // Initial facing direction
  direction: PlayerDirection;

  // Sprite asset
  spriteSheetId: string;

  // Movement & animation
  moveSpeed: ActorMoveSpeed;
  animSpeed: ActorAnimSpeed;

  // Pin to screen
  isPinned: boolean;
  pinnedPosition: PinnedPosition | null;

  // Collision
  collisionGroup: CollisionGroup;
  collisionFlags: ActorCollisionFlags;

  // Scripts
  scripts: ActorScripts;

  // Which scene this actor belongs to
  sceneId: string;

  // Which scene type (determines available collision flags)
  sceneType: SceneType;
}

// ─── Factory ─────────────────────────────────────────────────────────────────
export const createDefaultActor = (
  id: string,
  sceneId: string,
  sceneType: SceneType,
  x = 0,
  y = 0
): Actor => ({
  id,
  name: 'Actor',
  x,
  y,
  direction: 'down',
  spriteSheetId: '',
  moveSpeed: 1,
  animSpeed: 4,
  isPinned: false,
  pinnedPosition: null,
  collisionGroup: 'none',
  collisionFlags: { isSolid: false, isPlatform: false },
  scripts: { onInteract: [], onHit: [], onInit: [], onUpdate: [] },
  sceneId,
  sceneType,
});
