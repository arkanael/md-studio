// ============================================================
// MD Studio - collisionTypes.ts
// Sistema de colisoes baseado no GB Studio, adaptado para SGDK
// Referencia: https://www.gbstudio.dev/docs/project-editor/scenes/collisions
// ============================================================
// O sistema usa bitmask por tile (uint8):
// Cada tile armazena um byte onde cada bit representa um flag
// de colisao. Isso permite combinacoes (ex: TOP + SLOPE_UP)
// ============================================================

import type { MDSceneType } from './sceneTypes';

// ---------------------------
// Bitmask flags de colisao
// Compativel com o sistema de collision tiles do GB Studio
// ---------------------------
export const COLLISION_FLAG = {
  NONE:         0x00, // sem colisao
  TOP:          0x01, // bloqueia entrada pelo topo
  BOTTOM:       0x02, // bloqueia entrada pela base
  LEFT:         0x04, // bloqueia entrada pela esquerda
  RIGHT:        0x08, // bloqueia entrada pela direita
  LADDER:       0x10, // escada (apenas platformer)
  SLOPE_UP:     0x20, // rampa subindo da esquerda para direita
  SLOPE_DOWN:   0x40, // rampa descendo da esquerda para direita
  SOLID:        0x0F, // TOP | BOTTOM | LEFT | RIGHT = bloqueio total
} as const;

export type CollisionFlag = typeof COLLISION_FLAG[keyof typeof COLLISION_FLAG];

// Valor maximo de um tile de colisao (todos os bits)
export const COLLISION_ALL = 0x7F;

// ---------------------------
// Tipos de ferramentas de pintura
// ---------------------------
export type CollisionBrushTool =
  | 'pencil'       // pincel - pinta tile a tile
  | 'slope'        // slope brush - arrastar para criar rampas
  | 'magic'        // magic brush - pinta todos os tiles iguais de uma vez
  | 'eraser';      // apagador - remove colisao do tile

// ---------------------------
// Definicao de cada tipo de tile de colisao
// para uso na toolbar e legenda
// ---------------------------
export interface CollisionTileDefinition {
  id: string;
  label: string;
  description: string;
  flags: number;           // bitmask de flags
  color: string;           // cor no editor (rgba)
  borderColor: string;     // cor da borda
  symbol: string;          // simbolo exibido no canvas
  sceneTypes: MDSceneType[] | 'all'; // quais tipos de cena suportam este tile
}

export const COLLISION_TILE_DEFINITIONS: CollisionTileDefinition[] = [
  {
    id: 'solid',
    label: 'Solid',
    description: 'Bloqueia a entrada do ator por qualquer lado.',
    flags: COLLISION_FLAG.SOLID,
    color: 'rgba(233, 69, 96, 0.55)',
    borderColor: 'rgba(233, 69, 96, 0.9)',
    symbol: 'S',
    sceneTypes: 'all',
  },
  {
    id: 'top',
    label: 'Top',
    description: 'Bloqueia entrada pelo topo. Util para plataformas one-way.',
    flags: COLLISION_FLAG.TOP,
    color: 'rgba(255, 165, 0, 0.45)',
    borderColor: 'rgba(255, 165, 0, 0.9)',
    symbol: 'T',
    sceneTypes: ['topdown', 'platformer', 'adventure', 'shmup'],
  },
  {
    id: 'bottom',
    label: 'Bottom',
    description: 'Bloqueia entrada pela base.',
    flags: COLLISION_FLAG.BOTTOM,
    color: 'rgba(255, 165, 0, 0.35)',
    borderColor: 'rgba(255, 165, 0, 0.7)',
    symbol: 'B',
    sceneTypes: ['topdown', 'platformer', 'adventure', 'shmup'],
  },
  {
    id: 'left',
    label: 'Left',
    description: 'Bloqueia entrada pela esquerda.',
    flags: COLLISION_FLAG.LEFT,
    color: 'rgba(100, 200, 255, 0.45)',
    borderColor: 'rgba(100, 200, 255, 0.9)',
    symbol: 'L',
    sceneTypes: ['topdown', 'platformer', 'adventure', 'shmup'],
  },
  {
    id: 'right',
    label: 'Right',
    description: 'Bloqueia entrada pela direita.',
    flags: COLLISION_FLAG.RIGHT,
    color: 'rgba(100, 200, 255, 0.35)',
    borderColor: 'rgba(100, 200, 255, 0.7)',
    symbol: 'R',
    sceneTypes: ['topdown', 'platformer', 'adventure', 'shmup'],
  },
  {
    id: 'ladder',
    label: 'Ladder',
    description: 'Permite subir e descer. Apenas em cenas Platformer.',
    flags: COLLISION_FLAG.LADDER,
    color: 'rgba(50, 205, 50, 0.5)',
    borderColor: 'rgba(50, 205, 50, 0.9)',
    symbol: 'E',
    sceneTypes: ['platformer'],
  },
  {
    id: 'slope_up',
    label: 'Slope Up',
    description: 'Rampa subindo (esq -> dir). Apenas em cenas Platformer.',
    flags: COLLISION_FLAG.SLOPE_UP,
    color: 'rgba(180, 100, 255, 0.5)',
    borderColor: 'rgba(180, 100, 255, 0.9)',
    symbol: '/',
    sceneTypes: ['platformer'],
  },
  {
    id: 'slope_down',
    label: 'Slope Down',
    description: 'Rampa descendo (esq -> dir). Apenas em cenas Platformer.',
    flags: COLLISION_FLAG.SLOPE_DOWN,
    color: 'rgba(220, 130, 255, 0.5)',
    borderColor: 'rgba(220, 130, 255, 0.9)',
    symbol: '\\',
    sceneTypes: ['platformer'],
  },
];

