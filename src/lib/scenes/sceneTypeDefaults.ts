// ============================================================
// MD Studio - sceneTypeDefaults.ts
// Valores padrao de configuracao por tipo de cena
// Baseados nos comportamentos do GB Studio adaptados para SGDK
// ============================================================

import type { MDSceneType } from './sceneTypes';
import type {
  MDSceneTypeSettings,
  MDSceneTopDownSettings,
  MDScenePlatformerSettings,
  MDSceneAdventureSettings,
  MDSceneShmupSettings,
  MDScenePointAndClickSettings,
} from '../../store/features/entities/entitiesTypes';

// ---------------------------
// Defaults para Top Down 2D
// Grid 8px, sem diagonal (como GB Studio)
// ---------------------------
export const DEFAULT_TOPDOWN_SETTINGS: MDSceneTopDownSettings = {
  gridSize: 8,
  allowDiagonal: false,
};

// ---------------------------
// Defaults para Platformer
// Fisica basica proxima ao GB Studio
// ---------------------------
export const DEFAULT_PLATFORMER_SETTINGS: MDScenePlatformerSettings = {
  gravity: 0.25,
  jumpForce: 4.0,
  maxFallSpeed: 8.0,
  runEnabled: true,
  doubleJumpEnabled: false,
  wallJumpEnabled: false,
  floatEnabled: false,
  dashEnabled: false,
  laddersEnabled: false,
  scrollDirection: 'horizontal',
};

// ---------------------------
// Defaults para Adventure (Top-Down livre)
// Movimento livre, 4 direcoes
// ---------------------------
export const DEFAULT_ADVENTURE_SETTINGS: MDSceneAdventureSettings = {
  movementType: 'free',
  runEnabled: false,
  dashEnabled: false,
  pushEnabled: false,
};

// ---------------------------
// Defaults para Shoot Em Up
// Scroll horizontal automatico
// ---------------------------
export const DEFAULT_SHMUP_SETTINGS: MDSceneShmupSettings = {
  scrollDirection: 'horizontal',
  autoScroll: true,
  scrollSpeed: 1,
  lockPlayerToEdge: false,
  playerBulletSpeed: 8,
};

// ---------------------------
// Defaults para Point and Click
// ---------------------------
export const DEFAULT_POINT_AND_CLICK_SETTINGS: MDScenePointAndClickSettings = {
  cursorSpriteId: undefined,
  cursorSpeed: 2,
};

// ---------------------------
// Mapa de defaults por tipo
// ---------------------------
export const SCENE_TYPE_DEFAULTS: Record<MDSceneType, MDSceneTypeSettings> = {
  topdown: DEFAULT_TOPDOWN_SETTINGS,
  platformer: DEFAULT_PLATFORMER_SETTINGS,
  adventure: DEFAULT_ADVENTURE_SETTINGS,
  shmup: DEFAULT_SHMUP_SETTINGS,
  pointandclick: DEFAULT_POINT_AND_CLICK_SETTINGS,
  logo: null, // Logo nao tem configuracoes extras
};

/**
 * Retorna as configuracoes padrao para um tipo de cena.
 * Retorna null para o tipo 'logo'.
 */
export function getDefaultSceneTypeSettings(
  type: MDSceneType
): MDSceneTypeSettings {
  return SCENE_TYPE_DEFAULTS[type];
}

/**
 * Cria uma nova MDScene com valores padrao para o tipo fornecido.
 */
export function createDefaultSceneForType(
  id: string,
  name: string,
  type: MDSceneType
) {
  return {
    id,
    name,
    type,
    typeSettings: getDefaultSceneTypeSettings(type),
    backgroundId: '',
    width: 20,
    height: 18,
    paletteIds: [],
    actors: [],
    triggers: [],
    collisions: [],
    playerStartX: 0,
    playerStartY: 0,
    playerStartDirection: 'down' as const,
    script: [],
    playerHitScript: [],
    musicId: undefined,
    scrollX: type !== 'logo' && type !== 'pointandclick',
    scrollY: type === 'topdown' || type === 'adventure',
    planeAId: undefined,
    planeBId: undefined,
  };
}
