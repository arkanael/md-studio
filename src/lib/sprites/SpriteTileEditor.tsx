import React, { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { SpriteTile } from './spriteTypes';
import { updateSpriteTile } from './spriteUtils';

interface SpriteTileEditorProps {
  spriteId: string;
  tileIndex: number;
}

// Mega Drive tile: 8x8 pixels, 4bpp = 32 bytes per tile
const TILE_SIZE = 8;
const TILE_COLORS = 16; // 4bpp = 16 colors per palette

// Color palette indices for Mega Drive (0 = transparent)
const PALETTE_ENTRIES = Array.from({ length: TILE_COLORS }, (_, i) => i);

const SpriteTileEditor: FC<SpriteTileEditorProps> = ({ spriteId, tileIndex }) => {
  const dispatch = useAppDispatch();
  const [selectedColor, setSelectedColor] = useState(1);
  const [paletteIndex, setPaletteIndex] = useState(0);

  const tile = useAppSelector((state) => {
    const sheet = state.project.present.spriteSheets.entities[spriteId];
    return sheet?.tiles?.[tileIndex] as SpriteTile | undefined;
  });

  const palette = useAppSelector((state) => {
    const sheet = state.project.present.spriteSheets.entities[spriteId];
    return sheet?.palettes?.[paletteIndex];
  });

  if (!tile) return null;

  const pixelData: number[] = tile.data ?? Array(TILE_SIZE * TILE_SIZE).fill(0);

  const handlePixelClick = (pixelIndex: number) => {
    const newData = [...pixelData];
    newData[pixelIndex] = selectedColor;
    dispatch(
      updateSpriteTile({
        spriteId,
        tileIndex,
        changes: { data: newData },
      })
    );
  };

  const handleFlipH = () => {
    const newData: number[] = [];
    for (let row = 0; row < TILE_SIZE; row++) {
      for (let col = TILE_SIZE - 1; col >= 0; col--) {
        newData.push(pixelData[row * TILE_SIZE + col]);
      }
    }
    dispatch(
      updateSpriteTile({ spriteId, tileIndex, changes: { data: newData } })
    );
  };

  const handleFlipV = () => {
    const newData: number[] = [];
    for (let row = TILE_SIZE - 1; row >= 0; row--) {
      for (let col = 0; col < TILE_SIZE; col++) {
        newData.push(pixelData[row * TILE_SIZE + col]);
      }
    }
    dispatch(
      updateSpriteTile({ spriteId, tileIndex, changes: { data: newData } })
    );
  };

  const handleClear = () => {
    dispatch(
      updateSpriteTile({
        spriteId,
        tileIndex,
        changes: { data: Array(TILE_SIZE * TILE_SIZE).fill(0) },
      })
    );
  };

  const getPixelColor = (colorIndex: number): string => {
    if (colorIndex === 0) return 'transparent';
    const color = palette?.colors?.[colorIndex];
    if (!color) return `hsl(${colorIndex * 22}, 70%, 50%)`;
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  return (
    <div className="sprite-tile-editor">
      <div className="sprite-tile-editor__header">
        <h5 className="sprite-tile-editor__title">Tile {tileIndex}</h5>
        <span className="sprite-tile-editor__info">8x8px / 32 bytes VRAM</span>
      </div>

      <div className="sprite-tile-editor__palette-select">
        <label>Palette</label>
        <select
          value={paletteIndex}
          onChange={(e) => setPaletteIndex(parseInt(e.target.value, 10))}
        >
          {[0, 1, 2, 3].map((i) => (
            <option key={i} value={i}>
              Palette {i}
            </option>
          ))}
        </select>
      </div>

      <div className="sprite-tile-editor__color-picker">
        <label>Color</label>
        <div className="sprite-tile-editor__colors">
          {PALETTE_ENTRIES.map((colorIdx) => (
            <div
              key={colorIdx}
              className={`sprite-tile-editor__color${
                selectedColor === colorIdx
                  ? ' sprite-tile-editor__color--selected'
                  : ''
              }`}
              style={{
                width: 16,
                height: 16,
                backgroundColor:
                  colorIdx === 0 ? 'transparent' : getPixelColor(colorIdx),
                border:
                  selectedColor === colorIdx
                    ? '2px solid white'
                    : '1px solid #555',
                cursor: 'pointer',
                display: 'inline-block',
              }}
              onClick={() => setSelectedColor(colorIdx)}
              title={colorIdx === 0 ? 'Transparent' : `Color ${colorIdx}`}
            />
          ))}
        </div>
      </div>

      <div className="sprite-tile-editor__canvas">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${TILE_SIZE}, 20px)`,
            gridTemplateRows: `repeat(${TILE_SIZE}, 20px)`,
            border: '1px solid #555',
            width: TILE_SIZE * 20,
          }}
        >
          {pixelData.map((colorIdx, i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                backgroundColor: getPixelColor(colorIdx),
                border: '1px solid #2a2a3e',
                cursor: 'crosshair',
                boxSizing: 'border-box',
              }}
              onClick={() => handlePixelClick(i)}
            />
          ))}
        </div>
      </div>

      <div className="sprite-tile-editor__actions">
        <button onClick={handleFlipH} title="Flip Horizontal">
          Flip H
        </button>
        <button onClick={handleFlipV} title="Flip Vertical">
          Flip V
        </button>
        <button onClick={handleClear} title="Clear Tile">
          Clear
        </button>
      </div>
    </div>
  );
};

export default SpriteTileEditor;
