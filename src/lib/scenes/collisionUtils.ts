// ============================================================
// MD Studio - collisionUtils.ts
// Utilitarios de edicao de colisoes:
// - Slope Brush (rampas por arraste)
// - Magic Brush (pinta todos os tiles identicos)
// - Ctrl+drag para colisoes direcionais
// - Geracao de array C para SGDK
// Referencia: https://www.gbstudio.dev/docs/project-editor/scenes/collisions
// ============================================================

import {
  COLLISION_FLAG,
  hasCollisionFlag,
  addCollisionFlag,
  removeCollisionFlag,
} from './collisionTypes';

// ---------------------------
// Tipos auxiliares
// ---------------------------
export interface TileCoord {
  tx: number;
  ty: number;
}

// ---------------------------
// SLOPE BRUSH
// Gera uma linha de rampas entre dois tiles
// Seguindo o comportamento do GB Studio:
// - Arraste de esq p/ dir = SLOPE_UP
// - Arraste de dir p/ esq = SLOPE_DOWN
// - Com Shift: offset vertical da rampa
// - Com Ctrl: colisoes direcionais (Top/Bottom/Left/Right)
// ---------------------------

export interface SlopeBrushOptions {
  shiftKey?: boolean;  // offset vertical da rampa
  ctrlKey?: boolean;   // modo direcional (nao rampa)
  ctrlShiftKey?: boolean; // inverte direcao no modo direcional
}

/**
 * Calcula quais tiles e flags devem ser pintados pelo Slope Brush.
 * Retorna um mapa de { idx -> flags } para aplicar no array de colisoes.
 */
export function applySlopeBrush(
  startTile: TileCoord,
  endTile: TileCoord,
  sceneWidth: number,
  sceneHeight: number,
  options: SlopeBrushOptions = {}
): Map<number, number> {
  const result = new Map<number, number>();

  const { ctrlKey = false, ctrlShiftKey = false, shiftKey = false } = options;

  const dx = endTile.tx - startTile.tx;
  const dy = endTile.ty - startTile.ty;

  // --- Modo Ctrl: colisoes direcionais por direcao do arraste ---
  if (ctrlKey) {
    // Ctrl+drag: horizontal ou vertical
    if (Math.abs(dx) >= Math.abs(dy)) {
      // Arraste horizontal
      const flag = ctrlShiftKey
        ? (dx >= 0 ? COLLISION_FLAG.BOTTOM : COLLISION_FLAG.TOP)
        : (dx >= 0 ? COLLISION_FLAG.TOP    : COLLISION_FLAG.BOTTOM);
      const minX = Math.min(startTile.tx, endTile.tx);
      const maxX = Math.max(startTile.tx, endTile.tx);
      for (let tx = minX; tx <= maxX; tx++) {
        if (tx < 0 || tx >= sceneWidth) continue;
        const ty = startTile.ty;
        if (ty < 0 || ty >= sceneHeight) continue;
        result.set(ty * sceneWidth + tx, flag);
      }
    } else {
      // Arraste vertical
      const flag = ctrlShiftKey
        ? (dy >= 0 ? COLLISION_FLAG.LEFT  : COLLISION_FLAG.RIGHT)
        : (dy >= 0 ? COLLISION_FLAG.RIGHT : COLLISION_FLAG.LEFT);
      const minY = Math.min(startTile.ty, endTile.ty);
      const maxY = Math.max(startTile.ty, endTile.ty);
      for (let ty = minY; ty <= maxY; ty++) {
        if (ty < 0 || ty >= sceneHeight) continue;
        const tx = startTile.tx;
        if (tx < 0 || tx >= sceneWidth) continue;
        result.set(ty * sceneWidth + tx, flag);
      }
    }
    return result;
  }

  // --- Modo normal: slope por arraste diagonal ---
  // Determina direcao: esq->dir = SLOPE_UP, dir->esq = SLOPE_DOWN
  const slopeFlag = dx >= 0 ? COLLISION_FLAG.SLOPE_UP : COLLISION_FLAG.SLOPE_DOWN;

  const steps = Math.abs(dx);
  if (steps === 0) {
    // Arraste vertical sem movimento horizontal - cria solid
    const ty = startTile.ty;
    const tx = startTile.tx;
    if (tx >= 0 && tx < sceneWidth && ty >= 0 && ty < sceneHeight) {
      result.set(ty * sceneWidth + tx, COLLISION_FLAG.SOLID);
    }
    return result;
  }

  // Calcula a linha de tiles usando Bresenham simplificado
  const stepX = dx > 0 ? 1 : -1;
  const slopePerStep = dy / steps;

  for (let i = 0; i < steps; i++) {
    const tx = startTile.tx + i * stepX;
    let ty = Math.round(startTile.ty + i * slopePerStep);
    if (shiftKey) ty += 1; // Shift: offset vertical
    if (tx < 0 || tx >= sceneWidth) continue;
    if (ty < 0 || ty >= sceneHeight) continue;
    result.set(ty * sceneWidth + tx, slopeFlag);
  }

  return result;
}

