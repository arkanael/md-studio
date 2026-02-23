import React from 'react';
import { PlayerSettings } from './playerTypes';
import { SceneType, SCENE_TYPE_LABELS } from '../scenes/sceneTypes';
import { updateDefaultSpriteForSceneType } from './playerUtils';

interface SpriteAsset {
  id: string;
  name: string;
}

interface Props {
  settings: PlayerSettings;
  availableSprites: SpriteAsset[];
  onChange: (updated: PlayerSettings) => void;
}

/**
 * PlayerDefaultSpritesEditor
 *
 * Rendered inside the Settings View (mirrors GB Studio).
 * Shows one sprite-sheet selector per scene type so the user
 * can define the default player sprite for each scene type.
 *
 * Adapted for Mega Drive / SGDK:
 *   - Scene types are the MD-Studio variants (TopDown, Platformer, etc.)
 *   - Sprite sheets must be SGDK-compatible (VDP tile patterns)
 */
const PlayerDefaultSpritesEditor: React.FC<Props> = ({
  settings,
  availableSprites,
  onChange,
}) => {
  // All scene types that can have a default sprite
  const sceneTypes = Object.values(SceneType) as SceneType[];

  const getSpriteForType = (sceneType: SceneType): string => {
    const entry = settings.defaultSprites.find(
      (s) => s.sceneType === sceneType
    );
    return entry?.spriteSheetId ?? '';
  };

  const handleChange = (
    sceneType: SceneType,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onChange(
      updateDefaultSpriteForSceneType(settings, sceneType, e.target.value)
    );
  };

  return (
    <div className="player-default-sprites-editor">
      <h3 className="settings-section-title">Default Player Sprites</h3>
      <p className="settings-section-description">
        Choose the default sprite sheet used for the player in each scene type.
        You can override this per scene in the scene settings.
      </p>

      {sceneTypes.map((sceneType) => (
        <div key={sceneType} className="form-group">
          <label htmlFor={`default-sprite-${sceneType}`}>
            {SCENE_TYPE_LABELS[sceneType]}
          </label>
          <select
            id={`default-sprite-${sceneType}`}
            value={getSpriteForType(sceneType)}
            onChange={(e) => handleChange(sceneType, e)}
          >
            <option value="">-- No Default Sprite --</option>
            {availableSprites.map((sprite) => (
              <option key={sprite.id} value={sprite.id}>
                {sprite.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default PlayerDefaultSpritesEditor;
