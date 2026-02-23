// Background Types - SGDK/Mega Drive adaptation of GB Studio Backgrounds
// GB Studio: 160x144 min, 2040x2040 max, 8x8 tiles, 192 unique tiles (mono) / 384 (color)
// Mega Drive: 320x224 or 256x224 screen, Plane A/B each 64x32 or 128x32 tiles (8x8px)
// Mega Drive supports 2 scroll planes + 1 window plane, 2048 tiles in VRAM

// ---- Mega Drive hardware constants ----

/** Mega Drive tile size in pixels */
export const MD_BG_TILE_SIZE = 8;

/** Mega Drive standard screen widths */
export const MD_SCREEN_WIDTH_H32 = 256; // 32-cell horizontal mode
export const MD_SCREEN_WIDTH_H40 = 320; // 40-cell horizontal mode

/** Mega Drive standard screen heights */
export const MD_SCREEN_HEIGHT_V28 = 224; // 28-cell vertical mode
export const MD_SCREEN_HEIGHT_V30 = 240; // 30-cell vertical mode (PAL)

/** Plane dimensions in tiles (configurable via VDP) */
export const MD_PLANE_WIDTHS_TILES = [32, 64, 128] as const;
export const MD_PLANE_HEIGHTS_TILES = [32, 64, 128] as const;

/** Max unique tiles in VRAM (shared with sprites) */
export const MD_VRAM_TOTAL_TILES = 2048;

/** Max unique tiles available for backgrounds (leaving room for sprites) */
export const MD_BG_MAX_TILES = 1024;

/** GB Studio mono limit reference */
export const GB_BG_MAX_TILES_MONO = 192;
/** GB Studio color limit reference */
export const GB_BG_MAX_TILES_COLOR = 384;

/** Mega Drive palettes for backgrounds: 4 palettes x 16 colors (4bpp) */
export const MD_BG_PALETTE_COUNT = 4;
export const MD_BG_PALETTE_SIZE = 16;

/** Mega Drive background scroll planes */
export const MD_BG_PLANES = ['A', 'B', 'Window'] as const;
export type MDBGPlane = typeof MD_BG_PLANES[number];

/** Background color mode - how palettes are assigned */
export type BackgroundColorMode = 'manual' | 'automatic';

/** Plane size configuration */
export interface MDPlaneDimensions {
  widthTiles: 32 | 64 | 128;
  heightTiles: 32 | 64 | 128;
}

/** A single 8x8 tile entry in the plane map */
export interface BackgroundTileEntry {
  /** Index into VRAM tile table */
  tileIndex: number;
  /** Palette index (0-3) */
  paletteIndex: number;
  /** Horizontal flip flag */
  flipH: boolean;
  /** Vertical flip flag */
  flipV: boolean;
  /** Priority: true = in front of sprites */
  priority: boolean;
}

/** A tile definition (8x8 pixel data, 4bpp) */
export interface BackgroundTile {
  id: string;
  /** Pixel data: 64 entries, each 0-15 (palette color index) */
  data: number[];
}

/** A color palette entry in Mega Drive CRAM format */
export interface BGPaletteColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/** A background palette (16 colors) */
export interface BGPalette {
  id: string;
  name: string;
  colors: BGPaletteColor[];
}

/** Scroll configuration for a background plane */
export interface BGScrollConfig {
  /** Scroll mode: full-screen, per-tile, or per-line */
  scrollMode: 'full' | 'tile' | 'line';
  /** Horizontal scroll value (pixels) */
  scrollX: number;
  /** Vertical scroll value (pixels) */
  scrollY: number;
  /** Whether horizontal scroll is enabled */
  hScrollEnabled: boolean;
  /** Whether vertical scroll is enabled */
  vScrollEnabled: boolean;
}

/** A complete background asset (one plane) */
export interface Background {
  id: string;
  name: string;
  /** Source image filename (PNG) */
  filename: string;
  /** Width in pixels (must be multiple of 8) */
  width: number;
  /** Height in pixels (must be multiple of 8) */
  height: number;
  /** Color mode - manual (4-color GB palette) or automatic (full color) */
  colorMode: BackgroundColorMode;
  /** Which Mega Drive plane this background uses */
  plane: MDBGPlane;
  /** Plane dimensions in tiles */
  planeDimensions: MDPlaneDimensions;
  /** Tile map: array of tile entries for each cell */
  tileMap: BackgroundTileEntry[];
  /** Unique tiles referenced (VRAM entries) */
  tiles: BackgroundTile[];
  /** Palettes assigned to this background (up to 4) */
  palettes: BGPalette[];
  /** Scroll configuration */
  scroll: BGScrollConfig;
  /** Whether to provide a monochrome override image */
  hasMonoOverride: boolean;
  /** Notes / developer comments */
  notes: string;
}

/** Validation result for a background */
export interface BackgroundValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  uniqueTileCount: number;
  paletteCount: number;
  vramBytes: number;
}

/** Redux state slice for backgrounds */
export interface BackgroundState {
  ids: string[];
  entities: Record<string, Background>;
}
