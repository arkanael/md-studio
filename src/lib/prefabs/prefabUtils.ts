import {
  PrefabData,
  PrefabInstance,
  ActorPrefab,
  TriggerPrefab,
  ActorOverrides,
  TriggerOverrides,
  PrefabType,
} from './prefabTypes';
import { ActorData } from '../actors/actorTypes';
import { TriggerData } from '../triggers/triggerTypes';

let prefabIdCounter = 0;
let instanceIdCounter = 0;

// --- Prefab CRUD ---

export const createActorPrefab = (
  template: Omit<ActorData, 'id'>,
  name?: string
): ActorPrefab => ({
  id: `prefab_${Date.now()}_${prefabIdCounter++}`,
  type: 'actor',
  name: name ?? `Actor Prefab ${prefabIdCounter}`,
  template,
  notes: '',
});

export const createTriggerPrefab = (
  template: Omit<TriggerData, 'id'>,
  name?: string
): TriggerPrefab => ({
  id: `prefab_${Date.now()}_${prefabIdCounter++}`,
  type: 'trigger',
  name: name ?? `Trigger Prefab ${prefabIdCounter}`,
  template,
  notes: '',
});

export const updatePrefab = (
  prefabs: PrefabData[],
  prefabId: string,
  changes: Partial<PrefabData>
): PrefabData[] =>
  prefabs.map((p) => (p.id === prefabId ? { ...p, ...changes } : p));

export const removePrefab = (
  prefabs: PrefabData[],
  prefabId: string
): PrefabData[] => prefabs.filter((p) => p.id !== prefabId);

export const getPrefabById = (
  prefabs: PrefabData[],
  prefabId: string
): PrefabData | undefined => prefabs.find((p) => p.id === prefabId);

export const getPrefabsByType = (
  prefabs: PrefabData[],
  type: PrefabType
): PrefabData[] => prefabs.filter((p) => p.type === type);

// --- Instance management ---

export const instantiatePrefab = (
  prefabId: string,
  sceneId: string,
  x: number,
  y: number
): PrefabInstance => ({
  id: `instance_${Date.now()}_${instanceIdCounter++}`,
  prefabId,
  sceneId,
  x,
  y,
  overrides: {},
  unpacked: false,
});

export const updateInstance = (
  instances: PrefabInstance[],
  instanceId: string,
  changes: Partial<PrefabInstance>
): PrefabInstance[] =>
  instances.map((i) => (i.id === instanceId ? { ...i, ...changes } : i));

export const removeInstance = (
  instances: PrefabInstance[],
  instanceId: string
): PrefabInstance[] => instances.filter((i) => i.id !== instanceId);

export const getInstancesForPrefab = (
  instances: PrefabInstance[],
  prefabId: string
): PrefabInstance[] => instances.filter((i) => i.prefabId === prefabId);

export const getInstancesForScene = (
  instances: PrefabInstance[],
  sceneId: string
): PrefabInstance[] => instances.filter((i) => i.sceneId === sceneId);

// --- Override management ---

export const overrideInstanceField = (
  instance: PrefabInstance,
  field: string,
  value: unknown
): PrefabInstance => ({
  ...instance,
  overrides: { ...instance.overrides, [field]: value },
});

export const revertInstanceField = (
  instance: PrefabInstance,
  field: string
): PrefabInstance => {
  const next = { ...instance.overrides } as Record<string, unknown>;
  delete next[field];
  return { ...instance, overrides: next as ActorOverrides | TriggerOverrides };
};

export const revertAllOverrides = (
  instance: PrefabInstance
): PrefabInstance => ({ ...instance, overrides: {} });

// Apply overrides: promote instance overrides back onto the prefab template
export const applyOverridesToPrefab = (
  prefabs: PrefabData[],
  instance: PrefabInstance
): PrefabData[] =>
  prefabs.map((p) => {
    if (p.id !== instance.prefabId) return p;
    return {
      ...p,
      template: { ...p.template, ...instance.overrides },
    } as PrefabData;
  });

// Unpack: break link — instance becomes standalone (unpacked: true)
export const unpackInstance = (
  instance: PrefabInstance
): PrefabInstance => ({ ...instance, unpacked: true, overrides: {} });

// Resolve: merge prefab template with instance overrides to get effective data
export const resolveInstance = (
  prefabs: PrefabData[],
  instance: PrefabInstance
): (Omit<ActorData, 'id'> | Omit<TriggerData, 'id'>) & { id: string } | null => {
  const prefab = getPrefabById(prefabs, instance.prefabId);
  if (!prefab) return null;
  return {
    ...prefab.template,
    ...instance.overrides,
    id: instance.id,
    x: instance.x,
    y: instance.y,
  } as (Omit<ActorData, 'id'> | Omit<TriggerData, 'id'>) & { id: string };
};

// Convert an existing actor to a prefab
export const convertActorToPrefab = (
  actor: ActorData,
  prefabName?: string
): { prefab: ActorPrefab; instance: PrefabInstance } => {
  const { id, x, y, ...template } = actor;
  const prefab = createActorPrefab(template, prefabName ?? actor.name);
  const instance = instantiatePrefab(prefab.id, '', x, y);
  return { prefab, instance };
};

// Convert an existing trigger to a prefab
export const convertTriggerToPrefab = (
  trigger: TriggerData,
  prefabName?: string
): { prefab: TriggerPrefab; instance: PrefabInstance } => {
  const { id, x, y, ...template } = trigger;
  const prefab = createTriggerPrefab(template, prefabName ?? trigger.name);
  const instance = instantiatePrefab(prefab.id, '', x, y);
  return { prefab, instance };
};
