// sceneLimits.ts
// Limites de cena para MD Studio - Mega Drive / SGDK
// Adaptado do GB Studio Scene Limits para hardware real do Mega Drive
// Referencia GB Studio: https://www.gbstudio.dev/docs/project-editor/scenes/limits
// Referencia SGDK/VDP: https://segaretro.org/Sega_Mega_Drive/Technical_specifications

import type { MDSceneType } from './sceneTypes';

// ==================================================
// VRAM - 64KB total no Mega Drive VDP
// Mapeamento padrao SGDK:
//   0x0000 - 0x01FF : system tiles (16 tiles)
//   0x0200 - 0xAFFF : user tiles (1296 tiles disponíveis)
//   0xB000 - 0xBFFF : font tiles (96 tiles)
//   0xC000 - 0xDFFF : plane A name table
//   0xE000 - 0xEFFF : plane B name table
//   0xF000 - 0xF7FF : sprite table
//   0xF800 - 0xFFFF : window name table
// ==================================================

export const MD_VRAM_TOTAL_KB = 64;
export const MD_VRAM_TOTAL_BYTES = 65536;

// Tiles disponiveis para usuario (padrao SGDK)
export const MD_USER_TILES_DEFAULT = 1296;

// Tiles maximos se remapear VRAM (sem font/window)
export const MD_USER_TILES_MAX = 1448;

// Bytes por tile (8x8 pixels, 4bpp = 32 bytes)
export const MD_BYTES_PER_TILE = 32;

// ==================================================
// TELA - Mega Drive H40 mode (padrao)
// 40 x 28 tiles = 320 x 224 pixels
// ==================================================

export const MD_SCREEN_TILES_W = 40;
export const MD_SCREEN_TILES_H = 28;
export const MD_SCREEN_PX_W = 320;
export const MD_SCREEN_PX_H = 224;

// Espaco virtual de scroll (planes A e B)
export const MD_PLANE_TILES_W = 64; // max plane width em tiles
export const MD_PLANE_TILES_H = 32; // max plane height em tiles
export const MD_PLANE_MAX_PX_W = 512;
export const MD_PLANE_MAX_PX_H = 512;

// ==================================================
// SPRITES / ATORES
// VDP: max 80 sprites globais em H40 mode
// Max 20 sprites por scanline
// SGDK metasprite: recomendado max 16 atores por cena
// Aviso se mais de 10 atores na mesma area 320x224
// ==================================================

export const MD_SPRITES_MAX_GLOBAL = 80;
export const MD_SPRITES_MAX_SCANLINE = 20;

// Limite pratico de atores (metasprites SGDK)
// Equivalente ao limite de 20 do GB Studio, mas no MD
// recomendamos 16 por seguranca de performance
export const MD_ACTORS_MAX = 16;

// Limite de atores na area da tela (320x224) ao mesmo tempo
// Acima disso causa sprite overflow no VDP
export const MD_ACTORS_MAX_VISIBLE = 10;

// Tiles de sprite por ator (metasprite medio 2x2 = 4 tiles)
export const MD_SPRITE_TILES_DEFAULT = 4;

// ==================================================
// TRIGGERS
// Nao ha limite de hardware para triggers no MD
// Limitamos a 32 por performance de colisao em software
// (GB Studio usa 30, adicionamos 2 por flexibilidade)
// ==================================================

export const MD_TRIGGERS_MAX = 32;

// ==================================================
// PALETAS DE COR
// VDP: 4 paletas x 16 cores = 64 cores (61 usaveis)
// Cor 0 de cada paleta e transparente
// PAL3 reservado para UI/Dialogo (como GB palette 8)
// ==================================================

export const MD_PALETTES_TOTAL = 4;
export const MD_COLORS_PER_PALETTE = 16;
export const MD_COLORS_TRANSPARENT_PER_PAL = 1;
export const MD_USABLE_COLORS = 61; // (4 x 16) - 3 transparentes usaveis
export const MD_UI_PALETTE_INDEX = 3;

// ==================================================
// TILES DE BACKGROUND (planos A e B)
// Tiles do background sao compartilhados com sprites
// na VRAM do usuario
// ==================================================

// Tiles reservados para background por padrao SGDK
export const MD_BG_TILES_RESERVED = 512;

// Tiles de fundo da tela (40x28 = 1120 referencias unicas)
// Mas tiles unicos do charset do background
export const MD_BG_UNIQUE_TILES_MAX = MD_USER_TILES_DEFAULT;

// ==================================================
// MODOS DE RESOLUCAO
// ==================================================

export type MDResolutionMode = 'H32' | 'H40';

export interface MDResolutionInfo {
  mode: MDResolutionMode;
  screenTilesW: number;
  screenTilesH: number;
  screenPxW: number;
  screenPxH: number;
  spritesMaxGlobal: number;
  spritesMaxScanline: number;
}

