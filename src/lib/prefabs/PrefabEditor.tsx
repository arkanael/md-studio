import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { PrefabData, PrefabInstance } from './prefabTypes';
import {
  updatePrefab,
  removePrefab,
  overrideInstanceField,
  revertInstanceField,
  revertAllOverrides,
  applyOverridesToPrefab,
  unpackInstance,
  resolveInstance,
} from './prefabUtils';

interface PrefabEditorProps {
  prefabId: string;
}

export const PrefabEditor: React.FC<PrefabEditorProps> = ({ prefabId }) => {
  const dispatch = useAppDispatch();
  const prefab = useAppSelector((state) =>
    state.project.prefabs.find((p: PrefabData) => p.id === prefabId)
  );
  const instances = useAppSelector((state) =>
    state.project.prefabInstances.filter(
      (i: PrefabInstance) => i.prefabId === prefabId
    )
  );

  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  if (!prefab) return null;

  const selectedInstance = instances.find(
    (i: PrefabInstance) => i.id === selectedInstanceId
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePrefab({ prefabId, changes: { name: e.target.value } }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updatePrefab({ prefabId, changes: { notes: e.target.value } }));
  };

  const handleRemovePrefab = () => {
    dispatch(removePrefab({ prefabId }));
  };

  const handleApplyOverrides = (instanceId: string) => {
    dispatch(applyOverridesToPrefab({ prefabId, instanceId }));
  };

  const handleRevertAll = (instanceId: string) => {
    dispatch(revertAllOverrides({ instanceId }));
  };

  const handleUnpack = (instanceId: string) => {
    dispatch(unpackInstance({ instanceId }));
  };

  const overriddenFields = selectedInstance
    ? Object.keys(selectedInstance.overrides)
    : [];

  return (
    <div className="prefab-editor">
      <div className="prefab-editor__header">
        <span className="prefab-editor__type-badge">
          {prefab.type === 'actor' ? 'Actor Prefab' : 'Trigger Prefab'}
        </span>
        <button onClick={handleRemovePrefab} className="prefab-editor__remove">
          Delete Prefab
        </button>
      </div>

      <div className="prefab-editor__field">
        <label>Name</label>
        <input
          type="text"
          value={prefab.name}
          onChange={handleNameChange}
          placeholder="Prefab name"
        />
      </div>

      <div className="prefab-editor__template">
        <h4>Template</h4>
        <pre className="prefab-editor__template-preview">
          {JSON.stringify(prefab.template, null, 2)}
        </pre>
      </div>

      <div className="prefab-editor__instances">
        <h4>Instances ({instances.length})</h4>
        {instances.length === 0 ? (
          <p className="prefab-editor__no-instances">
            No instances placed. Click + next to the prefab in the Navigator to add one.
          </p>
        ) : (
          <ul className="prefab-editor__instance-list">
            {instances.map((inst: PrefabInstance) => (
              <li
                key={inst.id}
                className={`prefab-editor__instance${
                  inst.id === selectedInstanceId
                    ? ' prefab-editor__instance--selected'
                    : ''
                }${inst.unpacked ? ' prefab-editor__instance--unpacked' : ''}`}
                onClick={() =>
                  setSelectedInstanceId(
                    inst.id === selectedInstanceId ? null : inst.id
                  )
                }
              >
                <span>Scene: {inst.sceneId || '(unplaced)'}</span>
                <span>X: {inst.x}, Y: {inst.y}</span>
                {Object.keys(inst.overrides).length > 0 && (
                  <span className="prefab-editor__override-badge">
                    {Object.keys(inst.overrides).length} override(s)
                  </span>
                )}
                {inst.unpacked && (
                  <span className="prefab-editor__unpacked-badge">Unpacked</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedInstance && !selectedInstance.unpacked && (
        <div className="prefab-editor__instance-actions">
          <h4>Instance Actions</h4>
          {overriddenFields.length > 0 && (
            <div className="prefab-editor__overrides">
              <p>Overridden fields:</p>
              <ul>
                {overriddenFields.map((field) => (
                  <li key={field} className="prefab-editor__override-field">
                    <span>{field}</span>
                    <button
                      onClick={() =>
                        dispatch(
                          revertInstanceField({
                            instanceId: selectedInstance.id,
                            field,
                          })
                        )
                      }
                      className="prefab-editor__revert-field"
                    >
                      Revert
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleApplyOverrides(selectedInstance.id)}
                className="prefab-editor__apply-all"
              >
                Apply All to Prefab
              </button>
              <button
                onClick={() => handleRevertAll(selectedInstance.id)}
                className="prefab-editor__revert-all"
              >
                Revert All
              </button>
            </div>
          )}
          <button
            onClick={() => handleUnpack(selectedInstance.id)}
            className="prefab-editor__unpack"
          >
            Unpack Instance
          </button>
        </div>
      )}

      <div className="prefab-editor__field">
        <label>Notes</label>
        <textarea
          value={prefab.notes || ''}
          onChange={handleNotesChange}
          placeholder="Add notes..."
        />
      </div>
    </div>
  );
};

export default PrefabEditor;
