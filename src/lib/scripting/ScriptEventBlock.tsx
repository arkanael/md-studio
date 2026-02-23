import React, { useState, useCallback } from 'react';
import {
  ScriptEvent,
  ScriptEventDef,
  ScriptEventGroup,
  ScriptContext,
} from './scriptTypes';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScriptEventBlockProps {
  event: ScriptEvent;
  eventDef?: ScriptEventDef;
  context: ScriptContext;
  depth?: number;
  isFirst?: boolean;
  isLast?: boolean;
  onChange: (event: ScriptEvent) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onAddAfter?: (id: string) => void;
}

// ─── Event color by category ─────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  control_flow: '#b33',
  text:         '#36b',
  actor:        '#3a3',
  scene:        '#83b',
  camera:       '#b63',
  sound:        '#3bb',
  music:        '#b3b',
  variables:    '#bb3',
  math:         '#b83',
  input:        '#3b8',
  timing:       '#888',
  engine:       '#555',
  misc:         '#666',
};

function categoryColor(cat?: string): string {
  if (!cat) return '#444';
  return CATEGORY_COLORS[cat] ?? '#444';
}

// ─── Collapse toggle ──────────────────────────────────────────────────────────

function CollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="script-event-collapse"
      onClick={onToggle}
      title={collapsed ? 'Expand' : 'Collapse'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0 4px',
        color: '#aaa',
        fontSize: 12,
      }}
    >
      {collapsed ? '▶' : '▼'}
    </button>
  );
}

// ─── ScriptEventBlock ─────────────────────────────────────────────────────────