// ---------------------------
// Helpers
// ---------------------------

/** Retorna os tiles de colisao disponiveis para um tipo de cena */
export function getCollisionTilesForSceneType(
  sceneType: MDSceneType
): CollisionTileDefinition[] {
  return COLLISION_TILE_DEFINITIONS.filter(
    (def) =>
      def.sceneTypes === 'all' ||
      def.sceneTypes.includes(sceneType)
  );
}

/** Verifica se um tile tem um flag especifico */
export function hasCollisionFlag(tile: number, flag: number): boolean {
  return (tile & flag) !== 0;
}

/** Adiciona um flag a um tile */
export function addCollisionFlag(tile: number, flag: number): number {
  return tile | flag;
}

/** Remove um flag de um tile */
export function removeCollisionFlag(tile: number, flag: number): number {
  return tile & ~flag;
}

/** Verifica se o tile e completamente solido */
export function isSolid(tile: number): boolean {
  return (tile & COLLISION_FLAG.SOLID) === COLLISION_FLAG.SOLID;
}

/** Verifica se o tile e uma escada */
export function isLadder(tile: number): boolean {
  return hasCollisionFlag(tile, COLLISION_FLAG.LADDER);
}

/** Verifica se o tile e uma rampa */
export function isSlope(tile: number): boolean {
  return hasCollisionFlag(tile, COLLISION_FLAG.SLOPE_UP) ||
         hasCollisionFlag(tile, COLLISION_FLAG.SLOPE_DOWN);
}

/** Retorna a cor de preenchimento para um tile baseado em seus flags */
export function getCollisionColor(flags: number): string {
  if (flags === 0) return 'transparent';
  if (isLadder(flags)) return 'rgba(50, 205, 50, 0.5)';
  if (hasCollisionFlag(flags, COLLISION_FLAG.SLOPE_UP)) return 'rgba(180, 100, 255, 0.5)';
  if (hasCollisionFlag(flags, COLLISION_FLAG.SLOPE_DOWN)) return 'rgba(220, 130, 255, 0.5)';
  if (isSolid(flags)) return 'rgba(233, 69, 96, 0.55)';
  // Colisao direcional parcial
  return 'rgba(255, 165, 0, 0.45)';
}

/** Retorna o simbolo visual para um tile */
export function getCollisionSymbol(flags: number): string {
  if (flags === 0) return '';
  if (isLadder(flags)) return 'E';
  if (hasCollisionFlag(flags, COLLISION_FLAG.SLOPE_UP)) return '/';
  if (hasCollisionFlag(flags, COLLISION_FLAG.SLOPE_DOWN)) return '\\';
  if (isSolid(flags)) return 'S';
  // Direcional - mostra quais lados
  const parts: string[] = [];
  if (hasCollisionFlag(flags, COLLISION_FLAG.TOP))    parts.push('T');
  if (hasCollisionFlag(flags, COLLISION_FLAG.BOTTOM)) parts.push('B');
  if (hasCollisionFlag(flags, COLLISION_FLAG.LEFT))   parts.push('L');
  if (hasCollisionFlag(flags, COLLISION_FLAG.RIGHT))  parts.push('R');
  return parts.join('');
}
