// Scripting module — MD Studio (adapted from GB Studio)
// All scripting types, utilities and React components.

// ─── Types ──────────────────────────────────────────────────────────────────
export type {
  ScriptEvent,
  ScriptEventArgs,
  ScriptEventDef,
  ScriptEventFieldDef,
  ScriptEventGroup,
  ScriptContext,
  ScriptVariable,
  ScriptTriggerType,
  ScriptBank,
} from './scriptTypes';

// ─── Utilities ──────────────────────────────────────────────────────────────
export {
  createEvent,
  removeEvent,
  moveEventUp,
  moveEventDown,
  flattenEvents,
  countEvents,
  cloneEvent,
  disableEvent,
  enableEvent,
  toggleEventDisabled,
  getDefaultArgs,
  validateEvent,
  scriptToString,
} from './scriptUtils';

// ─── React Components ─────────────────────────────────────────────────────
export { ScriptEditor } from './ScriptEditor';
export { ScriptEventBlock } from './ScriptEventBlock';
export { ScriptEventForm } from './ScriptEventForm';

// ─── Default exports (convenience re-exports) ──────────────────────────────
export { default as ScriptEditorDefault } from './ScriptEditor';
export { default as ScriptEventBlockDefault } from './ScriptEventBlock';
export { default as ScriptEventFormDefault } from './ScriptEventForm';
