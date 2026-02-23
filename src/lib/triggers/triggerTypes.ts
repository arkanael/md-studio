// Trigger Types - SGDK/Mega Drive adaptation of GB Studio triggers
// Triggers are rectangular areas that fire scripts when the player walks over them

export interface ScriptEvent {
  id: string;
  command: string;
  args?: Record<string, unknown>;
}

export interface TriggerData {
  id: string;
  name: string;
  // Position in tiles (Mega Drive scene grid)
  x: number; // 0-30
  y: number; // 0-32
  // Size in tiles
  width: number;  // min 1, max scene width
  height: number; // min 1, max scene height
  // Script to execute when player walks on this trigger
  script: ScriptEvent[];
  notes?: string;
}

export interface TriggerState {
  triggers: TriggerData[];
  selectedTriggerId: string | null;
}

// Mega Drive scene tile limits
export const TRIGGER_MIN_X = 0;
export const TRIGGER_MAX_X = 30;
export const TRIGGER_MIN_Y = 0;
export const TRIGGER_MAX_Y = 32;
export const TRIGGER_MIN_SIZE = 1;
export const TRIGGER_MAX_WIDTH = 32;
export const TRIGGER_MAX_HEIGHT = 32;

export type TriggerResizeHandle =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';
