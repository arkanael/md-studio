import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  SpriteSheetData,
  SpriteType,
  SPRITE_MIN_CANVAS_PX,
  SPRITE_MAX_CANVAS_PX,
} from './spriteTypes';
import {
  updateSpriteSheet,
  removeSpriteSheet,
  addAnimationState,
  removeAnimationState,
  addFrame,
  validateCanvasSize,
  countUniqueTiles,
  getDefaultStateNames,
  SPRITE_MAX_TILES_PER_SCENE,
} from './spriteUtils';

const SPRITE_TYPE_LABELS: Record<SpriteType, string> = {
  static: 'Static',
  animated: 'Animated',
  actor: 'Actor',
  actor_animated: 'Animated Actor',
  platformer_player: 'Platformer Player',
};

interface SpriteEditorProps {
  spriteId: string;
  onSelectState?: (stateId: string) => void;
  onSelectFrame?: (stateId: string, frameId: string) => void;
  selectedStateId?: string | null;
  selectedFrameId?: string | null;
}

export const SpriteEditor: React.FC<SpriteEditorProps> = ({
  spriteId,
  onSelectState,
  onSelectFrame,
  selectedStateId,
  selectedFrameId,
}) => {
  const dispatch = useAppDispatch();
  const sprite = useAppSelector((state) =>
    state.project.spriteSheets?.find((s: SpriteSheetData) => s.id === spriteId)
  );

  if (!sprite) return null;

  const tileCount = countUniqueTiles(sprite);
  const tileWarning = tileCount > SPRITE_MAX_TILES_PER_SCENE;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSpriteSheet({ id: spriteId, changes: { name: e.target.value } }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as SpriteType;
    const stateNames = getDefaultStateNames(type);
    dispatch(updateSpriteSheet({ id: spriteId, changes: { type } }));
  };

  const handleCanvasWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateCanvasSize(
      parseInt(e.target.value) || SPRITE_MIN_CANVAS_PX,
      sprite.canvasSize.height
    );
    dispatch(updateSpriteSheet({ id: spriteId, changes: { canvasSize: validated } }));
  };

  const handleCanvasHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateCanvasSize(
      sprite.canvasSize.width,
      parseInt(e.target.value) || SPRITE_MIN_CANVAS_PX
    );
    dispatch(updateSpriteSheet({ id: spriteId, changes: { canvasSize: validated } }));
  };

  const handleOriginChange = (axis: 'x' | 'y', value: string) => {
    const num = parseInt(value) || 0;
    dispatch(
      updateSpriteSheet({
        id: spriteId,
        changes: { origin: { ...sprite.origin, [axis]: num } },
      })
    );
  };

  const handleCollisionChange = (
    field: 'x' | 'y' | 'width' | 'height',
    value: string
  ) => {
    const num = parseInt(value) || 0;
    dispatch(
      updateSpriteSheet({
        id: spriteId,
        changes: {
          collisionBox: { ...sprite.collisionBox, [field]: num },
        },
      })
    );
  };

  const handlePaletteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updateSpriteSheet({
        id: spriteId,
        changes: { palette: parseInt(e.target.value) as 0 | 1 | 2 | 3 },
      })
    );
  };

  const handleAddState = () => {
    const name = `state_${sprite.states.length + 1}`;
    dispatch(addAnimationState({ id: spriteId, name }));
  };

  const handleRemoveState = (stateId: string) => {
    dispatch(removeAnimationState({ id: spriteId, stateId }));
  };

  const handleAddFrame = (stateId: string) => {
    dispatch(addFrame({ id: spriteId, stateId }));
  };

  const handleRemove = () => {
    dispatch(removeSpriteSheet({ id: spriteId }));
  };

  return (
    <div className="sprite-editor">
      <div className="sprite-editor__header">
        <h3>Sprite Editor</h3>
        <button onClick={handleRemove} className="sprite-editor__remove">
          Delete
        </button>
      </div>

      <div className="sprite-editor__field">
        <label>Name</label>
        <input type="text" value={sprite.name} onChange={handleNameChange} />
      </div>

      <div className="sprite-editor__field">
        <label>File</label>
        <span className="sprite-editor__filename">{sprite.filename}</span>
      </div>

      <div className="sprite-editor__field">
        <label>Sprite Type</label>
        <select value={sprite.type} onChange={handleTypeChange}>
          {(Object.keys(SPRITE_TYPE_LABELS) as SpriteType[]).map((t) => (
            <option key={t} value={t}>
              {SPRITE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="sprite-editor__section">
        <h4>Canvas Size</h4>
        <div className="sprite-editor__row">
          <label>W</label>
          <input
            type="number"
            value={sprite.canvasSize.width}
            onChange={handleCanvasWidthChange}
            min={SPRITE_MIN_CANVAS_PX}
            max={SPRITE_MAX_CANVAS_PX}
            step={8}
          />
          <label>H</label>
          <input
            type="number"
            value={sprite.canvasSize.height}
            onChange={handleCanvasHeightChange}
            min={SPRITE_MIN_CANVAS_PX}
            max={SPRITE_MAX_CANVAS_PX}
            step={8}
          />
        </div>
      </div>

      <div className="sprite-editor__section">
        <h4>Canvas Origin</h4>
        <div className="sprite-editor__row">
          <label>X</label>
          <input
            type="number"
            value={sprite.origin.x}
            onChange={(e) => handleOriginChange('x', e.target.value)}
          />
          <label>Y</label>
          <input
            type="number"
            value={sprite.origin.y}
            onChange={(e) => handleOriginChange('y', e.target.value)}
          />
        </div>
      </div>

      <div className="sprite-editor__section">
        <h4>Collision Bounding Box</h4>
        <div className="sprite-editor__row">
          <label>X</label>
          <input
            type="number"
            value={sprite.collisionBox.x}
            onChange={(e) => handleCollisionChange('x', e.target.value)}
          />
          <label>Y</label>
          <input
            type="number"
            value={sprite.collisionBox.y}
            onChange={(e) => handleCollisionChange('y', e.target.value)}
          />
        </div>
        <div className="sprite-editor__row">
          <label>W</label>
          <input
            type="number"
            value={sprite.collisionBox.width}
            onChange={(e) => handleCollisionChange('width', e.target.value)}
          />
          <label>H</label>
          <input
            type="number"
            value={sprite.collisionBox.height}
            onChange={(e) => handleCollisionChange('height', e.target.value)}
          />
        </div>
      </div>

      <div className="sprite-editor__field">
        <label>Palette (SGDK PAL0-PAL3)</label>
        <select value={sprite.palette} onChange={handlePaletteChange}>
          <option value={0}>PAL0</option>
          <option value={1}>PAL1</option>
          <option value={2}>PAL2</option>
          <option value={3}>PAL3</option>
        </select>
      </div>

      <div className="sprite-editor__tile-count">
        <span className={tileWarning ? 'sprite-editor__tile-warning' : ''}>
          Unique tiles: {tileCount} / {SPRITE_MAX_TILES_PER_SCENE}
        </span>
      </div>

      <div className="sprite-editor__section">
        <div className="sprite-editor__section-header">
          <h4>Animation States</h4>
          <button onClick={handleAddState} className="sprite-editor__add-state">
            + Add State
          </button>
        </div>
        {sprite.states.map((state) => (
          <div
            key={state.id}
            className={`sprite-editor__state${
              state.id === selectedStateId ? ' sprite-editor__state--active' : ''
            }`}
          >
            <div
              className="sprite-editor__state-header"
              onClick={() => onSelectState?.(state.id)}
            >
              <span>{state.name}</span>
              <span className="sprite-editor__frame-count">
                {state.frames.length} frame(s)
              </span>
              {sprite.states.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveState(state.id);
                  }}
                  className="sprite-editor__remove-state"
                >
                  x
                </button>
              )}
            </div>
            {state.id === selectedStateId && (
              <div className="sprite-editor__frames">
                {state.frames.map((frame, idx) => (
                  <div
                    key={frame.id}
                    className={`sprite-editor__frame${
                      frame.id === selectedFrameId
                        ? ' sprite-editor__frame--active'
                        : ''
                    }`}
                    onClick={() => onSelectFrame?.(state.id, frame.id)}
                  >
                    Frame {idx + 1}
                    <span className="sprite-editor__tile-badge">
                      {frame.tiles.length} tile(s)
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => handleAddFrame(state.id)}
                  className="sprite-editor__add-frame"
                >
                  + Frame
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sprite-editor__field">
        <label>Notes</label>
        <textarea
          value={sprite.notes || ''}
          onChange={(e) =>
            dispatch(
              updateSpriteSheet({
                id: spriteId,
                changes: { notes: e.target.value },
              })
            )
          }
          placeholder="Add notes..."
        />
      </div>
    </div>
  );
};

export default SpriteEditor;
