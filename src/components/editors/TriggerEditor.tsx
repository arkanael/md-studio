import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import type { MDTrigger, MDScriptEvent, EntityId } from '../../store/features/entities/entitiesTypes';
import { updateTriggerInScene } from '../../store/features/scenes/scenesSlice';
import { editorActions } from '../../store/features/editor/editorSlice';
import type { RootState } from '../../store/index';

// ---------------------------------------------------------
// TriggerEditor.tsx - Editor de trigger (zona de gatilho)
// Equivale ao TriggerEditor do GB Studio adaptado para MD
// ---------------------------------------------------------

interface TriggerEditorProps {
  sceneId: EntityId;
  trigger: MDTrigger;
}

// --- Styled Components ---
const Container = styled.div`
  padding: 4px 0;
`;

const Field = styled.div`
  margin-bottom: 8px;
  label {
    display: block;
    font-size: 10px;
    color: #888;
    margin-bottom: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  input, select {
    width: 100%;
    padding: 5px 8px;
    background: #16213e;
    border: 1px solid #0f3460;
    border-radius: 4px;
    color: #e0e0e0;
    font-size: 11px;
    outline: none;
    box-sizing: border-box;
    &:focus { border-color: #9b59b6; }
  }
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const SectionTitle = styled.div`
  font-size: 10px;
  color: #9b59b6;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 10px 0 6px;
  border-bottom: 1px solid #0f3460;
  padding-bottom: 4px;
`;

const ScriptButton = styled.button`
  width: 100%;
  padding: 7px;
  background: transparent;
  border: 1px dashed #0f3460;
  border-radius: 4px;
  color: #9b59b6;
  font-size: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  &:hover {
    background: rgba(155, 89, 182, 0.1);
    border-color: #9b59b6;
  }
