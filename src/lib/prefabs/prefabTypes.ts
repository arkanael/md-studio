// Prefab Types - SGDK/Mega Drive adaptation of GB Studio prefabs
// Prefabs are reusable templates for Actors and Triggers

import { ActorData } from '../actors/actorTypes';
import { TriggerData } from '../triggers/triggerTypes';

export type PrefabType = 'actor' | 'trigger';

// Overrides: a partial record of fields that differ from the prefab template
export type ActorOverrides = Partial<Omit<ActorData, 'id'>>;
export type TriggerOverrides = Partial<Omit<TriggerData, 'id'>>;

export interface ActorPrefab {
  id: string;
  type: 'actor';
  name: string;
  // The canonical template data
  template: Omit<ActorData, 'id'>;
  notes?: string;
}

export interface TriggerPrefab {
  id: string;
  type: 'trigger';
  name: string;
  // The canonical template data
  template: Omit<TriggerData, 'id'>;
  notes?: string;
}

export type PrefabData = ActorPrefab | TriggerPrefab;

// An instance is a placed prefab in a scene with optional per-field overrides
export interface PrefabInstance {
  id: string;
  prefabId: string;
  sceneId: string;
  // Position in scene (always per-instance)
  x: number;
  y: number;
  // Per-field overrides — only fields listed here differ from the prefab template
  overrides: ActorOverrides | TriggerOverrides;
  // Whether this instance has been unpacked (no longer linked to prefab)
  unpacked: boolean;
}

export interface PrefabState {
  prefabs: PrefabData[];
  instances: PrefabInstance[];
  selectedPrefabId: string | null;
}
