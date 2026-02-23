import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { PrefabData, PrefabType } from './prefabTypes';
import {
  createActorPrefab,
  createTriggerPrefab,
  removePrefab,
  instantiatePrefab,
  getPrefabsByType,
} from './prefabUtils';

interface PrefabNavigatorProps {
  onSelectPrefab?: (prefabId: string) => void;
  selectedPrefabId?: string | null;
}

export const PrefabNavigator: React.FC<PrefabNavigatorProps> = ({
  onSelectPrefab,
  selectedPrefabId,
}) => {
  const dispatch = useAppDispatch();
  const prefabs = useAppSelector(
    (state) => state.project.prefabs as PrefabData[]
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState<PrefabType | 'all'>('all');

  const visiblePrefabs =
    filter === 'all'
      ? prefabs
      : getPrefabsByType(prefabs, filter);

  const handleAddActor = () => {
    const defaultTemplate = {
      name: 'New Actor',
      x: 0,
      y: 0,
      spriteSheetId: '',
      direction: 'right' as const,
      moveType: 'static' as const,
      animationType: 'fixed' as const,
      collisionGroup: '',
      palette: '0' as const,
      script: [],
      notes: '',
    };
    dispatch(createActorPrefab({ template: defaultTemplate }));
    setShowDropdown(false);
  };

  const handleAddTrigger = () => {
    const defaultTemplate = {
      name: 'New Trigger',
      x: 0,
      y: 0,
      width: 2,
      height: 2,
      script: [],
      notes: '',
    };
    dispatch(createTriggerPrefab({ template: defaultTemplate }));
    setShowDropdown(false);
  };

  const handleInstantiate = (
    e: React.MouseEvent,
    prefabId: string,
    sceneId: string
  ) => {
    e.stopPropagation();
    dispatch(instantiatePrefab({ prefabId, sceneId, x: 0, y: 0 }));
  };

  const handleRemove = (e: React.MouseEvent, prefabId: string) => {
    e.stopPropagation();
    dispatch(removePrefab({ prefabId }));
  };

  const actorCount = getPrefabsByType(prefabs, 'actor').length;
  const triggerCount = getPrefabsByType(prefabs, 'trigger').length;

  return (
    <div className="prefab-navigator">
      <div className="prefab-navigator__header">
        <h3>Prefabs</h3>
        <div className="prefab-navigator__add">
          <button
            className="prefab-navigator__add-btn"
            onClick={() => setShowDropdown((v) => !v)}
            title="Add Prefab"
          >
            +
          </button>
          {showDropdown && (
            <div className="prefab-navigator__dropdown">
              <button onClick={handleAddActor}>Actor Prefab</button>
              <button onClick={handleAddTrigger}>Trigger Prefab</button>
            </div>
          )}
        </div>
      </div>

      <div className="prefab-navigator__filter">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({prefabs.length})
        </button>
        <button
          className={filter === 'actor' ? 'active' : ''}
          onClick={() => setFilter('actor')}
        >
          Actors ({actorCount})
        </button>
        <button
          className={filter === 'trigger' ? 'active' : ''}
          onClick={() => setFilter('trigger')}
        >
          Triggers ({triggerCount})
        </button>
      </div>

      <ul className="prefab-navigator__list">
        {visiblePrefabs.length === 0 && (
          <li className="prefab-navigator__empty">
            No prefabs yet. Click + to create one.
          </li>
        )}
        {visiblePrefabs.map((prefab) => (
          <li
            key={prefab.id}
            className={`prefab-navigator__item${
              prefab.id === selectedPrefabId
                ? ' prefab-navigator__item--selected'
                : ''
            }`}
            onClick={() => onSelectPrefab?.(prefab.id)}
          >
            <span className="prefab-navigator__item-icon">
              {prefab.type === 'actor' ? '👤' : '🟥'}
            </span>
            <span className="prefab-navigator__item-name">{prefab.name}</span>
            <div className="prefab-navigator__item-actions">
              <button
                title="Add instance to scene"
                onClick={(e) => handleInstantiate(e, prefab.id, '')}
                className="prefab-navigator__instantiate"
              >
                +
              </button>
              <button
                title="Delete prefab"
                onClick={(e) => handleRemove(e, prefab.id)}
                className="prefab-navigator__delete"
              >
                x
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrefabNavigator;
