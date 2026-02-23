// ============================================================
// MD Studio - sceneTypeUtils.ts
// Utilitarios de geracao de codigo SGDK por tipo de cena
// Cada tipo de cena gera uma inicializacao diferente em C
// ============================================================

import type { MDScene } from '../../store/features/entities/entitiesTypes';
import type { MDSceneType } from './sceneTypes';
import type {
  MDScenePlatformerSettings,
  MDSceneAdventureSettings,
  MDSceneShmupSettings,
  MDSceneTopDownSettings,
  MDScenePointAndClickSettings,
} from '../../store/features/entities/entitiesTypes';

// ---------------------------
// Gera o bloco de init SGDK para TopDown 2D
// ---------------------------
function generateTopDownInit(scene: MDScene): string {
  const s = scene.typeSettings as MDSceneTopDownSettings | null;
  const gridSize = s?.gridSize ?? 8;
  const diagonal = s?.allowDiagonal ? 1 : 0;
  return [
    `  // Top Down 2D - grid ${gridSize}px`,
    `  MD_GRID_SIZE = ${gridSize};`,
    `  MD_ALLOW_DIAGONAL = ${diagonal};`,
    `  player_x = FIX16(${scene.playerStartX * gridSize});`,
    `  player_y = FIX16(${scene.playerStartY * gridSize});`,
    `  scene_scroll_x = 0;`,
    `  scene_scroll_y = 0;`,
  ].join('\n');
}

// ---------------------------
// Gera o bloco de init SGDK para Logo/Splash
// ---------------------------
function generateLogoInit(scene: MDScene): string {
  return [
    `  // Logo / Splash Screen - sem jogador`,
    `  VDP_clearPlane(BG_A, TRUE);`,
    `  VDP_clearPlane(BG_B, TRUE);`,
    `  // Carrega background complexo sem limite de tiles`,
    `  // BMP_init(TRUE, BG_A, PAL0, FALSE);`,
  ].join('\n');
}

// ---------------------------
// Gera o bloco de init SGDK para Platformer
// ---------------------------
function generatePlatformerInit(scene: MDScene): string {
  const s = scene.typeSettings as MDScenePlatformerSettings | null;
  const gravity = s?.gravity ?? 0.25;
  const jumpForce = s?.jumpForce ?? 4.0;
  const maxFall = s?.maxFallSpeed ?? 8.0;
  const scrollDir = s?.scrollDirection ?? 'horizontal';
  return [
    `  // Platformer - fisica side-scrolling`,
    `  phys_gravity = FIX16(${gravity});`,
    `  phys_jump_force = FIX16(${jumpForce});`,
    `  phys_max_fall_speed = FIX16(${maxFall});`,
    `  phys_double_jump = ${s?.doubleJumpEnabled ? 1 : 0};`,
    `  phys_wall_jump = ${s?.wallJumpEnabled ? 1 : 0};`,
    `  phys_float = ${s?.floatEnabled ? 1 : 0};`,
    `  phys_dash = ${s?.dashEnabled ? 1 : 0};`,
    `  phys_ladders = ${s?.laddersEnabled ? 1 : 0};`,
    `  scroll_direction = SCROLL_${scrollDir.toUpperCase()};`,
    `  player_x = FIX16(${scene.playerStartX * 8});`,
    `  player_y = FIX16(${scene.playerStartY * 8});`,
  ].join('\n');
}

// ---------------------------
// Gera o bloco de init SGDK para Adventure
// ---------------------------
function generateAdventureInit(scene: MDScene): string {
  const s = scene.typeSettings as MDSceneAdventureSettings | null;
  const moveType = s?.movementType ?? 'free';
  const moveFlag =
    moveType === 'free' ? 'MOVE_FREE' :
    moveType === '4way' ? 'MOVE_4WAY' :
    'MOVE_HORIZONTAL_ONLY';
  return [
    `  // Adventure - top-down livre`,
    `  player_move_type = ${moveFlag};`,
    `  player_run = ${s?.runEnabled ? 1 : 0};`,
    `  player_dash = ${s?.dashEnabled ? 1 : 0};`,
    `  player_push = ${s?.pushEnabled ? 1 : 0};`,
    `  player_x = FIX16(${scene.playerStartX * 8});`,
    `  player_y = FIX16(${scene.playerStartY * 8});`,
  ].join('\n');
}

