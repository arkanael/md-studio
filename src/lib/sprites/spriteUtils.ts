import {
  SpriteSheetData,
  SpriteAnimationState,
  SpriteFrame,
  SpriteTile,
  SpriteType,
  SpriteCanvasSize,
  SpriteCollisionBox,
  SpriteCanvasOrigin,
  SPRITE_DEFAULT_CANVAS_W,
  SPRITE_DEFAULT_CANVAS_H,
  SPRITE_MAX_CANVAS_PX,
  SPRITE_MIN_CANVAS_PX,
  SPRITE_TILE_SIZE,
} from './spriteTypes';

let spriteIdCounter = 0;
let stateIdCounter = 0;
let frameIdCounter = 0;
let tileIdCounter = 0;

// --- Default creators ---

export const createDefaultFrame = (): SpriteFrame => ({
  id: `frame_${Date.now()}_${frameIdCounter++}`,
  tiles: [],
});

export const createDefaultAnimationState = (
  name = 'default'
): SpriteAnimationState => ({
  id: `state_${Date.now()}_${stateIdCounter++}`,
  name,
  frames: [createDefaultFrame()],
  animSpeed: null,
  flipRightToLeft: false,
});

export const createSpriteSheet = (
  filename: string,
  name?: string,
  type: SpriteType = 'static'
): SpriteSheetData => ({
  id: `sprite_${Date.now()}_${spriteIdCounter++}`,
  name: name ?? filename.replace(/\.png$/i, ''),
  filename,
  type,
  canvasSize: { width: SPRITE_DEFAULT_CANVAS_W, height: SPRITE_DEFAULT_CANVAS_H },
  origin: { x: 0, y: SPRITE_DEFAULT_CANVAS_H },
  collisionBox: {
    x: 0,
    y: 0,
    width: SPRITE_DEFAULT_CANVAS_W,
    height: SPRITE_DEFAULT_CANVAS_H,
  },
  states: [createDefaultAnimationState()],
  palette: 0,
  notes: '',
});

// --- SpriteSheet CRUD ---

export const updateSpriteSheet = (
  sheets: SpriteSheetData[],
  id: string,
  changes: Partial<SpriteSheetData>
): SpriteSheetData[] =>
  sheets.map((s) => (s.id === id ? { ...s, ...changes } : s));

export const removeSpriteSheet = (
  sheets: SpriteSheetData[],
  id: string
): SpriteSheetData[] => sheets.filter((s) => s.id !== id);

export const getSpriteById = (
  sheets: SpriteSheetData[],
  id: string
): SpriteSheetData | undefined => sheets.find((s) => s.id === id);

// --- Animation State CRUD ---

export const addAnimationState = (
  sprite: SpriteSheetData,
  name: string
): SpriteSheetData => ({
  ...sprite,
  states: [...sprite.states, createDefaultAnimationState(name)],
});

export const updateAnimationState = (
  sprite: SpriteSheetData,
  stateId: string,
  changes: Partial<SpriteAnimationState>
): SpriteSheetData => ({
  ...sprite,
  states: sprite.states.map((s) =>
    s.id === stateId ? { ...s, ...changes } : s
  ),
});

export const removeAnimationState = (
  sprite: SpriteSheetData,
  stateId: string
): SpriteSheetData => ({
  ...sprite,
  states:
    sprite.states.length > 1
      ? sprite.states.filter((s) => s.id !== stateId)
      : sprite.states, // always keep at least one state
});

export const getAnimationStateById = (
  sprite: SpriteSheetData,
  stateId: string
): SpriteAnimationState | undefined =>
  sprite.states.find((s) => s.id === stateId);

// --- Frame CRUD ---

export const addFrame = (
  sprite: SpriteSheetData,
  stateId: string
): SpriteSheetData => ({
  ...sprite,
  states: sprite.states.map((s) =>
    s.id === stateId
      ? { ...s, frames: [...s.frames, createDefaultFrame()] }
      : s
  ),
});

