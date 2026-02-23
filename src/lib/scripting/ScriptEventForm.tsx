import React, { useId } from 'react';
import { ScriptEvent, ScriptEventDef } from './scriptTypes';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScriptEventFormProps {
  event: ScriptEvent;
  eventDef: ScriptEventDef;
  onChange: (updated: ScriptEvent) => void;
}

// ─── Field shared styles ──────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: '#13131f',
  border: '1px solid #333',
  borderRadius: 3,
  color: '#ddd',
  fontSize: 12,
  padding: '2px 6px',
  flex: 1,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#888',
  minWidth: 90,
  userSelect: 'none',
};

// ─── Individual field renderers ───────────────────────────────────────────────

type FieldDef = ScriptEventDef['fields'][number];

function renderField(
  field: FieldDef,
  value: unknown,
  onFieldChange: (key: string, val: unknown) => void,
  formId: string,
): React.ReactNode {
  const id = `${formId}_${field.key}`;

  switch (field.type) {
    // ---- text / multiline ---------------------------------------------------
    case 'text':
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <label htmlFor={id} style={labelStyle}>{field.label ?? field.key}</label>
          <input
            id={id}
            type="text"
            style={inputStyle}
            value={String(value ?? '')}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
          />
        </div>
      );

    case 'textarea':
      return (
        <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
          <label htmlFor={id} style={labelStyle}>{field.label ?? field.key}</label>
          <textarea
            id={id}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
            value={String(value ?? '')}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
          />
        </div>
      );

    // ---- number -------------------------------------------------------------
    case 'number': {
      const min = (field as FieldDef & { min?: number }).min;
      const max = (field as FieldDef & { max?: number }).max;
      const step = (field as FieldDef & { step?: number }).step ?? 1;
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <label htmlFor={id} style={labelStyle}>{field.label ?? field.key}</label>
          <input
            id={id}
            type="number"
            style={{ ...inputStyle, width: 80 }}
            value={Number(value ?? 0)}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onFieldChange(field.key, Number(e.target.value))}
          />
        </div>
      );
    }

    // ---- checkbox -----------------------------------------------------------
    case 'checkbox':
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onFieldChange(field.key, e.target.checked)}
          />
          <label htmlFor={id} style={{ ...labelStyle, minWidth: 'auto', cursor: 'pointer' }}>
            {field.label ?? field.key}
          </label>
        </div>
      );

    // ---- select -------------------------------------------------------------
    case 'select': {
      const options =
        (field as FieldDef & { options?: Array<[string, string]> }).options ?? [];
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <label htmlFor={id} style={labelStyle}>{field.label ?? field.key}</label>
          <select
            id={id}
            style={inputStyle}
            value={String(value ?? '')}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
          >
            {options.map(([v, lbl]) => (
              <option key={v} value={v}>{lbl}</option>
            ))}
          </select>
        </div>
      );
    }

    // ---- divider / label (structural) --------------------------------------
    case 'label':
      return (
        <div
          key={field.key}
          style={{
            fontSize: 11,
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginTop: 8,
            marginBottom: 2,
            borderBottom: '1px solid #2a2a3a',
            paddingBottom: 2,
          }}
        >
          {field.label ?? field.key}
        </div>
      );

    // ---- variable picker (name / id input) ---------------------------------
    case 'variable':
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <label htmlFor={id} style={labelStyle}>{field.label ?? field.key}</label>
          <input
            id={id}
            type="text"
            placeholder="variable"
            style={{ ...inputStyle, fontFamily: 'monospace' }}
            value={String(value ?? '')}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
          />
        </div>
      );

    // ---- actor / scene / sprite picker (id text for now) -------------------
    case 'actor':
    case 'scene':
    case 'sprite':
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <label htmlFor={id} style={labelStyle}>{field.label ?? field.key}</label>
          <input
            id={id}
            type="text"
            placeholder={field.type}
            style={{ ...inputStyle, fontFamily: 'monospace' }}
            value={String(value ?? '')}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
          />
        </div>
      );

    // ---- direction ----------------------------------------------------------
    case 'direction': {
      const dirs: Array<[string, string]> = [
        ['up', 'Up'],
        ['down', 'Down'],
        ['left', 'Left'],
        ['right', 'Right'],
      ];
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <label htmlFor={id} style={labelStyle}>{field.label ?? field.key}</label>
          <select
            id={id}
            style={inputStyle}
            value={String(value ?? 'down')}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
          >
            {dirs.map(([v, lbl]) => <option key={v} value={v}>{lbl}</option>)}
          </select>
        </div>
      );
    }

    // ---- color --------------------------------------------------------------
    case 'color':
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <label htmlFor={id} style={labelStyle}>{field.label ?? field.key}</label>
          <input
            id={id}
            type="color"
            style={{ width: 40, height: 24, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
            value={String(value ?? '#000000')}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
          />
        </div>
      );

    // ---- sub-scripts (rendered by parent ScriptEventBlock) -----------------
    case 'events':
      return null;

    // ---- fallback -----------------------------------------------------------
    default:
      return (
        <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={labelStyle}>{field.label ?? field.key}:</span>
          <span style={{ fontSize: 12, color: '#aaa' }}>{JSON.stringify(value)}</span>
        </div>
      );
  }
}

// ─── ScriptEventForm ──────────────────────────────────────────────────────────

export const ScriptEventForm: React.FC<ScriptEventFormProps> = ({
  event,
  eventDef,
  onChange,
}) => {
  const formId = useId();

  const handleFieldChange = (key: string, val: unknown) => {
    onChange({ ...event, args: { ...event.args, [key]: val } });
  };

  const visibleFields = eventDef.fields.filter(
    (f) => f.key !== '__collapsed' && f.key !== '__disabled',
  );

  if (visibleFields.length === 0) {
    return null;
  }

  return (
    <div
      className="script-event-form"
      style={{ display: 'flex', flexDirection: 'column', padding: '4px 0' }}
    >
      {visibleFields.map((field) =>
        renderField(field, event.args[field.key], handleFieldChange, formId),
      )}
    </div>
  );
};

export default ScriptEventForm;
