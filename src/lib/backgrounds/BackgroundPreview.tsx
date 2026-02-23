import React, { FC, useRef, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { Background, MD_BG_TILE_SIZE } from './backgroundTypes';

interface BackgroundPreviewProps {
  backgroundId: string;
  /** Scale factor for the preview (default: 1) */
  scale?: number;
  /** Max preview width in px */
  maxWidth?: number;
  /** Show tile grid overlay */
  showGrid?: boolean;
  /** Show plane boundary */
  showPlaneBoundary?: boolean;
  /** Highlight selected cell index */
  selectedCell?: number;
  /** Callback when a cell is clicked */
  onCellClick?: (cellIndex: number) => void;
}

// Mega Drive screen sizes (reference lines)
const MD_SCREEN_W = 320;
const MD_SCREEN_H = 224;

const BackgroundPreview: FC<BackgroundPreviewProps> = ({
  backgroundId,
  scale = 1,
  maxWidth = 512,
  showGrid = false,
  showPlaneBoundary = true,
  selectedCell,
  onCellClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bg = useAppSelector(
    (state) =>
      state.project.present.backgrounds.entities[backgroundId] as
        | Background
        | undefined
  );

  const displayScale = Math.min(scale, maxWidth / (bg?.width ?? maxWidth));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = bg.width * displayScale;
    const h = bg.height * displayScale;
    canvas.width = w;
    canvas.height = h;

    // Background fill
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Draw tiles
    const tilesWide = Math.floor(bg.width / MD_BG_TILE_SIZE);
    const tilesHigh = Math.floor(bg.height / MD_BG_TILE_SIZE);
    const tileScaled = MD_BG_TILE_SIZE * displayScale;

    bg.tileMap.forEach((entry, cellIndex) => {
      const col = cellIndex % tilesWide;
      const row = Math.floor(cellIndex / tilesWide);
      const x = col * tileScaled;
      const y = row * tileScaled;

      const tile = bg.tiles[entry.tileIndex];
      if (!tile) return;

      const palette = bg.palettes[entry.paletteIndex];

      // Draw each pixel of the 8x8 tile
      tile.data.forEach((colorIdx, pixelIndex) => {
        if (colorIdx === 0) return; // transparent
        const px = pixelIndex % MD_BG_TILE_SIZE;
        const py = Math.floor(pixelIndex / MD_BG_TILE_SIZE);

        const actualPx = entry.flipH ? MD_BG_TILE_SIZE - 1 - px : px;
        const actualPy = entry.flipV ? MD_BG_TILE_SIZE - 1 - py : py;

        const color = palette?.colors?.[colorIdx];
        ctx.fillStyle = color
          ? `rgb(${color.r},${color.g},${color.b})`
          : `hsl(${colorIdx * 22}, 70%, 50%)`;

        ctx.fillRect(
          x + actualPx * displayScale,
          y + actualPy * displayScale,
          displayScale,
          displayScale
        );
      });

      // Highlight selected cell
      if (selectedCell === cellIndex) {
        ctx.strokeStyle = 'rgba(255,255,0,0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, tileScaled - 1, tileScaled - 1);
      }
    });

    // Grid overlay
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 0.5;
      for (let col = 0; col <= tilesWide; col++) {
        ctx.beginPath();
        ctx.moveTo(col * tileScaled, 0);
        ctx.lineTo(col * tileScaled, h);
        ctx.stroke();
      }
      for (let row = 0; row <= tilesHigh; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * tileScaled);
        ctx.lineTo(w, row * tileScaled);
        ctx.stroke();
      }
    }

    // Mega Drive screen boundary overlay
    if (showPlaneBoundary) {
      const screenW = MD_SCREEN_W * displayScale;
      const screenH = MD_SCREEN_H * displayScale;
      ctx.strokeStyle = 'rgba(0,200,255,0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(0.5, 0.5, Math.min(screenW, w) - 1, Math.min(screenH, h) - 1);
      ctx.setLineDash([]);

      // Screen size label
      ctx.fillStyle = 'rgba(0,200,255,0.9)';
      ctx.font = `${Math.max(9, 10 * displayScale)}px monospace`;
      ctx.fillText(`320x224 (screen)`, 4, Math.min(screenH, h) - 4);
    }
  }, [bg, displayScale, showGrid, showPlaneBoundary, selectedCell]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!bg || !onCellClick) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tileScaled = MD_BG_TILE_SIZE * displayScale;
    const tilesWide = Math.floor(bg.width / MD_BG_TILE_SIZE);
    const col = Math.floor(x / tileScaled);
    const row = Math.floor(y / tileScaled);
    const cellIndex = row * tilesWide + col;
    if (cellIndex >= 0 && cellIndex < bg.tileMap.length) {
      onCellClick(cellIndex);
    }
  };

  if (!bg) {
    return (
      <div className="background-preview background-preview--empty">
        <span>No background selected</span>
      </div>
    );
  }

  return (
    <div className="background-preview">
      <div className="background-preview__info">
        <span>{bg.width}x{bg.height}px</span>
        <span>{bg.tiles.length} unique tiles</span>
        <span>Plane {bg.plane}</span>
      </div>
      <div
        className="background-preview__canvas-wrapper"
        style={{ overflow: 'auto', maxWidth }}
      >
        <canvas
          ref={canvasRef}
          className="background-preview__canvas"
          style={{ cursor: onCellClick ? 'crosshair' : 'default', imageRendering: 'pixelated' }}
          onClick={handleCanvasClick}
          title={`${bg.name} - ${bg.width}x${bg.height}px`}
        />
      </div>
    </div>
  );
};

export default BackgroundPreview;
