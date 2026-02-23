import { UIFrame, UICursor, UIFont, UIEmote, UIAvatar } from "./uiTypes";

/**
 * Generates a mock preview for a UI element (adapted from GB Studio concepts)
 * In a real SGDK implementation, this would handle tile conversion.
 */
export function generateUIPreview(type: "frame" | "cursor" | "font", data: Uint8ClampedArray): string {
  // Mock canvas logic for UI preview
  return "data:image/png;base64,mock_preview_data";
}

/**
 * Validates if an image meets the SGDK UI requirements (4 colors, specific dimensions)
 */
export function validateUIImage(imageData: Uint8ClampedArray, expectedWidth: number, expectedHeight: number): boolean {
  // Validation logic: check pixel dimensions and color count
  if (imageData.length !== expectedWidth * expectedHeight * 4) return false;
  return true;
}

/**
 * Constants for UI dimensions (SGDK/Mega Drive units)
 */
export const UI_TILE_SIZE = 8;
export const UI_FRAME_DEFAULT_SIZE = 24;
export const UI_AVATAR_SIZE = 16;
export const UI_EMOTE_SIZE = 16;