export const ScriptEventBlock: React.FC<ScriptEventBlockProps> = ({
  event,
  eventDef,
  context,
  depth = 0,
  isFirst = false,
  isLast = false,
  onChange,
  onRemove,
  onMove,
  onAddAfter,
}) => {
  const [collapsed, setCollapsed] = useState(event.args.__collapsed === true);

  const toggleCollapse = useCallback(() => {
    const next = !collapsed;
    setCollapsed(next);
    onChange({ ...event, args: { ...event.args, __collapsed: next } });
  }, [collapsed, event, onChange]);

  const label =
    eventDef?.name ??
    event.command
      .replace(/^EVENT_/, '')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const accentColor = categoryColor(eventDef?.groups?.[0]);

  const isDisabled = event.args.__disabled === true;

  const toggleDisable = useCallback(() => {
    onChange({ ...event, args: { ...event.args, __disabled: !isDisabled } });
  }, [event, isDisabled, onChange]);

  return (
    <div
      className="script-event-block"
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 4,
        marginLeft: depth * 12,
        opacity: isDisabled ? 0.45 : 1,
        border: '1px solid #333',
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 4,
        background: '#1e1e2e',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="script-event-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 6px',
          background: '#252535',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {/* Collapse */}
        <CollapseToggle collapsed={collapsed} onToggle={toggleCollapse} />

        {/* Label */}
        <span
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 600,
            color: isDisabled ? '#666' : '#ddd',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>

        {/* Disable toggle */}
        <button
          title={isDisabled ? 'Enable event' : 'Disable event'}
          onClick={toggleDisable}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            color: isDisabled ? '#888' : '#aaa',
            padding: '0 2px',
          }}
        >
          {isDisabled ? '○' : '●'}
        </button>

        {/* Move up */}
        {!isFirst && (
          <button
            title="Move up"
            onClick={() => onMove(event.id, 'up')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              color: '#aaa',
              padding: '0 2px',
            }}
          >
            ↑
          </button>
        )}

        {/* Move down */}
        {!isLast && (
          <button
            title="Move down"
            onClick={() => onMove(event.id, 'down')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              color: '#aaa',
              padding: '0 2px',
            }}
          >
            ↓
          </button>
        )}

        {/* Remove */}
        <button
          title="Remove event"
          onClick={() => onRemove(event.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            color: '#955',
            padding: '0 2px',
          }}
        >
          ×
        </button>
      </div>

      {/* Body - shown only when expanded */}
      {!collapsed && (
        <div
          className="script-event-body"
          style={{ padding: '6px 8px' }}
        >
          {/* Render args as key:value pairs (placeholder until ScriptEventForm is wired) */}
          {eventDef ? (
            <ArgList event={event} eventDef={eventDef} onChange={onChange} />
          ) : (
            <span style={{ fontSize: 11, color: '#888' }}>
              Unknown event: {event.command}
            </span>
          )}

          {/* Sub-scripts (branches / children) */}
          {eventDef?.fields
            .filter((f) => f.type === 'events')
            .map((f) => {
              const children: ScriptEvent[] =
                (event.args[f.key] as ScriptEvent[]) ?? [];
              return (
                <div key={f.key} style={{ marginTop: 8 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#888',
                      marginBottom: 4,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {f.label ?? f.key}
                  </div>
                  {children.length === 0 && (
                    <div
                      style={{
                        fontSize: 11,
                        color: '#555',
                        fontStyle: 'italic',
                        padding: '4px 0',
                      }}
                    >
                      (empty)
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Add-after strip */}
      {onAddAfter && (
        <button
          className="script-event-add-after"
          onClick={() => onAddAfter(event.id)}
          style={{
            display: 'block',
            width: '100%',
            background: 'none',
            border: 'none',
            borderTop: '1px solid #2a2a3a',
            color: '#556',
            fontSize: 11,
            cursor: 'pointer',
            padding: '2px 0',
            textAlign: 'center',
          }}
        >
          + add event
        </button>
      )}
    </div>
  );
};

// ─── ArgList ──────────────────────────────────────────────────────────────────
// Minimal argument display — full form fields handled by ScriptEventForm

interface ArgListProps {
  event: ScriptEvent;
  eventDef: ScriptEventDef;
  onChange: (event: ScriptEvent) => void;
}

function ArgList({ event, eventDef, onChange }: ArgListProps) {
  const visibleFields = eventDef.fields.filter(
    (f) =>
      f.type !== 'events' &&
      f.key !== '__collapsed' &&
      f.key !== '__disabled',
  );

  if (visibleFields.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {visibleFields.map((field) => {
        const value = event.args[field.key];
        return (
          <div
            key={field.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
            }}
          >
            <span style={{ color: '#888', minWidth: 80 }}>
              {field.label ?? field.key}:
            </span>
            <ArgInput
              field={field}
              value={value}
              onChange={(v) =>
                onChange({
                  ...event,
                  args: { ...event.args, [field.key]: v },
                })
              }
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── ArgInput ─────────────────────────────────────────────────────────────────

interface ArgInputProps {
  field: ScriptEventDef['fields'][number];
  value: unknown;
  onChange: (value: unknown) => void;
}

function ArgInput({ field, value, onChange }: ArgInputProps) {
  const style: React.CSSProperties = {
    background: '#13131f',
    border: '1px solid #333',
    borderRadius: 3,
    color: '#ddd',
    fontSize: 12,
    padding: '1px 4px',
    flex: 1,
    minWidth: 0,
  };

  switch (field.type) {
    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
      );

    case 'number': {
      const min = (field as ScriptEventGroup).min as number | undefined;
      const max = (field as ScriptEventGroup).max as number | undefined;
      return (
        <input
          type="number"
          style={{ ...style, width: 70 }}
          value={value as number ?? 0}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    }

    case 'select': {
      const options =
        (field as ScriptEventGroup).options as Array<[string, string]> | undefined;
      return (
        <select
          style={style}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          {options?.map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
      );
    }

    case 'text':
    case 'textarea':
      return (
        <input
          type="text"
          style={style}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return (
        <span style={{ color: '#aaa', fontSize: 12 }}>
          {JSON.stringify(value)}
        </span>
      );
  }
}

export default ScriptEventBlock;
