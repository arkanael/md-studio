// colorUtils.ts
// Utilitarios para o sistema de cores/paletas do MD Studio
// Adaptado do GB Studio Color Tool para SGDK/Mega Drive
// Ferramentas: Pencil, Eraser, Magic Brush, Priority Brush

import {
  SceneColorMap,
  getPaletteIndex,
  hasPriorityFlag,
  makeColorTileValue,
  PRIORITY_FLAG,
} from './colorTypes';

// --------------------------------------------------
// Pencil - aplica palette a um unico tile
// --------------------------------------------------
export function applyColorPencil(
  colorMap: SceneColorMap,
  tileIdx: number,
  paletteIndex: number,
  keepPriority = false,
): SceneColorMap {
  const next = [...colorMap];
  const priority = keepPriority ? hasPriorityFlag(next[tileIdx] ?? 0) : false;
  next[tileIdx] = makeColorTileValue(paletteIndex, priority);
  return next;
}

// --------------------------------------------------
// Eraser - remove cor de um tile (volta a 0 / paleta 0)
// --------------------------------------------------
export function applyColorEraser(
  colorMap: SceneColorMap,
  tileIdx: number,
): SceneColorMap {
  const next = [...colorMap];
  next[tileIdx] = 0;
  return next;
}

// --------------------------------------------------
// Magic Brush - pinta todos os tiles com mesma palette
// index que o tile clicado (como GB Magic Brush)
// --------------------------------------------------
export function applyColorMagicBrush(
  colorMap: SceneColorMap,
  tileIdx: number,
  paletteIndex: number,
  keepPriority = false,
): SceneColorMap {
  const targetPalette = getPaletteIndex(colorMap[tileIdx] ?? 0);
  const next = colorMap.map((val, idx) => {
    if (getPaletteIndex(val) === targetPalette) {
      const priority = keepPriority ? hasPriorityFlag(val) : false;
      return makeColorTileValue(paletteIndex, priority);
    }
    return val;
  });
  return next;
}

// --------------------------------------------------
// Priority Brush - alterna o flag de prioridade de um tile
// Tiles com prioridade aparecem na frente dos sprites
// --------------------------------------------------
export function applyPriorityBrush(
  colorMap: SceneColorMap,
  tileIdx: number,
  enable: boolean,
): SceneColorMap {
  const next = [...colorMap];
  const current = next[tileIdx] ?? 0;
  const palIdx = getPaletteIndex(current);
  next[tileIdx] = makeColorTileValue(palIdx, enable);
  return next;
}

// --------------------------------------------------
// Preenche toda a cena com uma paleta
// --------------------------------------------------
export function fillSceneWithPalette(
  colorMap: SceneColorMap,
  paletteIndex: number,
): SceneColorMap {
  return colorMap.map((val) => {
    const priority = hasPriorityFlag(val);
    return makeColorTileValue(paletteIndex, priority);
  });
}

// --------------------------------------------------
// Flood fill por palette index (fill contiguous)
// Usa BFS para preencher tiles adjacentes com mesma paleta
// --------------------------------------------------
export function applyColorFloodFill(
  colorMap: SceneColorMap,
  startIdx: number,
  paletteIndex: number,
  width: number,
  height: number,
): SceneColorMap {
  const next = [...colorMap];
  const targetPalette = getPaletteIndex(next[startIdx] ?? 0);
  if (targetPalette === paletteIndex) return next;
  const visited = new Set<number>();
  const queue: number[] = [startIdx];
  while (queue.length > 0) {
    const idx = queue.shift()!;
    if (visited.has(idx)) continue;
    if (getPaletteIndex(next[idx] ?? 0) !== targetPalette) continue;
    visited.add(idx);
    const priority = hasPriorityFlag(next[idx] ?? 0);
    next[idx] = makeColorTileValue(paletteIndex, priority);
    const tx = idx % width;
    const ty = Math.floor(idx / width);
    if (tx > 0) queue.push(idx - 1);
    if (tx < width - 1) queue.push(idx + 1);
    if (ty > 0) queue.push(idx - width);
    if (ty < height - 1) queue.push(idx + width);
  }
  return next;
}

// --------------------------------------------------
// Extrai paletas automaticamente de uma imagem de fundo
// Retorna um mapa de cores gerado automaticamente
// NOTA: implementacao simplificada para SGDK
// Na versao completa, analisa as cores dos tiles da imagem
// --------------------------------------------------
export function extractPalettesFromBackground(
  width: number,
  height: number,
  defaultPalette = 0,
): SceneColorMap {
  // Cria mapa com palette 0 para todos os tiles
  // Na implementacao completa, analisa a imagem pixel por pixel
  return new Array(width * height).fill(makeColorTileValue(defaultPalette, false));
}

// --------------------------------------------------
// Verifica quantos tiles usam cada paleta
// Util para validar limites SGDK (max 4 paletas)
// --------------------------------------------------
export function countPaletteUsage(
  colorMap: SceneColorMap,
): Record<number, number> {
  const usage: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const val of colorMap) {
    const palIdx = getPaletteIndex(val);
    usage[palIdx] = (usage[palIdx] ?? 0) + 1;
  }
  return usage;
}

// --------------------------------------------------
// Conta tiles com flag de prioridade ativado
// --------------------------------------------------
export function countPriorityTiles(colorMap: SceneColorMap): number {
  return colorMap.filter((val) => hasPriorityFlag(val)).length;
}

// --------------------------------------------------
// Serializa o color map para um formato compacto
// uint16 array: bit0-1 = palette, bit15 = priority
// --------------------------------------------------
export function serializeColorMap(colorMap: SceneColorMap): Uint16Array {
  const arr = new Uint16Array(colorMap.length);
  for (let i = 0; i < colorMap.length; i++) {
    arr[i] = colorMap[i] & 0xffff;
  }
  return arr;
}

// --------------------------------------------------
// Desserializa do formato compacto
// --------------------------------------------------
export function deserializeColorMap(arr: Uint16Array): SceneColorMap {
  return Array.from(arr);
}
