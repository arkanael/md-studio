import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { updateScene } from '../../store/features/editor/editorSlice';
import type { MDSceneType } from '../../lib/scenes/sceneTypes';
import type { CollisionBrushTool } from '../../lib/scenes/collisionTypes';
import {
  COLLISION_FLAG,
  COLLISION_TILE_DEFINITIONS,
  getCollisionTilesForSceneType,
  getCollisionColor,
  getCollisionSymbol,
  hasCollisionFlag,
} from '../../lib/scenes/collisionTypes';
import {
  applyPencil,
  applyEraser,
  applyMagicBrush,
  applySlopeBrush,
  applyCollisionMap,
} from '../../lib/scenes/collisionUtils';
import { CollisionToolbar } from './CollisionToolbar';

// --------------------------------------------------
// CollisionEditor - Editor canvas de colisoes
// Suporta: Solid, Top, Bottom, Left, Right,
//          Ladder (platformer only), Slope Up/Down
// Ferramentas: Pencil, Eraser, Slope Brush, Magic Brush
// Bitmask uint8 por tile - compativel com SGDK
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
`;

const StatItem = styled.span<{ color?: string }>`
  color: ${(p) => p.color ?? '#888'};
`;

export interface CollisionEditorProps {
  sceneId: string;
  sceneType: MDSceneType;
  width: number;
  height: number;
  collisions: number[];
  zoom?: number;
  onCollisionsChange?: (newCollisions: number[]) => void;
}

const CollisionEditor: React.FC<CollisionEditorProps> = ({
  sceneId,
  sceneType,
  width,
  height,
  collisions,
  zoom = 1,
  onCollisionsChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();

  // Estado do editor
  const [activeTool, setActiveTool] = useState<CollisionBrushTool>('pencil');
  const [selectedTileId, setSelectedTileId] = useState<string>('solid');
  const [isPainting, setIsPainting] = useState(false);
  const [slopeStart, setSlopeStart] = useState<{ tx: number; ty: number } | null>(null);
  const [previewMap, setPreviewMap] = useState<Map<number, number>>(new Map());

  const tileW = TILE_SIZE * zoom;
  const tileH = TILE_SIZE * zoom;
  const canvasW = width * tileW;
  const canvasH = height * tileH;

  // Obtem os flags do tile selecionado
  const getSelectedFlags = useCallback((): number => {
    const def = COLLISION_TILE_DEFINITIONS.find((d) => d.id === selectedTileId);
    return def?.flags ?? COLLISION_FLAG.SOLID;
  }, [selectedTileId]);

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

        // Flags: usa preview do slope brush se existir
        const flags = previewMap.has(idx)
          ? previewMap.get(idx)!
          : (collisions[idx] ?? 0);

        if (flags !== 0) {
          // Fundo colorido
          ctx.fillStyle = getCollisionColor(flags);
          ctx.fillRect(x, y, tileW, tileH);

          // Borda superior - indica TOP
          if (hasCollisionFlag(flags, COLLISION_FLAG.TOP)) {
            ctx.fillStyle = 'rgba(255,165,0,0.9)';
            ctx.fillRect(x, y, tileW, 2);
          }
          // Borda inferior - indica BOTTOM
          if (hasCollisionFlag(flags, COLLISION_FLAG.BOTTOM)) {
            ctx.fillStyle = 'rgba(255,165,0,0.9)';
            ctx.fillRect(x, y + tileH - 2, tileW, 2);
          }
          // Borda esquerda - indica LEFT
          if (hasCollisionFlag(flags, COLLISION_FLAG.LEFT)) {
            ctx.fillStyle = 'rgba(100,200,255,0.9)';
            ctx.fillRect(x, y, 2, tileH);
          }
          // Borda direita - indica RIGHT
          if (hasCollisionFlag(flags, COLLISION_FLAG.RIGHT)) {
            ctx.fillStyle = 'rgba(100,200,255,0.9)';
            ctx.fillRect(x + tileW - 2, y, 2, tileH);
          }

          // Simbolo central
          const sym = getCollisionSymbol(flags);
          if (sym) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = `bold ${Math.max(8, tileW * 0.45)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(sym, x + tileW / 2, y + tileH / 2);
          }
        }

        // Grid vazio
        ctx.strokeStyle = flags !== 0
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, y + 0.5, tileW - 1, tileH - 1);
      }
    }
  }, [collisions, previewMap, width, height, tileW, tileH, canvasW, canvasH]);

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

  // Publica novo estado de colisoes
  const publishCollisions = useCallback((newCols: number[]) => {
    if (onCollisionsChange) {
      onCollisionsChange(newCols);
    } else {
      dispatch(updateScene({ id: sceneId, changes: { collisions: newCols } }));
    }
  }, [sceneId, onCollisionsChange, dispatch]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const tile = getTileFromEvent(e);
    if (!tile) return;
    setIsPainting(true);

    if (activeTool === 'slope') {
      setSlopeStart({ tx: tile.tx, ty: tile.ty });
      return;
    }

    const flags = getSelectedFlags();

    if (activeTool === 'pencil') {
      publishCollisions(applyPencil(collisions, tile.idx, flags));
    } else if (activeTool === 'eraser') {
      publishCollisions(applyEraser(collisions, tile.idx));
    } else if (activeTool === 'magic') {
      publishCollisions(applyMagicBrush(collisions, tile.idx, flags));
      setIsPainting(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    const tile = getTileFromEvent(e);
    if (!tile) return;

    if (activeTool === 'slope' && slopeStart) {
      // Mostra preview do slope
      const opts = {
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        ctrlShiftKey: e.ctrlKey && e.shiftKey,
      };
      const map = applySlopeBrush(slopeStart, { tx: tile.tx, ty: tile.ty }, width, height, opts);
      setPreviewMap(map);
      return;
    }

    const flags = getSelectedFlags();
    if (activeTool === 'pencil') {
      publishCollisions(applyPencil(collisions, tile.idx, flags));
    } else if (activeTool === 'eraser') {
      publishCollisions(applyEraser(collisions, tile.idx));
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'slope' && slopeStart && isPainting) {
      const tile = getTileFromEvent(e);
      if (tile && previewMap.size > 0) {
        publishCollisions(applyCollisionMap(collisions, previewMap));
      }
      setSlopeStart(null);
      setPreviewMap(new Map());
    }
    setIsPainting(false);
  };

  // Stats
  const solidCount = collisions.filter((c) => c !== 0).length;
  const totalTiles = width * height;

  return (
    <Wrapper>
      <CollisionToolbar
        sceneType={sceneType}
        selectedTileId={selectedTileId}
        activeTool={activeTool}
        onSelectTile={setSelectedTileId}
        onSelectTool={setActiveTool}
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
          <StatItem color="#e94560">{solidCount} colisoes</StatItem>
          <StatItem>{totalTiles - solidCount} livres</StatItem>
          <StatItem color="#5b9bd5">{activeTool}</StatItem>
        </StatsBar>
      </CanvasArea>
    </Wrapper>
  );
};

export default CollisionEditor;
