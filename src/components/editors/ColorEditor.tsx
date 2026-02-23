import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { updateScene } from '../../store/features/editor/editorSlice';
import type { ColorBrushTool, BackgroundPaletteMode, SceneColorMap } from '../../lib/scenes/colorTypes';
import {
  DEFAULT_PALETTES,
  DIALOGUE_PALETTE_INDEX,
  PALETTE_EDITOR_COLORS,
  hasPriorityFlag,
  getPaletteIndex,
  makeColorTileValue,
} from '../../lib/scenes/colorTypes';
import {
  applyColorPencil,
  applyColorEraser,
  applyColorMagicBrush,
  applyPriorityBrush,
  countPaletteUsage,
  countPriorityTiles,
} from '../../lib/scenes/colorUtils';
import { ColorToolbar } from './ColorToolbar';

// --------------------------------------------------
// ColorEditor - Editor canvas de cores/paletas
// Suporta: 4 paletas SGDK, priority tiles,
// Ferramentas: Pencil, Eraser, Magic Brush
// Modos: Manual, Automatico, Extrair Paletas
// uint16 por tile: bits 0-1 = palette, bit15 = priority
// --------------------------------------------------

const TILE_SIZE = 16;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  background: #111;
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  overflow: auto;
  cursor: crosshair;
  user-select: none;
`;

const Canvas = styled.canvas`
  display: block;
  image-rendering: pixelated;
`;

const StatsBar = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(13,13,26,0.9);
  border: 1px solid #333;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  color: #888;
  pointer-events: none;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 400px;
`;

const StatItem = styled.span<{ color?: string }>`
  color: ${(p) => p.color ?? '#888'};
`;

const PriorityBadge = styled.span`
  color: #c084fc;
  font-weight: bold;
`;

export interface ColorEditorProps {
  sceneId: string;
  width: number;
  height: number;
  colorMap: SceneColorMap;
  zoom?: number;
  onColorMapChange?: (newColorMap: SceneColorMap) => void;
}

