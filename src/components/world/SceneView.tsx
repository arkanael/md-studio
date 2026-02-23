import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { editorActions } from '../../store/features/editor/editorSlice';
import type { MDScene, MDActor, MDTrigger, CollisionTile } from '../../store/features/entities/entitiesTypes';
import { MD_TILE_SIZE, MD_SCREEN_WIDTH, MD_SCREEN_HEIGHT } from '../../store/features/entities/entitiesTypes';

// -------------------------------------------------------
// SceneView - Renderiza uma cena do Mega Drive no canvas
// Equivale ao SceneView do GB Studio adaptado para MD
// Resolucao nativa: 320x224 pixels / tiles de 8x8
// -------------------------------------------------------

interface SceneViewProps {
  scene: MDScene;
  zoom: number;
  showGrid: boolean;
  showCollisions: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const SceneWrapper = styled.div<{ $selected: boolean; $zoom: number; $w: number; $h: number }>`
  position: absolute;
  left: 20px;
  top: 20px;
  width: ${(p) => p.$w * MD_TILE_SIZE * p.$zoom}px;
  height: ${(p) => p.$h * MD_TILE_SIZE * p.$zoom}px;
  outline: ${(p) => (p.$selected ? '2px solid #e94560' : '1px solid #0f3460')};
  box-shadow: ${(p) => (p.$selected ? '0 0 0 4px rgba(233,69,96,0.3)' : 'none')};
  cursor: pointer;
  border-radius: 2px;
  overflow: hidden;
  background: #000;
`;

const SceneLabel = styled.div<{ $selected: boolean }>`
  position: absolute;
  top: -22px;
  left: 0;
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => (p.$selected ? '#e94560' : '#a0a0c0')};
  white-space: nowrap;
  user-select: none;
`;

const ActorMarker = styled.div<{ $x: number; $y: number; $zoom: number }>`
  position: absolute;
  left: ${(p) => p.$x * MD_TILE_SIZE * p.$zoom}px;
  top: ${(p) => p.$y * MD_TILE_SIZE * p.$zoom}px;
  width: ${(p) => 16 * p.$zoom}px;
  height: ${(p) => 16 * p.$zoom}px;
  background: rgba(52, 152, 219, 0.7);
  border: 1px solid #3498db;
  border-radius: 2px;
  cursor: move;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => Math.max(8, 10 * p.$zoom)}px;
  color: #fff;
  user-select: none;
`;

const TriggerMarker = styled.div<{ $x: number; $y: number; $w: number; $h: number; $zoom: number }>`
  position: absolute;
  left: ${(p) => p.$x * MD_TILE_SIZE * p.$zoom}px;
  top: ${(p) => p.$y * MD_TILE_SIZE * p.$zoom}px;
  width: ${(p) => p.$w * MD_TILE_SIZE * p.$zoom}px;
  height: ${(p) => p.$h * MD_TILE_SIZE * p.$zoom}px;
  background: rgba(155, 89, 182, 0.3);
  border: 1px solid #9b59b6;
  cursor: pointer;
  z-index: 1;
`;

const PlayerMarker = styled.div<{ $x: number; $y: number; $zoom: number }>`
  position: absolute;
  left: ${(p) => p.$x * MD_TILE_SIZE * p.$zoom}px;
  top: ${(p) => p.$y * MD_TILE_SIZE * p.$zoom}px;
  width: ${(p) => 16 * p.$zoom}px;
  height: ${(p) => 16 * p.$zoom}px;
  background: rgba(46, 204, 113, 0.8);
  border: 2px solid #2ecc71;
  border-radius: 50%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => Math.max(8, 9 * p.$zoom)}px;
  color: #fff;
  cursor: pointer;
  user-select: none;
`;

// Overlay de grid via canvas
const GridCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 5;
  opacity: 0.4;
`;

// Overlay de colisoes via canvas
const CollisionCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 4;
  opacity: 0.6;
`;

// Guia de resolucao da tela do MD (320x224)
const ScreenGuide = styled.div<{ $zoom: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(p) => MD_SCREEN_WIDTH * p.$zoom}px;
  height: ${(p) => MD_SCREEN_HEIGHT * p.$zoom}px;
  border: 1px dashed rgba(233, 69, 96, 0.5);
  pointer-events: none;
  z-index: 6;
`;

// -------------------------------------------------------
// Helpers de renderizacao
// -------------------------------------------------------
const COLLISION_COLORS: Record<string, string> = {
  solid: '#e74c3c',
  top: '#e67e22',
  bottom: '#f1c40f',
  left: '#3498db',
  right: '#2ecc71',
  ladder: '#9b59b6',
  slope_up: '#1abc9c',
  slope_down: '#16a085',
};

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, zoom: number) {
  const tileSize = MD_TILE_SIZE * zoom;
  ctx.clearRect(0, 0, w * tileSize, h * tileSize);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= w; x++) {
    ctx.beginPath();
    ctx.moveTo(x * tileSize, 0);
    ctx.lineTo(x * tileSize, h * tileSize);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * tileSize);
    ctx.lineTo(w * tileSize, y * tileSize);
    ctx.stroke();
  }
}

function drawCollisions(ctx: CanvasRenderingContext2D, tiles: CollisionTile[], zoom: number) {
  const tileSize = MD_TILE_SIZE * zoom;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (const tile of tiles) {
    if (tile.type === 'none') continue;
    ctx.fillStyle = COLLISION_COLORS[tile.type] ?? '#fff';
    ctx.fillRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
  }
}

// -------------------------------------------------------
// Componente SceneView
// -------------------------------------------------------
const SceneView: React.FC<SceneViewProps> = ({
  scene,
  zoom,
  showGrid,
  showCollisions,
  isSelected,
  onSelect,
}) => {
  const dispatch = useDispatch();
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const collisionCanvasRef = useRef<HTMLCanvasElement>(null);

  const w = scene.width || 40;
  const h = scene.height || 28;
  const canvasW = w * MD_TILE_SIZE * zoom;
  const canvasH = h * MD_TILE_SIZE * zoom;

  // Desenhar grid
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas || !showGrid) return;
    const ctx = canvas.getContext('2d');
    if (ctx) drawGrid(ctx, w, h, zoom);
  }, [showGrid, zoom, w, h]);

  // Desenhar colisoes
  useEffect(() => {
    const canvas = collisionCanvasRef.current;
    if (!canvas || !showCollisions) return;
    const ctx = canvas.getContext('2d');
    if (ctx) drawCollisions(ctx, scene.collisions, zoom);
  }, [showCollisions, scene.collisions, zoom]);

  const handleActorClick = useCallback(
    (e: React.MouseEvent, actor: MDActor) => {
      e.stopPropagation();
      dispatch(editorActions.selectActor({ sceneId: scene.id, actorId: actor.id }));
    },
    [dispatch, scene.id]
  );

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent, trigger: MDTrigger) => {
      e.stopPropagation();
      dispatch(editorActions.selectTrigger({ sceneId: scene.id, triggerId: trigger.id }));
    },
    [dispatch, scene.id]
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginLeft: 40, marginTop: 40 }}>
      {/* Rotulo da cena */}
      <SceneLabel $selected={isSelected}>
        {scene.name || 'Cena sem nome'} ({w}x{h} tiles)
      </SceneLabel>

      <SceneWrapper
        $selected={isSelected}
        $zoom={zoom}
        $w={w}
        $h={h}
        onClick={onSelect}
      >
        {/* Guia de resolucao da tela do MD */}
        <ScreenGuide $zoom={zoom} title="Resolucao da tela: 320x224px" />

        {/* Canvas de grid */}
        {showGrid && (
          <GridCanvas
            ref={gridCanvasRef}
            width={canvasW}
            height={canvasH}
          />
        )}

        {/* Canvas de colisoes */}
        {showCollisions && (
          <CollisionCanvas
            ref={collisionCanvasRef}
            width={canvasW}
            height={canvasH}
          />
        )}

        {/* Marcador do jogador */}
        <PlayerMarker
          $x={scene.playerStartX}
          $y={scene.playerStartY}
          $zoom={zoom}
          title={`Jogador (${scene.playerStartX}, ${scene.playerStartY})`}
          onClick={(e) => { e.stopPropagation(); dispatch(editorActions.selectPlayer()); }}
        >
          P
        </PlayerMarker>

        {/* Atores */}
        {scene.actors.map((actor) => (
          <ActorMarker
            key={actor.id}
            $x={actor.x}
            $y={actor.y}
            $zoom={zoom}
            title={actor.name || 'Ator'}
            onClick={(e) => handleActorClick(e, actor)}
          >
            A
          </ActorMarker>
        ))}

        {/* Triggers */}
        {scene.triggers.map((trigger) => (
          <TriggerMarker
            key={trigger.id}
            $x={trigger.x}
            $y={trigger.y}
            $w={trigger.width}
            $h={trigger.height}
            $zoom={zoom}
            title={trigger.name || 'Trigger'}
            onClick={(e) => handleTriggerClick(e, trigger)}
          />
        ))}
      </SceneWrapper>
    </div>
  );
};

export default SceneView;
