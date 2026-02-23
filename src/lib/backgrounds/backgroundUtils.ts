import { v4 as uuidv4 } from 'uuid';
import {
  Background,
  BackgroundTile,
  BackgroundTileEntry,
  BackgroundValidation,
  BGPalette,
  BGScrollConfig,
  BackgroundColorMode,
  MDBGPlane,
  MDPlaneDimensions,
  MD_BG_MAX_TILES,
  MD_BG_PALETTE_COUNT,
  MD_BG_PALETTE_SIZE,
  MD_BG_TILE_SIZE,
  MD_VRAM_TOTAL_TILES,
} from './backgroundTypes';

// ---- Factory functions ----

export const createDefaultPaletteColor = () => ({ r: 0, g: 0, b: 0 });

export const createDefaultPalette = (index: number): BGPalette => ({
  id: uuidv4(),
  name: `Palette ${index}`,
  colors: Array.from({ length: MD_BG_PALETTE_SIZE }, (_, i) =>
    i === 0
      ? { r: 0, g: 0, b: 0 }       // index 0 = transparent/black
      : { r: 34 * i, g: 34 * i, b: 34 * i }
  ),
});

export const createDefaultTile = (): BackgroundTile => ({
  id: uuidv4(),
  data: Array(MD_BG_TILE_SIZE * MD_BG_TILE_SIZE).fill(0),
});

export const createDefaultTileEntry = (): BackgroundTileEntry => ({
  tileIndex: 0,
  paletteIndex: 0,
  flipH: false,
  flipV: false,
  priority: false,
});

export const createDefaultScrollConfig = (): BGScrollConfig => ({
  scrollMode: 'full',
  scrollX: 0,
  scrollY: 0,
  hScrollEnabled: true,
  vScrollEnabled: true,
});

export const createDefaultBackground = (name = 'New Background'): Background => {
  const widthTiles = 64;
  const heightTiles = 32;
  const totalCells = widthTiles * heightTiles;

  return {
    id: uuidv4(),
    name,
    filename: '',
    width: widthTiles * MD_BG_TILE_SIZE,   // 512px
    height: heightTiles * MD_BG_TILE_SIZE, // 256px
    colorMode: 'automatic',
    plane: 'A',
    planeDimensions: { widthTiles: 64, heightTiles: 32 },
    tileMap: Array.from({ length: totalCells }, () => createDefaultTileEntry()),
    tiles: [createDefaultTile()],
    palettes: Array.from({ length: MD_BG_PALETTE_COUNT }, (_, i) =>
      createDefaultPalette(i)
    ),
    scroll: createDefaultScrollConfig(),
    hasMonoOverride: false,
    notes: '',
  };
};

// ---- Validation ----

/**
 * Validates a background against GB Studio rules adapted for Mega Drive.
 * GB Studio size rules: min 160x144, max 2040px, multiple of 8px.
 * Mega Drive: max 1024 unique BG tiles in VRAM (shared with sprites).
 */
