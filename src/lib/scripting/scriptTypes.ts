// Script Types - SGDK/Mega Drive adaptation of GB Studio Scripting Events
// Docs: https://www.gbstudio.dev/docs/scripting/
//
// GB Studio scripts: scenes, actors, triggers each have script tabs.
// Mega Drive adaptation: maps GB Studio event types to SGDK C API calls.

// ---- Script owner types ----

/** What kind of object owns this script */
export type ScriptOwnerType = 'scene' | 'actor' | 'trigger';

// ---- Scene script types (GB Studio: On Init, On Player Hit) ----
export type SceneScriptType = 'onInit' | 'onPlayerHit';

// ---- Actor script types (GB Studio: On Init, On Interact, On Hit, On Update) ----
export type ActorScriptType = 'onInit' | 'onInteract' | 'onHit' | 'onUpdate';

// ---- Trigger script types (GB Studio: On Enter, On Leave) ----
export type TriggerScriptType = 'onEnter' | 'onLeave';

export type ScriptType = SceneScriptType | ActorScriptType | TriggerScriptType;

/** Human-readable labels for each script type */
export const SCRIPT_TYPE_LABELS: Record<ScriptType, string> = {
  onInit: 'On Init',
  onPlayerHit: 'On Player Hit',
  onInteract: 'On Interact',
  onHit: 'On Hit',
  onUpdate: 'On Update',
  onEnter: 'On Enter',
  onLeave: 'On Leave',
};

// ---- Event categories (from GB Studio event menu) ----
export type ScriptEventCategory =
  | 'text'
  | 'control_flow'
  | 'math'
  | 'variables'
  | 'scene'
  | 'actor'
  | 'camera'
  | 'sound'
  | 'timer'
  | 'screen'
  | 'miscellaneous';

export const SCRIPT_EVENT_CATEGORY_LABELS: Record<ScriptEventCategory, string> = {
  text: 'Text',
  control_flow: 'Control Flow',
  math: 'Math',
  variables: 'Variables',
  scene: 'Scene',
  actor: 'Actor',
  camera: 'Camera',
  sound: 'Sound',
  timer: 'Timer',
  screen: 'Screen',
  miscellaneous: 'Miscellaneous',
};

// ---- Script event parameter types ----
export type ScriptEventParamType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'variable'
  | 'actor'
  | 'scene'
  | 'direction'
  | 'spriteSheet'
  | 'music'
  | 'sound'
  | 'palette'
  | 'expression'
  | 'select';

/** A parameter definition for a script event */
export interface ScriptEventParamDef {
  key: string;
  label: string;
  type: ScriptEventParamType;
  /** Default value */
  defaultValue?: string | number | boolean;
  /** Options list for 'select' type */
  options?: Array<{ value: string; label: string }>;
  /** Minimum value for 'number' type */
  min?: number;
  /** Maximum value for 'number' type */
  max?: number;
}

/** Definition of a scripting event type (what can be added) */
export interface ScriptEventDef {
  id: string;
  name: string;
  category: ScriptEventCategory;
  description?: string;
  /** Parameters the user can configure */
  params: ScriptEventParamDef[];
  /** Whether the event has a child script block (e.g. If/Else) */
  hasChildren?: boolean;
  /** Whether children are grouped as true/false branches */
  hasBranches?: boolean;
  /** SGDK C API call equivalent (for reference) */
  sgdkEquivalent?: string;
}

/** An instance of a scripting event inside a script */
export interface ScriptEvent {
  id: string;
  /** Which ScriptEventDef this refers to */
  eventType: string;
  /** User-configured parameter values */
  params: Record<string, string | number | boolean>;
  /** Child events (for control flow blocks like If, Group) */
  children?: ScriptEvent[];
  /** True branch children (for If/Else) */
  trueChildren?: ScriptEvent[];
  /** False branch children (for If/Else) */
  falseChildren?: ScriptEvent[];
  /** Whether this event is disabled */
  disabled?: boolean;
  /** Whether this event is selected (for multi-select copy/paste) */
  selected?: boolean;
}

/** A complete script (list of events) attached to a scene/actor/trigger */
export interface Script {
  id: string;
  type: ScriptType;
  ownerId: string;
  ownerType: ScriptOwnerType;
  events: ScriptEvent[];
}

/** Clipboard state for copy/paste of events */
export interface ScriptClipboard {
  events: ScriptEvent[];
}

/** Script editor UI state */
export interface ScriptEditorState {
  /** Currently selected script tab */
  activeScriptType: ScriptType | null;
  /** IDs of selected events for multi-select */
  selectedEventIds: string[];
  /** Whether the event add menu is open */
  eventMenuOpen: boolean;
  /** Filter text in the event menu */
  eventMenuFilter: string;
  /** Clipboard for copy/paste */
  clipboard: ScriptClipboard | null;
  /** IDs of favourite event types */
  favouriteEventIds: string[];
}
