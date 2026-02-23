// UI Elements types — MD Studio (adapted from GB Studio)
// Covers: frame.png, cursor.png, fonts, emotes, avatars
// Adapted for SGDK/Mega Drive (32x32 tiles, 4-color palettes)

// ─── SGDK UI color palette (4 colors per palette slot) ──────────────────────────
// GB Studio uses 4 fixed GB colors; MD Studio uses 4 of 16 palette colors
export const MD_UI_PALETTE = [
  '#000000', // color 0 - darkest
  '#555555', // color 1
  '#aaaaaa', // color 2
  '#ffffff', // color 3 - lightest
] as const;

export type MDUIColor = typeof MD_UI_PALETTE[number];

// ─── Frame (9-slice) ────────────────────────────────────────────────────────────────

export interface UIFrame {
  /** Pixel width of the frame image */
  width: number;
  /** Pixel height of the frame image */
  height: number;
  /**
   * 9-slice border thickness in pixels.
   * For GB Studio the frame is 24x24px with an 8px border.
   * For SGDK we use 8x8 tile units (multiples of 8).
   */
  borderSize: number;
  /** Raw pixel data as RGBA Uint8ClampedArray, or null if not loaded */
  imageData: Uint8ClampedArray | null;
  /** Data URL for preview */
  previewUrl: string | null;
}

/** Default 24x24 frame matching GB Studio layout */
export const DEFAULT_UI_FRAME: UIFrame = {
  width: 24,
  height: 24,
  borderSize: 8,
  imageData: null,
  previewUrl: null,
};

// ─── Cursor ─────────────────────────────────────────────────────────────────────

export interface UICursor {
  width: number;
  height: number;
  imageData: Uint8ClampedArray | null;
  previewUrl: string | null;
}

export const DEFAULT_UI_CURSOR: UICursor = {
  width: 8,
  height: 8,
  imageData: null,
  previewUrl: null,
};

// ─── Font ──────────────────────────────────────────────────────────────────────
// GB Studio stores fonts in assets/fonts as PNG spritesheets
// SGDK uses VDP tile-based text; we model the same concept

export interface UIFont {
  id: string;
  name: string;
  /** Width of each character tile in pixels (GB: 8) */
  charWidth: number;
  /** Height of each character tile in pixels (GB: 8) */
  charHeight: number;
  /** Number of characters per row in the spritesheet */
  charsPerRow: number;
  /** Total number of characters defined */
  totalChars: number;
  /** Mono (single palette) or variable-width */
  isVariableWidth: boolean;
  /** Source PNG file path relative to project */
  filePath: string | null;
  previewUrl: string | null;
}

export function createDefaultFont(id: string, name: string): UIFont {
  return {
    id,
    name,
    charWidth: 8,
    charHeight: 8,
    charsPerRow: 16,
    totalChars: 96,
    isVariableWidth: false,
    filePath: null,
    previewUrl: null,
  };
}

// ─── Emote ─────────────────────────────────────────────────────────────────────
// GB Studio: 16x16 px PNGs in assets/emotes
// SGDK: 2x2 tiles (16x16 px), same constraint

export interface UIEmote {
  id: string;
  name: string;
  /** Always 16 for GB Studio compat */
  width: 16;
  height: 16;
  filePath: string | null;
  previewUrl: string | null;
}

export function createEmote(id: string, name: string): UIEmote {
  return { id, name, width: 16, height: 16, filePath: null, previewUrl: null };
}

// ─── Avatar ────────────────────────────────────────────────────────────────────
// GB Studio: 16x16 px PNGs in assets/avatars

export interface UIAvatar {
  id: string;
  name: string;
  /** Always 16 for GB Studio compat */
  width: 16;
  height: 16;
  filePath: string | null;
  previewUrl: string | null;
}

export function createAvatar(id: string, name: string): UIAvatar {
  return { id, name, width: 16, height: 16, filePath: null, previewUrl: null };
}

// ─── Full UI Assets collection ────────────────────────────────────────────────

export interface UIAssets {
  frame: UIFrame;
  cursor: UICursor;
  fonts: UIFont[];
  emotes: UIEmote[];
  avatars: UIAvatar[];
}

export function createDefaultUIAssets(): UIAssets {
  return {
    frame: { ...DEFAULT_UI_FRAME },
    cursor: { ...DEFAULT_UI_CURSOR },
    fonts: [],
    emotes: [],
    avatars: [],
  };
}

// ─── Validation ──────────────────────────────────────────────────────────────

export interface UIValidationError {
  field: string;
  message: string;
}

export function validateUIFont(font: UIFont): UIValidationError[] {
  const errors: UIValidationError[] = [];
  if (!font.name.trim()) errors.push({ field: 'name', message: 'Font name is required' });
  if (font.charWidth < 1 || font.charWidth > 32)
    errors.push({ field: 'charWidth', message: 'Character width must be 1–32px' });
  if (font.charHeight < 1 || font.charHeight > 32)
    errors.push({ field: 'charHeight', message: 'Character height must be 1–32px' });
  if (font.charsPerRow < 1 || font.charsPerRow > 64)
    errors.push({ field: 'charsPerRow', message: 'Characters per row must be 1–64' });
  return errors;
}

export function validateUIEmote(emote: UIEmote): UIValidationError[] {
  const errors: UIValidationError[] = [];
  if (!emote.name.trim()) errors.push({ field: 'name', message: 'Emote name is required' });
  return errors;
}

export function validateUIAvatar(avatar: UIAvatar): UIValidationError[] {
  const errors: UIValidationError[] = [];
  if (!avatar.name.trim()) errors.push({ field: 'name', message: 'Avatar name is required' });
  return errors;
}
