import React, { useRef, useCallback } from 'react';
import { PlayerDirection, PlayerStartPosition } from './playerTypes';

interface Props {
  /** Current start position (tile coordinates + scene) */
  position: PlayerStartPosition;
  /** Pixel size of one tile in the world view (zoom-dependent) */
  tileSize: number;
  /** Called when the user finishes dragging the icon to a new tile */
  onPositionChange: (patch: Partial<PlayerStartPosition>) => void;
  /** Called when user clicks background (deselects scene) */
  onSelect?: () => void;
}

/** Arrow SVG for each direction */
const DIRECTION_ARROW: Record<PlayerDirection, string> = {
  up:    'M8 14 L8 2 M4 6 L8 2 L12 6',
  down:  'M8 2 L8 14 M4 10 L8 14 L12 10',
  left:  'M14 8 L2 8 M6 4 L2 8 L6 12',
  right: 'M2 8 L14 8 M10 4 L14 8 L10 12',
};

/**
 * PlayerWorldIcon
 *
 * The draggable player icon rendered in the world/scene view.
 * Mirrors GB Studio's player-start marker:
 *   - Shows an arrow indicating starting direction
 *   - Draggable within and between scenes (tile-snapped)
 *   - Right-click context menu to change direction (handled by parent)
 *
 * Adapted for Mega Drive / SGDK:
 *   - Tile grid: 8x8 px tiles, 40x28 tiles per screen
 */
const PlayerWorldIcon: React.FC<Props> = ({
  position,
  tileSize,
  onPositionChange,
}) => {
  const dragging = useRef(false);
  const dragStart = useRef<{ mouseX: number; mouseY: number; tileX: number; tileY: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGGElement>) => {
      e.stopPropagation();
      dragging.current = true;
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        tileX: position.x,
        tileY: position.y,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragging.current || !dragStart.current) return;
        const dx = ev.clientX - dragStart.current.mouseX;
        const dy = ev.clientY - dragStart.current.mouseY;
        const newX = Math.max(0, Math.round(dragStart.current.tileX + dx / tileSize));
        const newY = Math.max(0, Math.round(dragStart.current.tileY + dy / tileSize));
        onPositionChange({ x: newX, y: newY });
      };

      const handleMouseUp = () => {
        dragging.current = false;
        dragStart.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [position.x, position.y, tileSize, onPositionChange]
  );

  const pixelX = position.x * tileSize;
  const pixelY = position.y * tileSize;
  const arrowPath = DIRECTION_ARROW[position.direction];

  return (
    <g
      className="player-world-icon"
      transform={`translate(${pixelX}, ${pixelY})`}
      onMouseDown={handleMouseDown}
      style={{ cursor: 'grab' }}
      aria-label="Player start position"
    >
      {/* Background circle */}
      <circle
        cx={tileSize / 2}
        cy={tileSize / 2}
        r={tileSize / 2 - 1}
        fill="#3b82f6"
        stroke="#1d4ed8"
        strokeWidth={1}
        opacity={0.9}
      />

      {/* Direction arrow (scaled to tile size) */}
      <g transform={`scale(${tileSize / 16})`}>
        <path
          d={arrowPath}
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </g>
  );
};

export default PlayerWorldIcon;
