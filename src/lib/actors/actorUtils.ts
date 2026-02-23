import {
  Actor,
  ActorMoveSpeed,
  ActorAnimSpeed,
  CollisionGroup,
  ActorCollisionFlags,
  PinnedPosition,
  ActorScripts,
  createDefaultActor,
} from './actorTypes';
import { SceneType } from '../scenes/sceneTypes';
import { PlayerDirection } from '../player/playerTypes';

// ─── CRUD helpers ────────────────────────────────────────────────────────────────

/** Add a newly-placed actor to the scene's actor list. */
export const addActor = (
  actors: Actor[],
  id: string,
  sceneId: string,
  sceneType: SceneType,
  x: number,
  y: number
): Actor[] => [...actors, createDefaultActor(id, sceneId, sceneType, x, y)];

/** Remove an actor by id. */
export const removeActor = (
  actors: Actor[],
  id: string
): Actor[] => actors.filter((a) => a.id !== id);

/** Generic field update — returns a new array with the patched actor. */
export const updateActor = (
  actors: Actor[],
  id: string,
  patch: Partial<Actor>
): Actor[] =>
  actors.map((a) => (a.id === id ? { ...a, ...patch } : a));

// ─── Position ──────────────────────────────────────────────────────────────────

/**
 * Move actor to a new tile coordinate (clamped to Mega Drive grid).
 * Mega Drive: 40 tiles wide x 28 tiles tall at 8x8 px.
 */
export const MEGA_DRIVE_TILE_COLS = 40;
export const MEGA_DRIVE_TILE_ROWS = 28;

export const moveActorToTile = (
  actors: Actor[],
  id: string,
  x: number,
  y: number
): Actor[] =>
  updateActor(actors, id, {
    x: Math.max(0, Math.min(x, MEGA_DRIVE_TILE_COLS - 1)),
    y: Math.max(0, Math.min(y, MEGA_DRIVE_TILE_ROWS - 1)),
  });

// ─── Pin to screen ───────────────────────────────────────────────────────────────

// Mega Drive native resolution
export const MD_SCREEN_WIDTH  = 320;
export const MD_SCREEN_HEIGHT = 224;

export const pinActorToScreen = (
  actors: Actor[],
  id: string,
  screenX: number,
  screenY: number
): Actor[] =>
  updateActor(actors, id, {
    isPinned: true,
    pinnedPosition: {
      screenX: Math.max(0, Math.min(screenX, MD_SCREEN_WIDTH)),
      screenY: Math.max(0, Math.min(screenY, MD_SCREEN_HEIGHT)),
    },
  });

export const unpinActor = (
  actors: Actor[],
  id: string
): Actor[] =>
  updateActor(actors, id, { isPinned: false, pinnedPosition: null });

// ─── Collision ───────────────────────────────────────────────────────────────────

export const setCollisionGroup = (
  actors: Actor[],
  id: string,
  collisionGroup: CollisionGroup
): Actor[] => updateActor(actors, id, { collisionGroup });

export const setCollisionFlags = (
  actors: Actor[],
  id: string,
  flags: Partial<ActorCollisionFlags>
): Actor[] =>
  updateActor(actors, id, {
    collisionFlags: {
      ...actors.find((a) => a.id === id)!.collisionFlags,
      ...flags,
    },
  });

/**
 * Returns which collision flags are applicable given the scene type.
 * isSolid    → Platform + Adventure
 * isPlatform → Platform only
 */
export const getAvailableCollisionFlags = (
  sceneType: SceneType
): (keyof ActorCollisionFlags)[] => {
  switch (sceneType) {
    case SceneType.Platformer:
      return ['isSolid', 'isPlatform'];
    case SceneType.Adventure:
      return ['isSolid'];
    default:
      return [];
  }
};

// ─── Scripts ─────────────────────────────────────────────────────────────────────

export const addScriptEvent = (
  actors: Actor[],
  id: string,
  hook: keyof ActorScripts,
  eventId: string
): Actor[] => {
  const actor = actors.find((a) => a.id === id);
  if (!actor) return actors;
  return updateActor(actors, id, {
    scripts: {
      ...actor.scripts,
      [hook]: [...actor.scripts[hook], eventId],
    },
  });
};

export const removeScriptEvent = (
  actors: Actor[],
  id: string,
  hook: keyof ActorScripts,
  eventId: string
): Actor[] => {
  const actor = actors.find((a) => a.id === id);
  if (!actor) return actors;
  return updateActor(actors, id, {
    scripts: {
      ...actor.scripts,
      [hook]: actor.scripts[hook].filter((e) => e !== eventId),
    },
  });
};

// ─── Query helpers ───────────────────────────────────────────────────────────────

export const getActorById = (
  actors: Actor[],
  id: string
): Actor | undefined => actors.find((a) => a.id === id);

export const getActorsByScene = (
  actors: Actor[],
  sceneId: string
): Actor[] => actors.filter((a) => a.sceneId === sceneId);

/** Returns true when the actor has an active collision group (i.e., On Hit can fire). */
export const hasCollisionGroup = (actor: Actor): boolean =>
  actor.collisionGroup !== 'none';

// Re-export factory
export { createDefaultActor };