export const removeFrame = (
  sprite: SpriteSheetData,
  stateId: string,
  frameId: string
): SpriteSheetData => ({
  ...sprite,
  states: sprite.states.map((s) => {
    if (s.id !== stateId) return s;
    const frames =
      s.frames.length > 1
        ? s.frames.filter((f) => f.id !== frameId)
        : s.frames;
    return { ...s, frames };
  }),
});

export const reorderFrames = (
  sprite: SpriteSheetData,
  stateId: string,
  fromIndex: number,
  toIndex: number
): SpriteSheetData => ({
  ...sprite,
  states: sprite.states.map((s) => {
    if (s.id !== stateId) return s;
    const frames = [...s.frames];
    const [moved] = frames.splice(fromIndex, 1);
    frames.splice(toIndex, 0, moved);
    return { ...s, frames };
  }),
});

// --- Tile CRUD ---

export const addTile = (
  sprite: SpriteSheetData,
  stateId: string,
  frameId: string,
  tile: Omit<SpriteTile, 'id'>
): SpriteSheetData => ({
  ...sprite,
  states: sprite.states.map((s) =>
    s.id !== stateId
      ? s
      : {
          ...s,
          frames: s.frames.map((f) =>
            f.id !== frameId
              ? f
              : {
                  ...f,
                  tiles: [
                    ...f.tiles,
                    { ...tile, id: `tile_${Date.now()}_${tileIdCounter++}` },
                  ],
                }
          ),
        }
  ),
});

export const removeTile = (
  sprite: SpriteSheetData,
  stateId: string,
  frameId: string,
  tileId: string
): SpriteSheetData => ({
  ...sprite,
  states: sprite.states.map((s) =>
    s.id !== stateId
      ? s
      : {
          ...s,
          frames: s.frames.map((f) =>
            f.id !== frameId
              ? f
              : { ...f, tiles: f.tiles.filter((t) => t.id !== tileId) }
          ),
        }
  ),
});

export const updateTile = (
  sprite: SpriteSheetData,
  stateId: string,
  frameId: string,
  tileId: string,
  changes: Partial<SpriteTile>
): SpriteSheetData => ({
  ...sprite,
  states: sprite.states.map((s) =>
    s.id !== stateId
      ? s
      : {
          ...s,
          frames: s.frames.map((f) =>
            f.id !== frameId
              ? f
              : {
                  ...f,
                  tiles: f.tiles.map((t) =>
                    t.id === tileId ? { ...t, ...changes } : t
                  ),
                }
          ),
        }
  ),
});

// --- Canvas helpers ---

export const snapToTileGrid = (value: number): number =>
  Math.round(value / SPRITE_TILE_SIZE) * SPRITE_TILE_SIZE;

export const clampCanvasSize = (size: number): number =>
  Math.max(
    SPRITE_MIN_CANVAS_PX,
    Math.min(SPRITE_MAX_CANVAS_PX, snapToTileGrid(size))
  );

export const validateCanvasSize = (
  w: number,
  h: number
): SpriteCanvasSize => ({
  width: clampCanvasSize(w),
  height: clampCanvasSize(h),
});

// Count total unique tiles used by a sprite (for scene VRAM budget)
export const countUniqueTiles = (sprite: SpriteSheetData): number => {
  const seen = new Set<string>();
  for (const state of sprite.states) {
    for (const frame of state.frames) {
      for (const tile of frame.tiles) {
        seen.add(`${tile.tileX},${tile.tileY}`);
      }
    }
  }
  return seen.size;
};

// Get expected frame count for a sprite type
export const getExpectedFrameCount = (type: SpriteType): number => {
  switch (type) {
    case 'static': return 1;
    case 'animated': return -1; // variable
    case 'actor': return 3;
    case 'actor_animated': return 6;
    case 'platformer_player': return -1;
    default: return 1;
  }
};

// Get default animation state names for a sprite type
export const getDefaultStateNames = (type: SpriteType): string[] => {
  switch (type) {
    case 'platformer_player':
      return ['idle', 'run', 'jump', 'climb'];
    case 'actor':
    case 'actor_animated':
      return ['default'];
    default:
      return ['default'];
  }
};