export const MD_RESOLUTION_MODES: Record<MDResolutionMode, MDResolutionInfo> = {
  H32: {
    mode: 'H32',
    screenTilesW: 32,
    screenTilesH: 28,
    screenPxW: 256,
    screenPxH: 224,
    spritesMaxGlobal: 64,
    spritesMaxScanline: 16,
  },
  H40: {
    mode: 'H40',
    screenTilesW: 40,
    screenTilesH: 28,
    screenPxW: 320,
    screenPxH: 224,
    spritesMaxGlobal: 80,
    spritesMaxScanline: 20,
  },
};

// ==================================================
// LIMITES POR TIPO DE CENA
// Cenas platformer podem ter menos atores visíveis
// pois sprites de plataforma sao maiores (ex: 2x4 tiles)
// ==================================================

export interface MDSceneLimits {
  actorsMax: number;           // max atores na cena
  actorsMaxVisible: number;    // max atores visiveis ao mesmo tempo
  triggersMax: number;         // max triggers
  spriteTilesMax: number;      // max tiles de sprite na VRAM
  bgTilesMax: number;          // max tiles de background unicos
  userTilesTotal: number;      // total de tiles de usuario na VRAM
  palettesMax: number;         // max paletas
  colorsPerPalette: number;    // cores por paleta
  screenTilesW: number;        // tiles na tela horizontalmente
  screenTilesH: number;        // tiles na tela verticalmente
  planeTilesW: number;         // largura do plano em tiles
  planeTilesH: number;         // altura do plano em tiles
}

export function getMDSceneLimits(
  sceneType: MDSceneType,
  resMode: MDResolutionMode = 'H40',
): MDSceneLimits {
  const res = MD_RESOLUTION_MODES[resMode];

  // Tiles de sprite reservados: depende do tipo de cena
  // Platformer: sprites maiores, menos atores praticos
  // Top-down: sprites menores, mais atores possiveis
  let actorsMax = MD_ACTORS_MAX;
  let actorsMaxVisible = MD_ACTORS_MAX_VISIBLE;
  let spriteTilesMax = 256; // tiles reservados para sprites na VRAM

  switch (sceneType) {
    case 'platformer':
      actorsMax = 12;         // sprites de platformer sao maiores (ex 2x4 = 8 tiles)
      actorsMaxVisible = 8;   // max visiveis sem overflow de scanline
      spriteTilesMax = 192;   // sprites maiores ocupam mais VRAM
      break;
    case 'shmup':
      actorsMax = 16;         // shmups usam sprites menores e mais numerosos
      actorsMaxVisible = 16;  // bullets etc.
      spriteTilesMax = 320;   // muitos sprites pequenos
      break;
    case 'adventure':
      actorsMax = 14;
      actorsMaxVisible = 10;
      spriteTilesMax = 224;
      break;
    case 'rpg':
      actorsMax = 12;
      actorsMaxVisible = 8;
      spriteTilesMax = 192;
      break;
    case 'topdown':
    default:
      actorsMax = MD_ACTORS_MAX;
      actorsMaxVisible = MD_ACTORS_MAX_VISIBLE;
      spriteTilesMax = 256;
      break;
  }

  const bgTilesMax = MD_USER_TILES_DEFAULT - spriteTilesMax;

  return {
    actorsMax,
    actorsMaxVisible,
    triggersMax: MD_TRIGGERS_MAX,
    spriteTilesMax,
    bgTilesMax,
    userTilesTotal: MD_USER_TILES_DEFAULT,
    palettesMax: MD_PALETTES_TOTAL,
    colorsPerPalette: MD_COLORS_PER_PALETTE,
    screenTilesW: res.screenTilesW,
    screenTilesH: res.screenTilesH,
    planeTilesW: MD_PLANE_TILES_W,
    planeTilesH: MD_PLANE_TILES_H,
  };
}

// ==================================================
// Interface para estado de uso atual de uma cena
// Equivalente ao A: 0/20 S: 0/96 T: 0/30 do GB Studio
// No MD: A: 0/16 S: 0/1296 T: 0/32
// ==================================================

export interface MDSceneUsage {
  actorsCount: number;
  triggersCount: number;
  spriteTilesCount: number;  // tiles de sprite em uso
  bgTilesCount: number;      // tiles de background unicos em uso
  palettesUsed: number;      // quantas paletas estao sendo usadas
  priorityTilesCount: number; // tiles com prioridade ativada
}

// ==================================================
// Status de limite: ok, warning, error
// ==================================================

export type LimitStatus = 'ok' | 'warning' | 'error';

export interface LimitCheck {
  label: string;         // ex: 'A' para actors
  current: number;
  max: number;
  status: LimitStatus;
  message?: string;
}

// Thresholds de aviso
export const LIMIT_WARNING_THRESHOLD = 0.8;  // 80% = warning
export const LIMIT_ERROR_THRESHOLD = 1.0;    // 100% = error (excedeu)
