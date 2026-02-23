// sceneLimitsUtils.ts
// Utilitarios de validacao de limites de cena - MD Studio
// Calcula uso atual, verifica limites, gera warnings
// Equivalente ao sistema de Scene Limits do GB Studio
// adaptado para hardware Mega Drive / SGDK

import type { MDSceneType } from './sceneTypes';
import type { MDSceneUsage, MDSceneLimits, LimitCheck, LimitStatus, MDResolutionMode } from './sceneLimits';
import {
  getMDSceneLimits,
  LIMIT_WARNING_THRESHOLD,
  MD_ACTORS_MAX_VISIBLE,
  MD_SPRITES_MAX_SCANLINE,
  MD_BYTES_PER_TILE,
  MD_VRAM_TOTAL_BYTES,
  MD_USER_TILES_DEFAULT,
} from './sceneLimits';

// ==================================================
// Calcula o status de um limite (ok / warning / error)
// ==================================================

export function getLimitStatus(current: number, max: number): LimitStatus {
  if (current >= max) return 'error';
  if (current / max >= LIMIT_WARNING_THRESHOLD) return 'warning';
  return 'ok';
}

// ==================================================
// Verifica todos os limites de uma cena
// Retorna array de LimitCheck para exibir na UI
// ==================================================

export function checkSceneLimits(
  usage: MDSceneUsage,
  limits: MDSceneLimits,
): LimitCheck[] {
  const checks: LimitCheck[] = [];

  // --- Atores ---
  const actorStatus = getLimitStatus(usage.actorsCount, limits.actorsMax);
  checks.push({
    label: 'A',
    current: usage.actorsCount,
    max: limits.actorsMax,
    status: actorStatus,
    message:
      actorStatus === 'error'
        ? `Limite de atores excedido! Max: ${limits.actorsMax}. Sprites extras ficam invisiveis.`
        : actorStatus === 'warning'
        ? `Aproximando do limite de atores (${usage.actorsCount}/${limits.actorsMax}).`
        : undefined,
  });

  // --- Tiles de sprite (VRAM) ---
  const spriteTileStatus = getLimitStatus(usage.spriteTilesCount, limits.spriteTilesMax);
  checks.push({
    label: 'S',
    current: usage.spriteTilesCount,
    max: limits.spriteTilesMax,
    status: spriteTileStatus,
    message:
      spriteTileStatus === 'error'
        ? `VRAM de sprites excedida! ${usage.spriteTilesCount}/${limits.spriteTilesMax} tiles. Sprites extras nao serao exibidos.`
        : spriteTileStatus === 'warning'
        ? `VRAM de sprites quase cheia (${usage.spriteTilesCount}/${limits.spriteTilesMax} tiles).`
        : undefined,
  });

  // --- Triggers ---
  const triggerStatus = getLimitStatus(usage.triggersCount, limits.triggersMax);
  checks.push({
    label: 'T',
    current: usage.triggersCount,
    max: limits.triggersMax,
    status: triggerStatus,
    message:
      triggerStatus === 'error'
        ? `Limite de triggers excedido! Max: ${limits.triggersMax}.`
        : triggerStatus === 'warning'
        ? `Muitos triggers (${usage.triggersCount}/${limits.triggersMax}).`
        : undefined,
  });

  // --- Tiles de background ---
  const bgTileStatus = getLimitStatus(usage.bgTilesCount, limits.bgTilesMax);
  checks.push({
    label: 'BG',
    current: usage.bgTilesCount,
    max: limits.bgTilesMax,
    status: bgTileStatus,
    message:
      bgTileStatus === 'error'
        ? `Tiles de background excedidos! ${usage.bgTilesCount}/${limits.bgTilesMax} tiles unicos. Background pode nao carregar corretamente.`
        : bgTileStatus === 'warning'
        ? `Tiles de background quase no limite (${usage.bgTilesCount}/${limits.bgTilesMax}).`
        : undefined,
  });

  // --- Paletas ---
  const paletteStatus = getLimitStatus(usage.palettesUsed, limits.palettesMax);
  checks.push({
    label: 'PAL',
    current: usage.palettesUsed,
    max: limits.palettesMax,
    status: paletteStatus,
    message:
      paletteStatus === 'error'
        ? `Paletas excedidas! Max: ${limits.palettesMax}. PAL3 e reservada para UI.`
        : undefined,
  });

  return checks;
}

// ==================================================
// Verifica se ha muitos atores na area visivel
// (equivalente ao aviso de 10 atores em 160x144 do GB)
// No MD: aviso se >10 atores em area 320x224
// ==================================================

export interface ActorDensityWarning {
  hasWarning: boolean;
  actorsInView: number;
  maxVisible: number;
  message: string;
}

