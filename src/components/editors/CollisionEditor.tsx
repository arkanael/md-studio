import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateScene } from '../../store/features/editor/editorSlice';

// -------------------------------------------------
// CollisionEditor - Editor de colisoes por tile
// Permite pintar/apagar tiles de colisao
// Gera array binario para uso no SGDK
// Mapa de colisao: 1 = solido, 0 = livre
// -------------------------------------------------

const TILE_SIZE = 16;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: crosshair;
  user-select: none;
`;

const Canvas = styled.canvas`
  display: block;
  image-rendering: pixelated;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(13,13,26,0.85);
  border: 1px solid #e94560;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 10px;
  color: #aaa;
  pointer-events: none;

  span { color: #e94560; margin-right: 4px; }
`;

export interface CollisionEditorProps {
  sceneId: string;
  width: number;   // largura em tiles
  height: number;  // altura em tiles
  collisions: number[];  // array 1D de bits: 0=livre, 1=solido
  zoom?: number;
  onCollisionsChange?: (newCollisions: number[]) => void;
}

const CollisionEditor: React.FC<CollisionEditorProps> = ({
  sceneId,
  width,
  height,
  collisions,
  zoom = 1,
  onCollisionsChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const [isPainting, setIsPainting] = useState(false);
  const [paintMode, setPaintMode] = useState<0 | 1>(1); // 1=pintar, 0=apagar

  const tileW = TILE_SIZE * zoom;
  const tileH = TILE_SIZE * zoom;
  const canvasW = width * tileW;
  const canvasH = height * tileH;

  // Desenha o grid de colisoes no canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasW, canvasH);

    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const idx = ty * width + tx;
        const isSolid = collisions[idx] === 1;
        const x = tx * tileW;
        const y = ty * tileH;

        if (isSolid) {
          // Tile solido - vermelho semi-transparente
          ctx.fillStyle = 'rgba(233, 69, 96, 0.55)';
          ctx.fillRect(x, y, tileW, tileH);

          // Borda do tile solido
          ctx.strokeStyle = 'rgba(233, 69, 96, 0.9)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, y + 0.5, tileW - 1, tileH - 1);

          // X no centro
          ctx.fillStyle = 'rgba(233, 69, 96, 0.7)';
          ctx.font = `${Math.max(8, tileW * 0.5)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('x', x + tileW / 2, y + tileH / 2);
        } else {
          // Grid vazio
          ctx.strokeStyle = 'rgba(255,255,255,0.05)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, tileW, tileH);
        }
      }
    }
  }, [collisions, width, height, tileW, tileH, canvasW, canvasH]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getTileFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const tx = Math.floor(mx / tileW);
    const ty = Math.floor(my / tileH);
    if (tx < 0 || tx >= width || ty < 0 || ty >= height) return null;
    return { tx, ty, idx: ty * width + tx };
  };

  const paintTile = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const tile = getTileFromEvent(e);
    if (!tile) return;

    const newCollisions = [...collisions];
    newCollisions[tile.idx] = paintMode;

    if (onCollisionsChange) {
      onCollisionsChange(newCollisions);
    } else {
      dispatch(updateScene({
        id: sceneId,
        changes: { collisions: newCollisions },
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const tile = getTileFromEvent(e);
    if (!tile) return;
    // Define o modo com base no estado atual do tile clicado
    const currentVal = collisions[tile.idx];
    setPaintMode(currentVal === 1 ? 0 : 1);
    setIsPainting(true);
    paintTile(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    paintTile(e);
  };

  const handleMouseUp = () => setIsPainting(false);

  const solidCount = collisions.filter(c => c === 1).length;
  const totalTiles = width * height;

  return (
    <Wrapper>
      <Canvas
        ref={canvasRef}
        width={canvasW}
        height={canvasH}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <Overlay>
        <span>{solidCount}</span>solidos /
        <span style={{ marginLeft: 6 }}>{totalTiles - solidCount}</span>livres
      </Overlay>
    </Wrapper>
  );
};

export default CollisionEditor;
