import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  SpriteAnimation,
  SpriteAnimationType,
  SPRITE_ANIMATION_TYPES,
  SPRITE_ANIMATION_TYPE_LABELS,
} from './spriteTypes';
import { updateSpriteAnimation } from './spriteUtils';

interface SpriteAnimationEditorProps {
  spriteId: string;
  animationId: string;
}

const SpriteAnimationEditor: FC<SpriteAnimationEditorProps> = ({
  spriteId,
  animationId,
}) => {
  const dispatch = useAppDispatch();

  const animation = useAppSelector((state) => {
    const sheet = state.project.present.spriteSheets.entities[spriteId];
    return sheet?.animations?.find((a: SpriteAnimation) => a.id === animationId);
  });

  if (!animation) return null;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updateSpriteAnimation({
        spriteId,
        animationId,
        changes: { animationType: e.target.value as SpriteAnimationType },
      })
    );
  };

  const handleLoopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateSpriteAnimation({
        spriteId,
        animationId,
        changes: { loop: e.target.checked },
      })
    );
  };

  const handleFrameRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(30, parseInt(e.target.value, 10) || 1));
    dispatch(
      updateSpriteAnimation({
        spriteId,
        animationId,
        changes: { frameRate: value },
      })
    );
  };

  return (
    <div className="sprite-animation-editor">
      <div className="sprite-animation-editor__header">
        <h4 className="sprite-animation-editor__title">
          {animation.name || 'Animation'}
        </h4>
      </div>

      <div className="sprite-animation-editor__field">
        <label>Animation Type</label>
        <select
          value={animation.animationType}
          onChange={handleTypeChange}
        >
          {SPRITE_ANIMATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {SPRITE_ANIMATION_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div className="sprite-animation-editor__field">
        <label>Frame Rate</label>
        <input
          type="number"
          min={1}
          max={30}
          value={animation.frameRate ?? 12}
          onChange={handleFrameRateChange}
        />
        <span className="sprite-animation-editor__hint">fps (1-30)</span>
      </div>

      <div className="sprite-animation-editor__field">
        <label>
          <input
            type="checkbox"
            checked={animation.loop ?? true}
            onChange={handleLoopChange}
          />
          Loop Animation
        </label>
      </div>

      <div className="sprite-animation-editor__field">
        <label>Frames</label>
        <span className="sprite-animation-editor__count">
          {animation.frames?.length ?? 0} frame(s)
        </span>
      </div>

      <div className="sprite-animation-editor__info">
        <p>
          Mega Drive sprites use 4x4 tile patterns (32x32px). Each animation
          frame references a set of tiles mapped from VRAM.
        </p>
      </div>
    </div>
  );
};

export default SpriteAnimationEditor;