export function checkActorDensity(
  actorsCount: number,
  maxVisible: number = MD_ACTORS_MAX_VISIBLE,
): ActorDensityWarning {
  const hasWarning = actorsCount > maxVisible;
  return {
    hasWarning,
    actorsInView: actorsCount,
    maxVisible,
    message: hasWarning
      ? `Mais de ${maxVisible} atores podem estar visiveis ao mesmo tempo na tela (320x224). Isso pode causar sprite overflow no VDP (max ${MD_SPRITES_MAX_SCANLINE} sprites por scanline).`
      : '',
  };
}

// ==================================================
// Calcula uso de VRAM em bytes
// ==================================================

export interface VRAMUsage {
  spriteTilesBytes: number;
  bgTilesBytes: number;
  totalUserBytes: number;
  totalUserTiles: number;
  availableBytes: number;
  availableTiles: number;
  percentUsed: number;
}

export function calculateVRAMUsage(
  spriteTiles: number,
  bgTiles: number,
): VRAMUsage {
  const spriteTilesBytes = spriteTiles * MD_BYTES_PER_TILE;
  const bgTilesBytes = bgTiles * MD_BYTES_PER_TILE;
  const totalUserTiles = spriteTiles + bgTiles;
  const totalUserBytes = totalUserTiles * MD_BYTES_PER_TILE;
  const maxUserBytes = MD_USER_TILES_DEFAULT * MD_BYTES_PER_TILE;
  const availableBytes = Math.max(0, maxUserBytes - totalUserBytes);
  const availableTiles = Math.floor(availableBytes / MD_BYTES_PER_TILE);
  const percentUsed = Math.min(100, Math.round((totalUserTiles / MD_USER_TILES_DEFAULT) * 100));

  return {
    spriteTilesBytes,
    bgTilesBytes,
    totalUserBytes,
    totalUserTiles,
    availableBytes,
    availableTiles,
    percentUsed,
  };
}

// ==================================================
// Gera string resumida no estilo GB Studio
// GB: 'A: 0/20 S: 0/96 T: 0/30'
// MD: 'A: 0/16 S: 0/256 BG: 0/1040 T: 0/32'
// ==================================================

export function formatLimitsBar(
  usage: MDSceneUsage,
  limits: MDSceneLimits,
): string {
  return (
    `A: ${usage.actorsCount}/${limits.actorsMax}` +
    ` S: ${usage.spriteTilesCount}/${limits.spriteTilesMax}` +
    ` BG: ${usage.bgTilesCount}/${limits.bgTilesMax}` +
    ` T: ${usage.triggersCount}/${limits.triggersMax}`
  );
}

// ==================================================
// Verifica se a cena esta acima de algum limite critico
// ==================================================

export function hasLimitErrors(checks: LimitCheck[]): boolean {
  return checks.some((c) => c.status === 'error');
}

export function hasLimitWarnings(checks: LimitCheck[]): boolean {
  return checks.some((c) => c.status === 'warning' || c.status === 'error');
}

export function getLimitMessages(checks: LimitCheck[]): string[] {
  return checks
    .filter((c) => c.message)
    .map((c) => c.message!);
}

// ==================================================
// Cria MDSceneUsage vazio (cena nova)
// ==================================================

export function createEmptySceneUsage(): MDSceneUsage {
  return {
    actorsCount: 0,
    triggersCount: 0,
    spriteTilesCount: 0,
    bgTilesCount: 0,
    palettesUsed: 1,
    priorityTilesCount: 0,
  };
}

// ==================================================
// Helper: calcula tiles estimados de sprite
// com base no numero de atores e tamanho medio do sprite
// ==================================================

export function estimateSpriteTiles(
  actorsCount: number,
  avgTilesPerActor = 4, // metasprite 2x2 tiles = 4 tiles
): number {
  return actorsCount * avgTilesPerActor;
}

// ==================================================
// Helper: tile count summary para exibir na status bar
// ==================================================

export interface SceneLimitsSummary {
  checks: LimitCheck[];
  hasErrors: boolean;
  hasWarnings: boolean;
  messages: string[];
  barText: string;
  vram: VRAMUsage;
  actorDensity: ActorDensityWarning;
}

export function getSceneLimitsSummary(
  usage: MDSceneUsage,
  sceneType: MDSceneType,
  resMode: MDResolutionMode = 'H40',
): SceneLimitsSummary {
  const limits = getMDSceneLimits(sceneType, resMode);
  const checks = checkSceneLimits(usage, limits);
  const vram = calculateVRAMUsage(usage.spriteTilesCount, usage.bgTilesCount);
  const actorDensity = checkActorDensity(usage.actorsCount, limits.actorsMaxVisible);

  return {
    checks,
    hasErrors: hasLimitErrors(checks),
    hasWarnings: hasLimitWarnings(checks),
    messages: getLimitMessages(checks),
    barText: formatLimitsBar(usage, limits),
    vram,
    actorDensity,
  };
}