export const validateBackground = (bg: Background): BackgroundValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Size: must be multiple of 8
  if (bg.width % MD_BG_TILE_SIZE !== 0) {
    errors.push(`Width (${bg.width}px) must be a multiple of ${MD_BG_TILE_SIZE}px.`);
  }
  if (bg.height % MD_BG_TILE_SIZE !== 0) {
    errors.push(`Height (${bg.height}px) must be a multiple of ${MD_BG_TILE_SIZE}px.`);
  }

  // GB Studio minimum size reference
  if (bg.width < 160) {
    warnings.push(`Width (${bg.width}px) is below GB Studio minimum of 160px.`);
  }
  if (bg.height < 144) {
    warnings.push(`Height (${bg.height}px) is below GB Studio minimum of 144px.`);
  }

  // GB Studio max size reference
  if (bg.width > 2040 || bg.height > 2040) {
    errors.push('Width and height must each be <= 2040px (GB Studio limit).');
  }

  // GB Studio area limit (width * height <= 1,048,320)
  if (bg.width * bg.height > 1_048_320) {
    errors.push(
      `Image area (${bg.width * bg.height}px) exceeds 1,048,320px limit.`
    );
  }

  // Tile count
  const uniqueTileCount = bg.tiles.length;
  if (uniqueTileCount > MD_BG_MAX_TILES) {
    errors.push(
      `Unique tile count (${uniqueTileCount}) exceeds MD VRAM budget of ${MD_BG_MAX_TILES} BG tiles.`
    );
  }
  if (uniqueTileCount > 384) {
    warnings.push(
      `Unique tile count (${uniqueTileCount}) exceeds GB Studio color-only limit of 384.`
    );
  } else if (uniqueTileCount > 192) {
    warnings.push(
      `Unique tile count (${uniqueTileCount}) exceeds GB Studio mono limit of 192 - requires Color Only mode.`
    );
  }

  // Palette count
  const paletteCount = bg.palettes.length;
  if (paletteCount > MD_BG_PALETTE_COUNT) {
    errors.push(
      `Palette count (${paletteCount}) exceeds Mega Drive limit of ${MD_BG_PALETTE_COUNT}.`
    );
  }

  // VRAM usage (each tile = 32 bytes = 8x8px x 4bpp)
  const vramBytes = uniqueTileCount * 32;
  if (vramBytes > MD_VRAM_TOTAL_TILES * 32) {
    errors.push(`VRAM usage (${vramBytes} bytes) exceeds total VRAM capacity.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    uniqueTileCount,
    paletteCount,
    vramBytes,
  };
};

// ---- Redux action helpers ----

export const updateBackground = (payload: {
  id: string;
  changes: Partial<Background>;
}) => ({
  type: 'backgrounds/updateBackground' as const,
  payload,
});

export const updateBackgroundTile = (payload: {
  backgroundId: string;
  tileIndex: number;
  changes: Partial<BackgroundTile>;
}) => ({
  type: 'backgrounds/updateBackgroundTile' as const,
  payload,
});

export const updateTileMapEntry = (payload: {
  backgroundId: string;
  cellIndex: number;
  changes: Partial<BackgroundTileEntry>;
}) => ({
  type: 'backgrounds/updateTileMapEntry' as const,
  payload,
});

// ---- Selectors ----

export const getBackgroundById = (
  state: { project: { present: { backgrounds: { entities: Record<string, Background> } } } },
  id: string
): Background | undefined =>
  state.project.present.backgrounds.entities[id];

export const getAllBackgrounds = (
  state: { project: { present: { backgrounds: { ids: string[]; entities: Record<string, Background> } } } }
): Background[] =>
  state.project.present.backgrounds.ids.map(
    (id) => state.project.present.backgrounds.entities[id]
  );

// ---- Utility helpers ----

/** Returns width in tiles */
export const getWidthInTiles = (bg: Background): number =>
  Math.floor(bg.width / MD_BG_TILE_SIZE);

/** Returns height in tiles */
export const getHeightInTiles = (bg: Background): number =>
  Math.floor(bg.height / MD_BG_TILE_SIZE);

/** Returns VRAM bytes used by this background's tiles */
export const getVRAMBytes = (bg: Background): number => bg.tiles.length * 32;

/** Checks if a background filename has a mono override */
export const getMonoOverrideFilename = (filename: string): string => {
  if (!filename) return '';
  const ext = filename.lastIndexOf('.');
  const base = ext >= 0 ? filename.slice(0, ext) : filename;
  return `${base}.mono.png`;
};

/** Checks if the background size is valid (multiple of 8, within bounds) */
export const isValidSize = (width: number, height: number): boolean => {
  if (width % MD_BG_TILE_SIZE !== 0 || height % MD_BG_TILE_SIZE !== 0) return false;
  if (width > 2040 || height > 2040) return false;
  if (width * height > 1_048_320) return false;
  return true;
};

/** Returns label string for plane dimensions */
export const getPlaneDimensionLabel = (dims: MDPlaneDimensions): string =>
  `${dims.widthTiles}x${dims.heightTiles} tiles (${dims.widthTiles * 8}x${dims.heightTiles * 8}px)`;
