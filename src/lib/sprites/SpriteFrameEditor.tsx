import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { SpriteFrame } from './spriteTypes';
import { updateSpriteFrame } from './spriteUtils';

interface SpriteFrameEditorProps {
  spriteId: string;
  animationId: string;
  frameIndex: number;
}

// Mega Drive hardware limits for sprite frames
const MD_SPRITE_SIZES = [
  { label: '1x1 (8x8px)', width: 1, height: 1 },
  { label: '2x1 (16x8px)', width: 2, height: 1 },
  { label: '3x1 (24x8px)', width: 3, height: 1 },
  { label: '4x1 (32x8px)', width: 4, height: 1 },
  { label: '1x2 (8x16px)', width: 1, height: 2 },
  { label: '2x2 (16x16px)', width: 2, height: 2 },
  { label: '3x2 (24x16px)', width: 3, height: 2 },
  { label: '4x2 (32x16px)', width: 4, height: 2 },
  { label: '1x3 (8x24px)', width: 1, height: 3 },
  { label: '2x3 (16x24px)', width: 2, height: 3 },
  { label: '3x3 (24x24px)', width: 3, height: 3 },
  { label: '4x3 (32x24px)', width: 4, height: 3 },
  { label: '1x4 (8x32px)', width: 1, height: 4 },
  { label: '2x4 (16x32px)', width: 2, height: 4 },
  { label: '3x4 (24x32px)', width: 3, height: 4 },
  { label: '4x4 (32x32px)', width: 4, height: 4 },
];

const SpriteFrameEditor: FC<SpriteFrameEditorProps> = ({
  spriteId,
  animationId,
  frameIndex,
}) => {
  const dispatch = useAppDispatch();

  const frame = useAppSelector((state) => {
    const sheet = state.project.present.spriteSheets.entities[spriteId];
    const animation = sheet?.animations?.find((a: any) => a.id === animationId);
    return animation?.frames?.[frameIndex] as SpriteFrame | undefined;
  });

  if (!frame) return null;

  const handleWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = MD_SPRITE_SIZES[parseInt(e.target.value, 10)];
    dispatch(
      updateSpriteFrame({
        spriteId,
        animationId,
        frameIndex,
        changes: {
          width: selected.width,
          height: selected.height,
        },
      })
    );
  };

  const handleOffsetXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateSpriteFrame({
        spriteId,
        animationId,
        frameIndex,
        changes: { offsetX: parseInt(e.target.value, 10) || 0 },
      })
    );
  };

  const handleOffsetYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateSpriteFrame({
        spriteId,
        animationId,
        frameIndex,
        changes: { offsetY: parseInt(e.target.value, 10) || 0 },
      })
    );
  };

  const currentSizeIndex = MD_SPRITE_SIZES.findIndex(
    (s) => s.width === (frame.width ?? 2) && s.height === (frame.height ?? 2)
  );

  const tileCount = (frame.width ?? 2) * (frame.height ?? 2);

  return (
    <div className="sprite-frame-editor">
      <div className="sprite-frame-editor__header">
        <h5 className="sprite-frame-editor__title">Frame {frameIndex + 1}</h5>
      </div>

      <div className="sprite-frame-editor__field">
        <label>Sprite Size</label>
        <select
          value={currentSizeIndex >= 0 ? currentSizeIndex : 10}
          onChange={handleWidthChange}
        >
          {MD_SPRITE_SIZES.map((size, i) => (
            <option key={i} value={i}>
              {size.label}
            </option>
          ))}
        </select>
        <span className="sprite-frame-editor__hint">
          {tileCount} tile(s) / {tileCount * 32} bytes VRAM
        </span>
      </div>

      <div className="sprite-frame-editor__field">
        <label>Offset X</label>
        <input
          type="number"
          value={frame.offsetX ?? 0}
          onChange={handleOffsetXChange}
          min={-128}
          max={127}
        />
        <span className="sprite-frame-editor__hint">pixels (-128 to 127)</span>
      </div>

      <div className="sprite-frame-editor__field">
        <label>Offset Y</label>
        <input
          type="number"
          value={frame.offsetY ?? 0}
          onChange={handleOffsetYChange}
          min={-128}
          max={127}
        />
        <span className="sprite-frame-editor__hint">pixels (-128 to 127)</span>
      </div>

      <div className="sprite-frame-editor__preview">
        <div
          className="sprite-frame-editor__tile-grid"
          style={{
            width: (frame.width ?? 2) * 8,
            height: (frame.height ?? 2) * 8,
            display: 'grid',
            gridTemplateColumns: `repeat(${frame.width ?? 2}, 8px)`,
            gridTemplateRows: `repeat(${frame.height ?? 2}, 8px)`,
            border: '1px solid #555',
          }}
        >
          {Array.from({ length: tileCount }).map((_, i) => (
            <div
              key={i}
              className="sprite-frame-editor__tile"
              style={{
                width: 8,
                height: 8,
                border: '1px solid #333',
                backgroundColor: '#1a1a2e',
              }}
            />
          ))}
        </div>
        <span className="sprite-frame-editor__hint">
          Grid preview (1px = 1px)
        </span>
      </div>
    </div>
  );
};

export default SpriteFrameEditor;
