import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  Background,
  BackgroundColorMode,
  MDBGPlane,
  MD_BG_PLANES,
  MD_PLANE_WIDTHS_TILES,
  MD_PLANE_HEIGHTS_TILES,
} from './backgroundTypes';
import {
  updateBackground,
  validateBackground,
  getMonoOverrideFilename,
  getPlaneDimensionLabel,
} from './backgroundUtils';

interface BackgroundEditorProps {
  backgroundId: string;
}

const COLOR_MODE_LABELS: Record<BackgroundColorMode, string> = {
  manual: 'Manual (4-color GB palette)',
  automatic: 'Automatic (full color, up to 8 palettes)',
};

const SCROLL_MODE_LABELS = {
  full: 'Full Screen',
  tile: 'Per Tile',
  line: 'Per Line (raster)',
};

const BackgroundEditor: FC<BackgroundEditorProps> = ({ backgroundId }) => {
  const dispatch = useAppDispatch();

  const bg = useAppSelector(
    (state) =>
      state.project.present.backgrounds.entities[backgroundId] as
        | Background
        | undefined
  );

  if (!bg) return null;

  const validation = validateBackground(bg);

  const handleChange = (changes: Partial<Background>) => {
    dispatch(updateBackground({ id: backgroundId, changes }));
  };

  const monoOverrideName = getMonoOverrideFilename(bg.filename);

  return (
    <div className="background-editor">
      {/* Header */}
      <div className="background-editor__header">
        <h3 className="background-editor__title">{bg.name}</h3>
        {!validation.valid && (
          <span className="background-editor__badge background-editor__badge--error">
            {validation.errors.length} error(s)
          </span>
        )}
        {validation.warnings.length > 0 && (
          <span className="background-editor__badge background-editor__badge--warn">
            {validation.warnings.length} warning(s)
          </span>
        )}
      </div>

      {/* Name */}
      <div className="background-editor__field">
        <label>Name</label>
        <input
          type="text"
          value={bg.name}
          onChange={(e) => handleChange({ name: e.target.value })}
          placeholder="Background name..."
        />
      </div>

      {/* Filename */}
      <div className="background-editor__field">
        <label>Image File</label>
        <input
          type="text"
          value={bg.filename}
          onChange={(e) => handleChange({ filename: e.target.value })}
          placeholder="assets/backgrounds/my-bg.png"
        />
        <span className="background-editor__hint">
          PNG file from assets/backgrounds/
        </span>
      </div>

      {/* Color Mode */}
      <div className="background-editor__field">
        <label>Color Mode</label>
        <select
          value={bg.colorMode}
          onChange={(e) =>
            handleChange({ colorMode: e.target.value as BackgroundColorMode })
          }
        >
          {(Object.keys(COLOR_MODE_LABELS) as BackgroundColorMode[]).map(
            (mode) => (
              <option key={mode} value={mode}>
                {COLOR_MODE_LABELS[mode]}
              </option>
            )
          )}
        </select>
      </div>

      {/* Monochrome override */}
      {bg.colorMode === 'automatic' && (
        <div className="background-editor__field">
          <label>
            <input
              type="checkbox"
              checked={bg.hasMonoOverride}
              onChange={(e) =>
                handleChange({ hasMonoOverride: e.target.checked })
              }
            />
            Provide Monochrome Override
          </label>
          {bg.hasMonoOverride && bg.filename && (
            <span className="background-editor__hint">
              Override file: {monoOverrideName}
            </span>
          )}
        </div>
      )}

      {/* Plane Selection */}
      <div className="background-editor__field">
        <label>VDP Scroll Plane</label>
        <select
          value={bg.plane}
          onChange={(e) => handleChange({ plane: e.target.value as MDBGPlane })}
        >
          {MD_BG_PLANES.map((p) => (
            <option key={p} value={p}>
              Plane {p}
            </option>
          ))}
        </select>
        <span className="background-editor__hint">
          Plane A = foreground, Plane B = background, Window = HUD
        </span>
      </div>

      {/* Plane Dimensions */}
      <div className="background-editor__field">
        <label>Plane Width (tiles)</label>
        <select
          value={bg.planeDimensions.widthTiles}
          onChange={(e) =>
            handleChange({
              planeDimensions: {
                ...bg.planeDimensions,
                widthTiles: parseInt(e.target.value, 10) as 32 | 64 | 128,
              },
            })
          }
        >
          {MD_PLANE_WIDTHS_TILES.map((w) => (
            <option key={w} value={w}>
              {w} tiles ({w * 8}px)
            </option>
          ))}
        </select>
      </div>

      <div className="background-editor__field">
        <label>Plane Height (tiles)</label>
        <select
          value={bg.planeDimensions.heightTiles}
          onChange={(e) =>
            handleChange({
              planeDimensions: {
                ...bg.planeDimensions,
                heightTiles: parseInt(e.target.value, 10) as 32 | 64 | 128,
              },
            })
          }
        >
          {MD_PLANE_HEIGHTS_TILES.map((h) => (
            <option key={h} value={h}>
              {h} tiles ({h * 8}px)
            </option>
          ))}
        </select>
        <span className="background-editor__hint">
          {getPlaneDimensionLabel(bg.planeDimensions)}
        </span>
      </div>

      {/* Scroll Configuration */}
      <div className="background-editor__section">
        <h4>Scroll Settings</h4>

        <div className="background-editor__field">
          <label>Scroll Mode</label>
          <select
            value={bg.scroll.scrollMode}
            onChange={(e) =>
              handleChange({
                scroll: {
                  ...bg.scroll,
                  scrollMode: e.target.value as 'full' | 'tile' | 'line',
                },
              })
            }
          >
            {(Object.keys(SCROLL_MODE_LABELS) as Array<keyof typeof SCROLL_MODE_LABELS>).map(
              (mode) => (
                <option key={mode} value={mode}>
                  {SCROLL_MODE_LABELS[mode]}
                </option>
              )
            )}
          </select>
        </div>

        <div className="background-editor__field">
          <label>Scroll X</label>
          <input
            type="number"
            value={bg.scroll.scrollX}
            onChange={(e) =>
              handleChange({
                scroll: { ...bg.scroll, scrollX: parseInt(e.target.value, 10) || 0 },
              })
            }
          />
        </div>

        <div className="background-editor__field">
          <label>Scroll Y</label>
          <input
            type="number"
            value={bg.scroll.scrollY}
            onChange={(e) =>
              handleChange({
                scroll: { ...bg.scroll, scrollY: parseInt(e.target.value, 10) || 0 },
              })
            }
          />
        </div>
      </div>

      {/* Validation panel */}
      <div className="background-editor__validation">
        <div className="background-editor__stats">
          <span>Unique tiles: {validation.uniqueTileCount} / 1024</span>
          <span>Palettes: {validation.paletteCount} / 4</span>
          <span>VRAM: {validation.vramBytes} bytes</span>
        </div>

        {validation.errors.map((err, i) => (
          <div key={i} className="background-editor__error">
            {err}
          </div>
        ))}
        {validation.warnings.map((warn, i) => (
          <div key={i} className="background-editor__warning">
            {warn}
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="background-editor__field">
        <label>Notes</label>
        <textarea
          value={bg.notes || ''}
          onChange={(e) => handleChange({ notes: e.target.value })}
          placeholder="Add notes..."
        />
      </div>
    </div>
  );
};

export default BackgroundEditor;