`;

const ScriptEventItem = styled.div`
  padding: 5px 8px;
  background: rgba(155, 89, 182, 0.1);
  border: 1px solid #0f3460;
  border-left: 3px solid #9b59b6;
  border-radius: 3px;
  margin-bottom: 4px;
  font-size: 10px;
  color: #c0c0e0;
  cursor: pointer;
  &:hover { border-color: #9b59b6; }
`;

const DeleteBtn = styled.button`
  float: right;
  background: none;
  border: none;
  color: #e94560;
  cursor: pointer;
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;
  &:hover { color: #ff6b6b; }
`;

const InfoBadge = styled.div`
  display: inline-block;
  padding: 2px 8px;
  background: rgba(155, 89, 182, 0.2);
  border: 1px solid #9b59b6;
  border-radius: 10px;
  font-size: 9px;
  color: #9b59b6;
  margin-bottom: 8px;
`;

// --- Helpers ---
const SCRIPT_COMMANDS = [
  { value: 'EVENT_SCENE_SWITCH', label: 'Mudar de Cena' },
  { value: 'EVENT_ACTOR_MOVE_TO', label: 'Mover Ator' },
  { value: 'EVENT_TEXT_SHOW', label: 'Mostrar Texto' },
  { value: 'EVENT_VARIABLE_SET', label: 'Definir Variavel' },
  { value: 'EVENT_SOUND_PLAY_FX', label: 'Tocar Efeito Sonoro' },
  { value: 'EVENT_MUSIC_PLAY', label: 'Tocar Musica XGM' },
  { value: 'EVENT_MUSIC_STOP', label: 'Parar Musica' },
  { value: 'EVENT_GAME_OVER', label: 'Game Over' },
  { value: 'EVENT_IF_VALUE', label: 'Se Variavel For...' },
  { value: 'EVENT_WAIT', label: 'Aguardar Frames' },
];

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// --- Componente principal ---
const TriggerEditor: React.FC<TriggerEditorProps> = ({ sceneId, trigger }) => {
  const dispatch = useDispatch();
  const [addingScript, setAddingScript] = useState(false);
  const [newCommand, setNewCommand] = useState(SCRIPT_COMMANDS[0].value);

  const handleChange = useCallback(
    (changes: Partial<MDTrigger>) => {
      dispatch(updateTriggerInScene({ sceneId, triggerId: trigger.id, changes }));
    },
    [dispatch, sceneId, trigger.id]
  );

  const handleAddScript = useCallback(() => {
    const newEvent: MDScriptEvent = {
      id: generateId(),
      command: newCommand,
      args: {},
    };
    dispatch(
      updateTriggerInScene({
        sceneId,
        triggerId: trigger.id,
        changes: { script: [...(trigger.script || []), newEvent] },
      })
    );
    setAddingScript(false);
  }, [dispatch, sceneId, trigger.id, trigger.script, newCommand]);

  const handleRemoveScript = useCallback(
    (eventId: string) => {
      dispatch(
        updateTriggerInScene({
          sceneId,
          triggerId: trigger.id,
          changes: {
            script: trigger.script.filter((e) => e.id !== eventId),
          },
        })
      );
    },
    [dispatch, sceneId, trigger.id, trigger.script]
  );

  const handleOpenScriptEditor = useCallback(
    (eventId: string) => {
      dispatch(
        editorActions.openScriptEditor({
          sceneId,
          entityId: trigger.id,
          type: 'trigger',
          key: 'script',
        })
      );
    },
    [dispatch, sceneId, trigger.id]
  );

  return (
    <Container>
      <InfoBadge>Trigger ID: {trigger.id.slice(0, 8)}</InfoBadge>

      <SectionTitle>Identificacao</SectionTitle>

      <Field>
        <label>Nome</label>
        <input
          value={trigger.name}
          onChange={(e) => handleChange({ name: e.target.value })}
          placeholder="Ex: porta_secreta"
        />
      </Field>

      <SectionTitle>Posicao e Tamanho (tiles)</SectionTitle>

      <Row>
        <Field style={{ flex: 1 }}>
          <label>X</label>
          <input
            type="number"
            value={trigger.x}
            min={0}
            onChange={(e) => handleChange({ x: parseInt(e.target.value) || 0 })}
          />
        </Field>
        <Field style={{ flex: 1 }}>
          <label>Y</label>
          <input
            type="number"
            value={trigger.y}
            min={0}
            onChange={(e) => handleChange({ y: parseInt(e.target.value) || 0 })}
          />
        </Field>
      </Row>

      <Row>
        <Field style={{ flex: 1 }}>
          <label>Largura</label>
          <input
            type="number"
            value={trigger.width}
            min={1}
            onChange={(e) => handleChange({ width: parseInt(e.target.value) || 1 })}
          />
        </Field>
        <Field style={{ flex: 1 }}>
          <label>Altura</label>
          <input
            type="number"
            value={trigger.height}
            min={1}
            onChange={(e) => handleChange({ height: parseInt(e.target.value) || 1 })}
          />
        </Field>
      </Row>

      <SectionTitle>
        Script ao entrar ({trigger.script?.length || 0} eventos)
      </SectionTitle>

      {(trigger.script || []).map((event) => {
        const label =
          SCRIPT_COMMANDS.find((c) => c.value === event.command)?.label ||
          event.command;
        return (
          <ScriptEventItem
            key={event.id}
            onClick={() => handleOpenScriptEditor(event.id)}
            title="Editar evento"
          >
            <DeleteBtn
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveScript(event.id);
              }}
              title="Remover evento"
            >
              x
            </DeleteBtn>
            {label}
          </ScriptEventItem>
        );
      })}

      {addingScript ? (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <select
            value={newCommand}
            onChange={(e) => setNewCommand(e.target.value)}
            style={{
              flex: 1,
              padding: '5px 6px',
              background: '#16213e',
              border: '1px solid #9b59b6',
              borderRadius: '4px',
              color: '#e0e0e0',
              fontSize: '11px',
            }}
          >
            {SCRIPT_COMMANDS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddScript}
            style={{
              padding: '5px 10px',
              background: '#9b59b6',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            OK
          </button>
          <button
            onClick={() => setAddingScript(false)}
            style={{
              padding: '5px 8px',
              background: 'none',
              border: '1px solid #0f3460',
              borderRadius: '4px',
              color: '#888',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            x
          </button>
        </div>
      ) : (
        <ScriptButton onClick={() => setAddingScript(true)}>
          + Adicionar Evento ao Script
        </ScriptButton>
      )}
    </Container>
  );
};

export default TriggerEditor;
