import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { TriggerData, ScriptEvent } from './triggerTypes';
import {
  updateTrigger,
  removeTrigger,
  addScriptEvent,
  removeScriptEvent,
  validateTriggerBounds,
} from './triggerUtils';

interface TriggerEditorProps {
  triggerId: string;
  sceneId: string;
}

export const TriggerEditor: React.FC<TriggerEditorProps> = ({
  triggerId,
  sceneId,
}) => {
  const dispatch = useAppDispatch();
  const trigger = useAppSelector((state) =>
    state.project.scenes
      .find((s) => s.id === sceneId)
      ?.triggers.find((t) => t.id === triggerId)
  );

  if (!trigger) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateTrigger({ sceneId, triggerId, changes: { name: e.target.value } })
    );
  };

  const handlePositionChange = (
    field: 'x' | 'y' | 'width' | 'height',
    value: string
  ) => {
    const num = parseInt(value) || 0;
    const validated = validateTriggerBounds(
      field === 'x' ? num : trigger.x,
      field === 'y' ? num : trigger.y,
      field === 'width' ? num : trigger.width,
      field === 'height' ? num : trigger.height
    );
    dispatch(updateTrigger({ sceneId, triggerId, changes: validated }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      updateTrigger({ sceneId, triggerId, changes: { notes: e.target.value } })
    );
  };

  const handleAddEvent = () => {
    const newEvent: ScriptEvent = {
      id: `event_${Date.now()}`,
      command: 'EVENT_END',
      args: {},
    };
    dispatch(addScriptEvent({ sceneId, triggerId, event: newEvent }));
  };

  const handleRemoveEvent = (eventId: string) => {
    dispatch(removeScriptEvent({ sceneId, triggerId, eventId }));
  };

  const handleRemove = () => {
    dispatch(removeTrigger({ sceneId, triggerId }));
  };

  return (
    <div className="trigger-editor">
      <div className="trigger-editor__header">
        <h3>Trigger</h3>
        <button onClick={handleRemove} className="trigger-editor__remove">
          Remove
        </button>
      </div>

      <div className="trigger-editor__field">
        <label>Name</label>
        <input
          type="text"
          value={trigger.name}
          onChange={handleNameChange}
          placeholder="Trigger name"
        />
      </div>

      <div className="trigger-editor__field trigger-editor__position">
        <label>Position</label>
        <div className="trigger-editor__position-inputs">
          <label>X</label>
          <input
            type="number"
            value={trigger.x}
            onChange={(e) => handlePositionChange('x', e.target.value)}
            min={0}
            max={30}
          />
          <label>Y</label>
          <input
            type="number"
            value={trigger.y}
            onChange={(e) => handlePositionChange('y', e.target.value)}
            min={0}
            max={32}
          />
        </div>
      </div>

      <div className="trigger-editor__field trigger-editor__size">
        <label>Size</label>
        <div className="trigger-editor__size-inputs">
          <label>W</label>
          <input
            type="number"
            value={trigger.width}
            onChange={(e) => handlePositionChange('width', e.target.value)}
            min={1}
            max={32}
          />
          <label>H</label>
          <input
            type="number"
            value={trigger.height}
            onChange={(e) => handlePositionChange('height', e.target.value)}
            min={1}
            max={32}
          />
        </div>
      </div>

      <div className="trigger-editor__script">
        <div className="trigger-editor__script-header">
          <label>On Enter Script</label>
          <button onClick={handleAddEvent} className="trigger-editor__add-event">
            + Add Event
          </button>
        </div>
        <div className="trigger-editor__events">
          {trigger.script.length === 0 ? (
            <p className="trigger-editor__no-events">No events. Click Add Event to start.</p>
          ) : (
            trigger.script.map((event) => (
              <div key={event.id} className="trigger-editor__event">
                <span className="trigger-editor__event-name">{event.command}</span>
                <button
                  onClick={() => handleRemoveEvent(event.id)}
                  className="trigger-editor__event-remove"
                >
                  x
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="trigger-editor__field">
        <label>Notes</label>
        <textarea
          value={trigger.notes || ''}
          onChange={handleNotesChange}
          placeholder="Add notes..."
        />
      </div>
    </div>
  );
};

export default TriggerEditor;