const ColorEditor: React.FC<ColorEditorProps> = ({
  sceneId,
  width,
  height,
  colorMap,
  zoom = 1,
  onColorMapChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();

  // Estado do editor
  const [activeTool, setActiveTool] = useState<ColorBrushTool>('pencil');
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [showPriority, setShowPriority] = useState(false);
  const [paletteMode, setPaletteMode] = useState<BackgroundPaletteMode>('manual');
  const [isPainting, setIsPainting] = useState(false);

  const tileW = TILE_SIZE * zoom;
  const tileH = TILE_SIZE * zoom;
  const canvasW = width * tileW;
  const canvasH = height * tileH;

  // Cores visuais das paletas para o canvas
  const getPaletteDrawColor = (paletteIdx: number): string => {
    const palId = DEFAULT_PALETTES[paletteIdx]?.id ?? 'pal0';
    return PALETTE_EDITOR_COLORS[palId] ?? '#e8a020';
  };

  // Renderiza o canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasW, canvasH);

    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const idx = ty * width + tx;
        const x = tx * tileW;
        const y = ty * tileH;
        const val = colorMap[idx] ?? 0;
        const palIdx = getPaletteIndex(val);
        const priority = hasPriorityFlag(val);
        const hasColor = val !== 0;

        if (hasColor) {
          // Cor de fundo da paleta
          const baseColor = getPaletteDrawColor(palIdx);
          ctx.fillStyle = baseColor + '55'; // transparente
          ctx.fillRect(x, y, tileW, tileH);

          // Borda lateral colorida por paleta
          ctx.fillStyle = baseColor;
          ctx.fillRect(x, y, 3, tileH);

          // Label da paleta no canto superior
          ctx.fillStyle = baseColor;
          ctx.font = `bold ${Math.max(7, tileW * 0.35)}px monospace`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(`P${palIdx}`, x + 4, y + 2);
        }

        // Priority tile - borda superior roxa
        if (priority) {
          ctx.fillStyle = 'rgba(147, 51, 234, 0.9)';
          ctx.fillRect(x, y, tileW, 3);
          // Estrela indicadora
          ctx.fillStyle = '#c084fc';
          ctx.font = `${Math.max(7, tileW * 0.3)}px monospace`;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          ctx.fillText('*', x + tileW - 2, y + 2);
        }

        // Grid
        ctx.strokeStyle = hasColor
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, y + 0.5, tileW - 1, tileH - 1);
      }
    }
  }, [colorMap, width, height, tileW, tileH, canvasW, canvasH]);

  useEffect(() => { draw(); }, [draw]);

  // Obtém tile sob o cursor
  const getTileFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const tx = Math.floor(mx / tileW);
    const ty = Math.floor(my / tileH);
    if (tx < 0 || tx >= width || ty < 0 || ty >= height) return null;
    return { tx, ty, idx: ty * width + tx };
  };

  // Publica novo estado do color map
  const publishColorMap = useCallback((newMap: SceneColorMap) => {
    if (onColorMapChange) {
      onColorMapChange(newMap);
    } else {
      dispatch(updateScene({ id: sceneId, changes: { colorMap: newMap } }));
    }
  }, [sceneId, onColorMapChange, dispatch]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const tile = getTileFromEvent(e);
    if (!tile) return;
    setIsPainting(true);

    if (showPriority) {
      // Modo priority: alterna prioridade do tile
      const current = hasPriorityFlag(colorMap[tile.idx] ?? 0);
      publishColorMap(applyPriorityBrush(colorMap, tile.idx, !current));
      return;
    }

    if (activeTool === 'pencil') {
      publishColorMap(applyColorPencil(colorMap, tile.idx, selectedPalette, true));
    } else if (activeTool === 'eraser') {
      publishColorMap(applyColorEraser(colorMap, tile.idx));
    } else if (activeTool === 'magic') {
      publishColorMap(applyColorMagicBrush(colorMap, tile.idx, selectedPalette, true));
      setIsPainting(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    const tile = getTileFromEvent(e);
    if (!tile) return;

    if (showPriority) return; // priority so aplica no clique

    if (activeTool === 'pencil') {
      publishColorMap(applyColorPencil(colorMap, tile.idx, selectedPalette, true));
    } else if (activeTool === 'eraser') {
      publishColorMap(applyColorEraser(colorMap, tile.idx));
    }
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  // Stats
  const paletteUsage = countPaletteUsage(colorMap);
  const priorityCount = countPriorityTiles(colorMap);
  const paintedTiles = colorMap.filter((v) => v !== 0).length;
  const totalTiles = width * height;

  return (
    <Wrapper>
      <ColorToolbar
        selectedPalette={selectedPalette}
        activeTool={activeTool}
        showPriority={showPriority}
        paletteMode={paletteMode}
        onSelectPalette={setSelectedPalette}
        onSelectTool={setActiveTool}
        onTogglePriority={() => setShowPriority((p) => !p)}
        onChangePaletteMode={setPaletteMode}
      />
      <CanvasArea>
        <Canvas
          ref={canvasRef}
          width={canvasW}
          height={canvasH}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <StatsBar>
          <StatItem color="#e8a020">
            P0:{paletteUsage[0]}
          </StatItem>
          <StatItem color="#2080e8">
            P1:{paletteUsage[1]}
          </StatItem>
          <StatItem color="#c020e8">
            P2:{paletteUsage[2]}
          </StatItem>
          <StatItem color="#20c840">
            P3:{paletteUsage[3]}
          </StatItem>
          {priorityCount > 0 && (
            <PriorityBadge>*{priorityCount} prio</PriorityBadge>
          )}
          <StatItem>{paintedTiles}/{totalTiles} tiles</StatItem>
          <StatItem color="#5b9bd5">{activeTool}</StatItem>
        </StatsBar>
      </CanvasArea>
    </Wrapper>
  );
};

export default ColorEditor;