// ---------------------------
// MAGIC BRUSH
// Seleciona todos os tiles com os mesmos flags e aplica
// os novos flags de uma vez (flood-fill por valor)
// Referencia: GB Studio Magic Brush
// ---------------------------

/**
 * Aplica o Magic Brush: pinta TODOS os tiles que possuem exatamente
 * os mesmos flags do tile clicado com os novos flags fornecidos.
 * Retorna o novo array de colisoes.
 */
export function applyMagicBrush(
  collisions: number[],
  clickedIdx: number,
  newFlags: number
): number[] {
  const targetFlags = collisions[clickedIdx];
  return collisions.map((tile) =>
    tile === targetFlags ? newFlags : tile
  );
}

// ---------------------------
// PENCIL / ERASER simples
// ---------------------------

/**
 * Aplica o pencil: adiciona flags ao tile no indice dado.
 */
export function applyPencil(
  collisions: number[],
  idx: number,
  flags: number
): number[] {
  const updated = [...collisions];
  updated[idx] = addCollisionFlag(updated[idx] ?? 0, flags);
  return updated;
}

/**
 * Aplica o eraser: remove todos os flags do tile no indice dado.
 */
export function applyEraser(
  collisions: number[],
  idx: number
): number[] {
  const updated = [...collisions];
  updated[idx] = 0;
  return updated;
}

/**
 * Aplica um mapa de { idx -> flags } ao array de colisoes.
 * Usado pelo Slope Brush apos calcular os tiles.
 */
export function applyCollisionMap(
  collisions: number[],
  map: Map<number, number>
): number[] {
  const updated = [...collisions];
  map.forEach((flags, idx) => {
    if (idx >= 0 && idx < updated.length) {
      updated[idx] = flags;
    }
  });
  return updated;
}

// ---------------------------
// GERACAO DE CODIGO SGDK
// Converte o array de colisoes para um array C
// ---------------------------

/**
 * Gera um array C uint8_t para uso no SGDK a partir
 * do array de colisoes do editor.
 * Cada valor e o bitmask de flags do tile.
 */
export function generateCollisionArrayC(
  sceneName: string,
  collisions: number[],
  width: number,
  height: number
): string {
  const rows: string[] = [];
  for (let ty = 0; ty < height; ty++) {
    const row: string[] = [];
    for (let tx = 0; tx < width; tx++) {
      const val = collisions[ty * width + tx] ?? 0;
      row.push(`0x${val.toString(16).padStart(2, '0')}`);
    }
    rows.push(`  /* row ${ty.toString().padStart(2)} */ ${row.join(', ')}`);
  }
  return [
    `// Mapa de colisoes: ${sceneName}`,
    `// ${width}x${height} tiles`,
    `// Bits: [0]=Top [1]=Bottom [2]=Left [3]=Right [4]=Ladder [5]=SlopeUp [6]=SlopeDown`,
    `const uint8_t collision_${sceneName}[${width * height}] = {`,
    rows.join(',\n'),
    `};`,
  ].join('\n');
}

/**
 * Cria um array de colisoes vazio (todos os tiles = 0)
 */
export function createEmptyCollisions(width: number, height: number): number[] {
  return new Array(width * height).fill(0);
}

/**
 * Conta quantos tiles de cada tipo existem no mapa
 */
export function countCollisionTypes(collisions: number[]): Record<string, number> {
  return {
    none:       collisions.filter((c) => c === 0).length,
    solid:      collisions.filter((c) => (c & COLLISION_FLAG.SOLID) === COLLISION_FLAG.SOLID).length,
    top:        collisions.filter((c) => hasCollisionFlag(c, COLLISION_FLAG.TOP) && !((c & COLLISION_FLAG.SOLID) === COLLISION_FLAG.SOLID)).length,
    bottom:     collisions.filter((c) => hasCollisionFlag(c, COLLISION_FLAG.BOTTOM) && !((c & COLLISION_FLAG.SOLID) === COLLISION_FLAG.SOLID)).length,
    left:       collisions.filter((c) => hasCollisionFlag(c, COLLISION_FLAG.LEFT) && !((c & COLLISION_FLAG.SOLID) === COLLISION_FLAG.SOLID)).length,
    right:      collisions.filter((c) => hasCollisionFlag(c, COLLISION_FLAG.RIGHT) && !((c & COLLISION_FLAG.SOLID) === COLLISION_FLAG.SOLID)).length,
    ladder:     collisions.filter((c) => hasCollisionFlag(c, COLLISION_FLAG.LADDER)).length,
    slope_up:   collisions.filter((c) => hasCollisionFlag(c, COLLISION_FLAG.SLOPE_UP)).length,
    slope_down: collisions.filter((c) => hasCollisionFlag(c, COLLISION_FLAG.SLOPE_DOWN)).length,
  };
}