// ---------------------------
// Gera o bloco de init SGDK para Point and Click
// ---------------------------
function generatePointAndClickInit(scene: MDScene): string {
  const s = scene.typeSettings as MDScenePointAndClickSettings | null;
  const cursorSpeed = s?.cursorSpeed ?? 2;
  return [
    `  // Point and Click - cursor`,
    `  cursor_speed = ${cursorSpeed};`,
    `  cursor_x = FIX16(${scene.playerStartX * 8});`,
    `  cursor_y = FIX16(${scene.playerStartY * 8});`,
    `  input_mode = INPUT_CURSOR;`,
  ].join('\n');
}

// ---------------------------
// Gera o bloco de init SGDK para Shoot Em Up
// ---------------------------
function generateShmupInit(scene: MDScene): string {
  const s = scene.typeSettings as MDSceneShmupSettings | null;
  const scrollDir = s?.scrollDirection ?? 'horizontal';
  const autoScroll = s?.autoScroll ? 1 : 0;
  const scrollSpeed = s?.scrollSpeed ?? 1;
  const lockEdge = s?.lockPlayerToEdge ? 1 : 0;
  const bulletSpeed = s?.playerBulletSpeed ?? 8;
  return [
    `  // Shoot Em Up - shooter`,
    `  shmup_scroll_dir = SCROLL_${scrollDir.toUpperCase()};`,
    `  shmup_auto_scroll = ${autoScroll};`,
    `  shmup_scroll_speed = FIX16(${scrollSpeed});`,
    `  shmup_lock_edge = ${lockEdge};`,
    `  shmup_bullet_speed = FIX16(${bulletSpeed});`,
    `  player_x = FIX16(${scene.playerStartX * 8});`,
    `  player_y = FIX16(${scene.playerStartY * 8});`,
  ].join('\n');
}

// ---------------------------
// Dispatcher principal
// ---------------------------
const SCENE_TYPE_GENERATORS: Record<
  MDSceneType,
  (scene: MDScene) => string
> = {
  topdown: generateTopDownInit,
  logo: generateLogoInit,
  platformer: generatePlatformerInit,
  adventure: generateAdventureInit,
  pointandclick: generatePointAndClickInit,
  shmup: generateShmupInit,
};

/**
 * Gera o bloco de inicializacao C (SGDK) para uma cena
 * de acordo com seu tipo.
 */
export function generateSceneTypeInitCode(scene: MDScene): string {
  const generator = SCENE_TYPE_GENERATORS[scene.type];
  if (!generator) {
    return `  // Tipo de cena desconhecido: ${scene.type}`;
  }
  return generator(scene);
}

/**
 * Gera o nome da funcao de update SGDK para o tipo de cena.
 * Cada tipo tem seu proprio loop de update.
 */
export function getSceneUpdateFunctionName(type: MDSceneType): string {
  const map: Record<MDSceneType, string> = {
    topdown: 'md_topdown_update',
    logo: 'md_logo_update',
    platformer: 'md_platformer_update',
    adventure: 'md_adventure_update',
    pointandclick: 'md_pointandclick_update',
    shmup: 'md_shmup_update',
  };
  return map[type];
}

/**
 * Gera comentario de cabecalho de cena para o arquivo C.
 */
export function generateSceneHeader(scene: MDScene): string {
  const info = [
    `// Cena: ${scene.name}`,
    `// Tipo: ${scene.type}`,
    `// Tamanho: ${scene.width}x${scene.height} tiles`,
    `// Player start: (${scene.playerStartX}, ${scene.playerStartY}) dir: ${scene.playerStartDirection}`,
  ];
  if (scene.scrollX) info.push(`// Scroll: Horizontal`);
  if (scene.scrollY) info.push(`// Scroll: Vertical`);
  if (scene.planeBId) info.push(`// Parallax: Plano B ativo`);
  return info.join('\n');
}
