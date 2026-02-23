import React, { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  Background,
  BackgroundTile,
  BackgroundTileEntry,
  MD_BG_TILE_SIZE,
  MD_BG_PALETTE_SIZE,
} from './backgroundTypes';
import { updateBackgroundTile, updateTileMapEntry } from './backgroundUtils';

interface BackgroundTileEditorProps {
  backgroundId: string;
  /** Index of the tile in bg.tiles[] to edit */
  tileIndex: number;
  /** Index of the cell in bg.tileMap[] for tile entry properties */
  cellIndex?: number;
}

const PALETTE_ENTRIES = Array.from({ length: MD_BG_PALETTE_SIZE }, (_, i) => i);

const BackgroundTileEditor: FC<BackgroundTileEditorProps> = ({
  backgroundId,
  tileIndex,
  cellIndex,
}) => {
  const dispatch = useAppDispatch();
  const [selectedColor, setSelectedColor] = useState(1);
  const [paletteIndex, setPaletteIndex] = useState(0);

  const bg = useAppSelector(
    (state) =>
      state.project.present.backgrounds.entities[backgroundId] as
        | Background
        | undefined
  );

  const tile = bg?.tiles[tileIndex] as BackgroundTile | undefined;
  const entry: BackgroundTileEntry | undefined =
    cellIndex !== undefined ? bg?.tileMap[cellIndex] : undefined;

  const palette = bg?.palettes[paletteIndex];

  if (!bg || !tile) return null;

  const pixelData = tile.data ?? Array(MD_BG_TILE_SIZE * MD_BG_TILE_SIZE).fill(0);

  const getPixelColor = (colorIndex: number): string => {
    if (colorIndex === 0) return '#0a0a1a';
    const color = palette?.colors?.[colorIndex];
    if (!color) return `hsl(${colorIndex * 22}, 70%, 50%)`;
    return `rgb(${color.r},${color.g},${color.b})`;
  };

  const handlePixelClick = (pixelIndex: number) => {
    const newData = [...pixelData];
    newData[pixelIndex] = selectedColor;
    dispatch(
      updateBackgroundTile({
        backgroundId,
        tileIndex,
        changes: { data: newData },
      })
    );
  };

  const handleFlipH = () => {
    const newData: number[] = [];
    for (let row = 0; row < MD_BG_TILE_SIZE; row++) {
      for (let col = MD_BG_TILE_SIZE - 1; col >= 0; col--) {
        newData.push(pixelData[row * MD_BG_TILE_SIZE + col]);
      }
    }
    dispatch(
      updateBackgroundTile({ backgroundId, tileIndex, changes: { data: newData } })
    );
  };

  const handleFlipV = () => {
    const newData: number[] = [];
    for (let row = MD_BG_TILE_SIZE - 1; row >= 0; row--) {
      for (let col = 0; col < MD_BG_TILE_SIZE; col++) {
        newData.push(pixelData[row * MD_BG_TILE_SIZE + col]);
      }
    }
    dispatch(
      updateBackgroundTile({ backgroundId, tileIndex, changes: { data: newData } })
    );
  };

  const handleClear = () => {
    dispatch(
      updateBackgroundTile({
        backgroundId,
        tileIndex,
        changes: { data: Array(MD_BG_TILE_SIZE * MD_BG_TILE_SIZE).fill(0) },
      })
    );
  };

  const handleEntryChange = (changes: Partial<BackgroundTileEntry>) => {
    if (cellIndex === undefined) return;
    dispatch(updateTileMapEntry({ backgroundId, cellIndex, changes }));
  };

  return (
    <div className="bg-tile-editor">
      <div className="bg-tile-editor__header">
        <h5>Tile {tileIndex}</h5>
        <span className="bg-tile-editor__info">8x8px / 32 bytes VRAM</span>
      </div>

      {/* Palette selector */}
      <div className="bg-tile-editor__field">
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

      {/* Color picker */}
      <div className="bg-tile-editor__colors">
        {PALETTE_ENTRIES.map((ci) => (
          <div
            key={ci}
            onClick={() => setSelectedColor(ci)}
            style={{
              width: 14,
              height: 14,
              backgroundColor: getPixelColor(ci),
              border: selectedColor === ci ? '2px solid white' : '1px solid #444',
              cursor: 'pointer',
              display: 'inline-block',
            }}
            title={ci === 0 ? 'Transparent' : `Color ${ci}`}
          />
        ))}
      </div>

      {/* Pixel canvas */}
      <div
        className="bg-tile-editor__canvas"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MD_BG_TILE_SIZE}, 20px)`,
          gridTemplateRows: `repeat(${MD_BG_TILE_SIZE}, 20px)`,
          border: '1px solid #444',
          width: MD_BG_TILE_SIZE * 20,
          margin: '8px 0',
        }}
      >
        {pixelData.map((ci, i) => (
          <div
            key={i}
            onClick={() => handlePixelClick(i)}
            style={{
              width: 20,
              height: 20,
              backgroundColor: getPixelColor(ci),
              border: '1px solid #1a1a2e',
              cursor: 'crosshair',
              boxSizing: 'border-box',
            }}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="bg-tile-editor__actions">
        <button onClick={handleFlipH}>Flip H</button>
        <button onClick={handleFlipV}>Flip V</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      {/* Tile map entry properties (only if cellIndex is provided) */}
      {entry && cellIndex !== undefined && (
        <div className="bg-tile-editor__entry">
          <h6>Cell #{cellIndex} Properties</h6>

          <div className="bg-tile-editor__field">
            <label>Cell Palette</label>
            <select
              value={entry.paletteIndex}
              onChange={(e) =>
                handleEntryChange({
                  paletteIndex: parseInt(e.target.value, 10),
                })
              }
            >
              {[0, 1, 2, 3].map((i) => (
                <option key={i} value={i}>
                  Palette {i}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-tile-editor__field">
            <label>
              <input
                type="checkbox"
                checked={entry.flipH}
                onChange={(e) => handleEntryChange({ flipH: e.target.checked })}
              />
              Flip Horizontal
            </label>
          </div>

          <div className="bg-tile-editor__field">
            <label>
              <input
                type="checkbox"
                checked={entry.flipV}
                onChange={(e) => handleEntryChange({ flipV: e.target.checked })}
              />
              Flip Vertical
            </label>
          </div>

          <div className="bg-tile-editor__field">
            <label>
              <input
                type="checkbox"
                checked={entry.priority}
                onChange={(e) =>
                  handleEntryChange({ priority: e.target.checked })
                }
              />
              Priority (above sprites)
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundTileEditor;
