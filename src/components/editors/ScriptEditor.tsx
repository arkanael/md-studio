import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { editorActions } from '../../store/features/editor/editorSlice';
import { updateActorInScene, updateTriggerInScene, setSceneScript } from '../../store/features/scenes/scenesSlice';
import type { RootState } from '../../store/index';
import type { MDScriptEvent, EntityId } from '../../store/features/entities/entitiesTypes';

// ---------------------------------------------------------
// ScriptEditor.tsx - Editor de scripts (lista de eventos)
// Permite editar os argumentos de cada evento/comando SGDK
// ---------------------------------------------------------

const ScriptContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
`;

const EventBlock = styled.div`
  background: #16213e;
  border: 1px solid #0f3460;
  border-left: 4px solid #e94560;
  border-radius: 4px;
  padding: 10px;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #e0e0e0;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  &:hover { color: #e94560; }
`;

const ArgsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const Field = styled.div`
  label {
    display: block;
    font-size: 9px;
    color: #888;
    margin-bottom: 2px;
    text-transform: uppercase;
  }
  input, select {
    width: 100%;
    padding: 4px 6px;
    background: #0d0d1a;
    border: 1px solid #0f3460;
    border-radius: 3px;
    color: #ccc;
    font-size: 10px;
    outline: none;
    &:focus { border-color: #e94560; }
  }
`;

// --- Comandos e seus argumentos ---
const COMMAND_DEFS: Record<string, { label: string; args: string[] }> = {
  EVENT_TEXT_SHOW: { label: 'Mostrar Texto', args: ['text'] },
  EVENT_SCENE_SWITCH: { label: 'Ir para Cena', args: ['sceneId', 'x', 'y', 'direction'] },
  EVENT_ACTOR_MOVE_TO: { label: 'Mover Ator', args: ['actorId', 'x', 'y'] },
  EVENT_VARIABLE_SET: { label: 'Definir Variavel', args: ['variableId', 'value'] },
  EVENT_WAIT: { label: 'Aguardar', args: ['frames'] },
  EVENT_SOUND_PLAY_FX: { label: 'Tocar Som', args: ['soundId'] },
  EVENT_MUSIC_PLAY: { label: 'Tocar Musica', args: ['musicId', 'loop'] },
};

const ScriptEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    scriptEditorOpen, 
    scriptEditorSceneId, 
    scriptEditorEntityId, 
    scriptEditorType, 
    scriptEditorKey 
  } = useSelector((state: RootState) => state.editor);

  const scene = useSelector((state: RootState) => 
    scriptEditorSceneId ? state.scenes.entities[scriptEditorSceneId] : null
  );

  if (!scriptEditorOpen || !scene) return null;

  // Localizar o script correto baseado no contexto
  let script: MDScriptEvent[] = [];
  if (scriptEditorType === 'scene') {
    script = (scene as any)[scriptEditorKey || 'script'] || [];
  } else if (scriptEditorType === 'actor') {
    const actor = scene.actors.find(a => a.id === scriptEditorEntityId);
    script = (actor as any)?.[scriptEditorKey || 'script'] || [];
  } else if (scriptEditorType === 'trigger') {
    const trigger = scene.triggers.find(t => t.id === scriptEditorEntityId);
    script = trigger?.script || [];
  }

  const handleUpdateArgs = (eventId: string, newArgs: any) => {
    const newScript = script.map(e => 
      e.id === eventId ? { ...e, args: { ...e.args, ...newArgs } } : e
    );

    if (scriptEditorType === 'scene') {
      dispatch(setSceneScript({ 
        sceneId: scene.id, 
        scriptKey: (scriptEditorKey as any) || 'script', 
        events: newScript 
      }));
    } else if (scriptEditorType === 'actor' && scriptEditorEntityId) {
      dispatch(updateActorInScene({ 
        sceneId: scene.id, 
        actorId: scriptEditorEntityId, 
        changes: { [scriptEditorKey || 'script']: newScript } 
      }));
    } else if (scriptEditorType === 'trigger' && scriptEditorEntityId) {
      dispatch(updateTriggerInScene({ 
        sceneId: scene.id, 
        triggerId: scriptEditorEntityId, 
        changes: { script: newScript } 
      }));
    }
  };

  const handleRemoveEvent = (eventId: string) => {
    const newScript = script.filter(e => e.id !== eventId);
    if (scriptEditorType === 'scene') {
      dispatch(setSceneScript({ 
        sceneId: scene.id, 
        scriptKey: (scriptEditorKey as any) || 'script', 
        events: newScript 
      }));
    } else if (scriptEditorType === 'actor' && scriptEditorEntityId) {
      dispatch(updateActorInScene({ 
        sceneId: scene.id, 
        actorId: scriptEditorEntityId, 
        changes: { [scriptEditorKey || 'script']: newScript } 
      }));
    } else if (scriptEditorType === 'trigger' && scriptEditorEntityId) {
      dispatch(updateTriggerInScene({ 
        sceneId: scene.id, 
        triggerId: scriptEditorEntityId, 
        changes: { script: newScript } 
      }));
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, right: 280, width: 400, height: '100%', background: '#0d0d1a', borderLeft: '1px solid #0f3460', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px', background: '#16213e', borderBottom: '1px solid #0f3460', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Editor de Script</span>
        <button onClick={() => dispatch(editorActions.closeScriptEditor())} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Fechar</button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <ScriptContainer>
          {script.map((event, index) => {
            const def = COMMAND_DEFS[event.command];
            return (
              <EventBlock key={event.id}>
                <EventHeader>
                  <span>#{index + 1} {def?.label || event.command}</span>
                  <DeleteBtn onClick={() => handleRemoveEvent(event.id)}>x</DeleteBtn>
                </EventHeader>
                
                <ArgsGrid>
                  {def?.args.map(argKey => (
                    <Field key={argKey}>
                      <label>{argKey}</label>
                      <input 
                        value={(event.args as any)[argKey] || ''} 
                        onChange={e => handleUpdateArgs(event.id, { [argKey]: e.target.value })}
                      />
                    </Field>
                  ))}
                </ArgsGrid>
              </EventBlock>
            );
          })}
          {script.length === 0 && <div style={{ color: '#555', textAlign: 'center', fontSize: '11px', marginTop: '40px' }}>Nenhum evento neste script.</div>}
        </ScriptContainer>
      </div>
    </div>
  );
};

export default ScriptEditor;
