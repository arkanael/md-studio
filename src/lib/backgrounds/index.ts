// Backgrounds module - SGDK/Mega Drive adaptation of GB Studio Backgrounds
// Docs reference: https://www.gbstudio.dev/docs/assets/backgrounds
//
// GB Studio rules preserved:
//   - PNG files in assets/backgrounds/
//   - Manual palette: 4-color (#071821, #306850, #86c06c, #e0f8cf)
//   - Automatic palette: each 8x8 tile max 4 colors, max 8 unique 4-color palettes per scene
//   - Size: multiple of 8px, min 160x144, max 2040px, area <= 1,048,320
//   - Mono mode: max 192 unique tiles; Color Only: max 384 unique tiles
//   - Monochrome override: filename.mono.png
//
// Mega Drive adaptations:
//   - VDP planes: Plane A (foreground), Plane B (background), Window (HUD)
//   - Plane sizes: 32/64/128 tiles wide x 32/64/128 tiles tall (8px each)
//   - VRAM: 2048 total tiles, ~1024 budgeted for BG (rest for sprites)
//   - 4 palettes x 16 colors (4bpp), total CRAM = 64 colors
//   - Tile entry flags: flipH, flipV, priority (above sprites), paletteIndex
//   - Scroll modes: full screen / per tile / per line (raster effects)

// ---- Types ----
export type {
  Background,
  BackgroundColorMode,
  BackgroundTile,
  BackgroundTileEntry,
  BackgroundValidation,
  BGPalette,
  BGPaletteColor,
  BGScrollConfig,
  MDBGPlane,
  MDPlaneDimensions,
  BackgroundState,
} from './backgroundTypes';

export {
  MD_BG_TILE_SIZE,
  MD_SCREEN_WIDTH_H32,
  MD_SCREEN_WIDTH_H40,
  MD_SCREEN_HEIGHT_V28,
  MD_SCREEN_HEIGHT_V30,
  MD_PLANE_WIDTHS_TILES,
  MD_PLANE_HEIGHTS_TILES,
  MD_VRAM_TOTAL_TILES,
  MD_BG_MAX_TILES,
  MD_BG_PALETTE_COUNT,
  MD_BG_PALETTE_SIZE,
  MD_BG_PLANES,
  GB_BG_MAX_TILES_MONO,
  GB_BG_MAX_TILES_COLOR,
} from './backgroundTypes';

// ---- Utils ----
export {
  createDefaultBackground,
  createDefaultTile,
  createDefaultTileEntry,
  createDefaultPalette,
  createDefaultScrollConfig,
  validateBackground,
  updateBackground,
  updateBackgroundTile,
  updateTileMapEntry,
  getBackgroundById,
  getAllBackgrounds,
  getWidthInTiles,
  getHeightInTiles,
  getVRAMBytes,
  getMonoOverrideFilename,
  isValidSize,
  getPlaneDimensionLabel,
} from './backgroundUtils';

// ---- Components ----
export { default as BackgroundEditor } from './BackgroundEditor';
export { default as BackgroundPreview } from './BackgroundPreview';
export { default as BackgroundTileEditor } from './BackgroundTileEditor';
