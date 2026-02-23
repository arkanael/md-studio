import {
  TriggerData,
  ScriptEvent,
  TRIGGER_MIN_X,
  TRIGGER_MAX_X,
  TRIGGER_MIN_Y,
  TRIGGER_MAX_Y,
  TRIGGER_MIN_SIZE,
  TRIGGER_MAX_WIDTH,
  TRIGGER_MAX_HEIGHT,
} from './triggerTypes';

let triggerIdCounter = 0;

export const createTrigger = (partial: Partial<TriggerData> = {}): TriggerData => ({
  id: `trigger_${Date.now()}_${triggerIdCounter++}`,
  name: `Trigger ${triggerIdCounter}`,
  x: 0,
  y: 0,
  width: 2,
  height: 2,
  script: [],
  notes: '',
  ...partial,
});

export const updateTrigger = (
  triggers: TriggerData[],
  triggerId: string,
  changes: Partial<TriggerData>
): TriggerData[] =>
  triggers.map((t) =>
    t.id === triggerId ? { ...t, ...changes } : t
  );

export const removeTrigger = (
  triggers: TriggerData[],
  triggerId: string
): TriggerData[] => triggers.filter((t) => t.id !== triggerId);

export const getTriggerById = (
  triggers: TriggerData[],
  triggerId: string
): TriggerData | undefined => triggers.find((t) => t.id === triggerId);

export const validateTriggerBounds = (
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number; width: number; height: number } => ({
  x: Math.max(TRIGGER_MIN_X, Math.min(TRIGGER_MAX_X, x)),
  y: Math.max(TRIGGER_MIN_Y, Math.min(TRIGGER_MAX_Y, y)),
  width: Math.max(TRIGGER_MIN_SIZE, Math.min(TRIGGER_MAX_WIDTH, width)),
  height: Math.max(TRIGGER_MIN_SIZE, Math.min(TRIGGER_MAX_HEIGHT, height)),
});

export const addScriptEvent = (
  trigger: TriggerData,
  event: ScriptEvent
): TriggerData => ({
  ...trigger,
  script: [...trigger.script, event],
});

export const removeScriptEvent = (
  trigger: TriggerData,
  eventId: string
): TriggerData => ({
  ...trigger,
  script: trigger.script.filter((e) => e.id !== eventId),
});

export const updateScriptEvent = (
  trigger: TriggerData,
  eventId: string,
  changes: Partial<ScriptEvent>
): TriggerData => ({
  ...trigger,
  script: trigger.script.map((e) =>
    e.id === eventId ? { ...e, ...changes } : e
  ),
});

export const getTriggersAtPosition = (
  triggers: TriggerData[],
  tileX: number,
  tileY: number
): TriggerData[] =>
  triggers.filter(
    (t) =>
      tileX >= t.x &&
      tileX < t.x + t.width &&
      tileY >= t.y &&
      tileY < t.y + t.height
  );
