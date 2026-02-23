import React from 'react';
import {
  PlayerSettings,
  PlayerDirection,
} from './playerTypes';
import {
  updatePlayerStartPosition,
} from './playerUtils';

interface Props {
  settings: PlayerSettings;
  sceneNames: Record<string, string>; // sceneId -> display name
  onChange: (updated: PlayerSettings) => void;
}

const DIRECTIONS: PlayerDirection[] = ['up', 'down', 'left', 'right'];

const DIRECTION_LABELS: Record<PlayerDirection, string> = {
  up:    'Up',
  down:  'Down',
  left:  'Left',
  right: 'Right',
};

/**
 * PlayerStartPositionEditor
 *
 * Sidebar panel shown when clicking the background between scenes.
 * Mirrors GB Studio's Project Editor sidebar:
 *   - Select starting scene (dropdown)
 *   - Set X / Y tile coordinates (number inputs)
 *   - Set initial facing direction (select)
 *
 * Adapted for Mega Drive / SGDK:
 *   - Tile coordinates relative to 40x28 tile grid (320x224 px at 8x8 tiles)
 */
const PlayerStartPositionEditor: React.FC<Props> = ({
  settings,
  sceneNames,
  onChange,
}) => {
  const { startPosition } = settings;

  const handleSceneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(updatePlayerStartPosition(settings, { sceneId: e.target.value }));
  };

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const x = Math.max(0, parseInt(e.target.value, 10) || 0);
    onChange(updatePlayerStartPosition(settings, { x }));
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const y = Math.max(0, parseInt(e.target.value, 10) || 0);
    onChange(updatePlayerStartPosition(settings, { y }));
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(
      updatePlayerStartPosition(settings, {
        direction: e.target.value as PlayerDirection,
      })
    );
  };

  return (
    <div className="player-start-position-editor">
      <h3 className="sidebar-title">Player Start Position</h3>

      {/* Scene selector */}
      <div className="form-group">
        <label htmlFor="player-start-scene">Starting Scene</label>
        <select
          id="player-start-scene"
          value={startPosition.sceneId}
          onChange={handleSceneChange}
        >
          <option value="">-- Select Scene --</option>
          {Object.entries(sceneNames).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* X / Y tile position */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="player-start-x">X (tiles)</label>
          <input
            id="player-start-x"
            type="number"
            min={0}
            max={39} /* Mega Drive: 40 tiles wide */
            value={startPosition.x}
            onChange={handleXChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="player-start-y">Y (tiles)</label>
          <input
            id="player-start-y"
            type="number"
            min={0}
            max={27} /* Mega Drive: 28 tiles tall */
            value={startPosition.y}
            onChange={handleYChange}
          />
        </div>
      </div>

      {/* Direction selector */}
      <div className="form-group">
        <label htmlFor="player-start-direction">Facing Direction</label>
        <select
          id="player-start-direction"
          value={startPosition.direction}
          onChange={handleDirectionChange}
        >
          {DIRECTIONS.map((dir) => (
            <option key={dir} value={dir}>
              {DIRECTION_LABELS[dir]}
            </option>
          ))}
        </select>
      </div>

      {/* Hint */}
      <p className="form-hint">
        Tip: You can also drag the player icon in the world view,
        or right-click a scene to set the start position.
      </p>
    </div>
  );
};

export default PlayerStartPositionEditor;
