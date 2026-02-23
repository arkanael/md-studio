import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  ActorData,
  MoveType,
  AnimationType,
  ActorPalette,
} from './actorTypes';
import { updateActor, removeActor } from './actorUtils';

interface ActorEditorProps {
  actorId: string;
  sceneId: string;
}

export const ActorEditor: React.FC<ActorEditorProps> = ({ actorId, sceneId }) => {
  const dispatch = useAppDispatch();
  const actor = useAppSelector((state) =>
    state.project.scenes
      .find((s) => s.id === sceneId)
      ?.actors.find((a) => a.id === actorId)
  );

  if (!actor) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateActor({ sceneId, actorId, changes: { name: e.target.value } }));
  };

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const x = Math.max(0, Math.min(30, parseInt(e.target.value) || 0));
    dispatch(updateActor({ sceneId, actorId, changes: { x } }));
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const y = Math.max(0, Math.min(32, parseInt(e.target.value) || 0));
    dispatch(updateActor({ sceneId, actorId, changes: { y } }));
  };

  const handleSpriteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActor({ sceneId, actorId, changes: { spriteSheetId: e.target.value } }));
  };

  const handleMoveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActor({ sceneId, actorId, changes: { moveType: e.target.value as MoveType } }));
  };

  const handleAnimTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActor({ sceneId, actorId, changes: { animationType: e.target.value as AnimationType } }));
  };

  const handleCollisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateActor({ sceneId, actorId, changes: { collisionGroup: e.target.value } }));
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActor({ sceneId, actorId, changes: { direction: e.target.value as ActorData['direction'] } }));
  };

  const handlePaletteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActor({ sceneId, actorId, changes: { palette: e.target.value as ActorPalette } }));
  };

  const handleRemove = () => {
    dispatch(removeActor({ sceneId, actorId }));
  };

  return (
    <div className="actor-editor">
      <div className="actor-editor__header">
        <h3>Actor</h3>
        <button onClick={handleRemove} className="actor-editor__remove">
          Remove
        </button>
      </div>

      <div className="actor-editor__field">
        <label>Name</label>
        <input
          type="text"
          value={actor.name}
          onChange={handleNameChange}
          placeholder="Actor name"
        />
      </div>

      <div className="actor-editor__field actor-editor__position">
        <label>Position</label>
        <div className="actor-editor__position-inputs">
          <label>X</label>
          <input
            type="number"
            value={actor.x}
            onChange={handleXChange}
            min={0}
            max={30}
          />
          <label>Y</label>
          <input
            type="number"
            value={actor.y}
            onChange={handleYChange}
            min={0}
            max={32}
          />
        </div>
      </div>

      <div className="actor-editor__field">
        <label>Sprite Sheet</label>
        <select value={actor.spriteSheetId} onChange={handleSpriteChange}>
          <option value="">Select sprite...</option>
        </select>
      </div>

      <div className="actor-editor__field">
        <label>Direction</label>
        <select value={actor.direction} onChange={handleDirectionChange}>
          <option value="right">Right</option>
          <option value="left">Left</option>
          <option value="up">Up</option>
          <option value="down">Down</option>
        </select>
      </div>

      <div className="actor-editor__field">
        <label>Movement Type</label>
        <select value={actor.moveType} onChange={handleMoveTypeChange}>
          <option value="static">Static</option>
          <option value="chase">Chase Player</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div className="actor-editor__field">
        <label>Animation Type</label>
        <select value={actor.animationType} onChange={handleAnimTypeChange}>
          <option value="fixed">Fixed</option>
          <option value="animate">Animate</option>
          <option value="movement">Animate if Moving</option>
        </select>
      </div>

      <div className="actor-editor__field">
        <label>Collision Group</label>
        <input
          type="text"
          value={actor.collisionGroup}
          onChange={handleCollisionChange}
          placeholder="Collision group"
        />
      </div>

      <div className="actor-editor__field">
        <label>Palette</label>
        <select value={actor.palette} onChange={handlePaletteChange}>
          <option value="0">Palette 0</option>
          <option value="1">Palette 1</option>
          <option value="2">Palette 2</option>
          <option value="3">Palette 3</option>
        </select>
      </div>

      <div className="actor-editor__field">
        <label>Notes</label>
        <textarea
          value={actor.notes || ''}
          onChange={(e) =>
            dispatch(updateActor({ sceneId, actorId, changes: { notes: e.target.value } }))
          }
          placeholder="Add notes..."
        />
      </div>
    </div>
  );
};

export default ActorEditor;
