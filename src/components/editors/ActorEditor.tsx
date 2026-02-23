import React from 'react';
import styled from 'styled-components';
import { editorActions } from '../../store/features/editor/editorSlice';
import { useDispatch } from 'react-redux';
import type { MDActor, ActorDirection } from '../../store/features/entities/entitiesTypes';

// -------------------------------------------------------
// ActorEditor - Painel lateral de edicao de ator
// Equivale ao ActorEditor do GB Studio adaptado para MD
// -------------------------------------------------------

interface ActorEditorProps {
  actor: MDActor;
  sceneId: string;
  onUpdate: (updated: Partial<MDActor>) => void;
}

const Panel = styled.div`
  background: #16213e;
  border-left: 1px solid #0f3460;
  width: 280px;
  min-width: 240px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const PanelHeader = styled.div`
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
  color: #e94560;
  border-bottom: 1px solid #0f3460;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Section = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #0f3460;
`;

const SectionTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #a0a0c0;
  margin-bottom: 10px;
`;

const FieldGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  font-size: 11px;
  color: #a0a0c0;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  background: #0f3460;
  border: 1px solid #1a4a80;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 5px 8px;
  font-size: 12px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #e94560; }
`;

const Select = styled.select`
  width: 100%;
  background: #0f3460;
  border: 1px solid #1a4a80;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 5px 8px;
  font-size: 12px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #e94560; }
`;

const NumberInput = styled.input.attrs({ type: 'number' })`
  width: 80px;
  background: #0f3460;
  border: 1px solid #1a4a80;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 5px 8px;
  font-size: 12px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #e94560; }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #a0a0c0;
  cursor: pointer;
`;

const ScriptButton = styled.button`
  width: 100%;
  background: #0f3460;
  border: 1px solid #1a4a80;
  border-radius: 4px;
  color: #e0e0e0;
  padding: 7px 12px;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  margin-bottom: 6px;
  transition: all 0.15s;
  &:hover { background: #e94560; border-color: #e94560; color: #fff; }
`;

const XYRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// -------------------------------------------------------
const ActorEditor: React.FC<ActorEditorProps> = ({ actor, sceneId, onUpdate }) => {
  const dispatch = useDispatch();

  const openScript = (key: string) => {
    dispatch(editorActions.openScriptEditor({
      sceneId,
      entityId: actor.id,
      type: 'actor',
      key,
    }));
  };

  return (
    <Panel>
      <PanelHeader>
        <span>Ator: {actor.name || 'Sem nome'}</span>
        <span style={{ fontSize: '10px', color: '#666' }}>{actor.id.slice(0, 8)}</span>
      </PanelHeader>

      {/* Identidade */}
      <Section>
        <SectionTitle>Identidade</SectionTitle>
        <FieldGroup>
          <Label>Nome</Label>
          <Input
            value={actor.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Nome do ator"
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Grupo de colisao</Label>
          <Select
            value={actor.collisionGroup}
            onChange={(e) => onUpdate({ collisionGroup: e.target.value })}
          >
            <option value="player">Jogador</option>
            <option value="enemy">Inimigo</option>
            <option value="npc">NPC</option>
            <option value="item">Item</option>
            <option value="projectile">Projetil</option>
            <option value="none">Nenhum</option>
          </Select>
        </FieldGroup>
        <FieldGroup>
          <CheckboxRow>
            <input
              type="checkbox"
              checked={actor.isPersistent}
              onChange={(e) => onUpdate({ isPersistent: e.target.checked })}
            />
            Persistente entre cenas
          </CheckboxRow>
        </FieldGroup>
      </Section>

      {/* Posicao */}
      <Section>
        <SectionTitle>Posicao (tiles)</SectionTitle>
        <XYRow>
          <FieldGroup>
            <Label>X</Label>
            <NumberInput
              value={actor.x}
              min={0}
              max={255}
              onChange={(e) => onUpdate({ x: parseInt(e.target.value) || 0 })}
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Y</Label>
            <NumberInput
              value={actor.y}
              min={0}
              max={255}
              onChange={(e) => onUpdate({ y: parseInt(e.target.value) || 0 })}
            />
          </FieldGroup>
        </XYRow>
        <FieldGroup>
          <Label>Direcao inicial</Label>
          <Select
            value={actor.direction}
            onChange={(e) => onUpdate({ direction: e.target.value as ActorDirection })}
          >
            <option value="down">Baixo</option>
            <option value="up">Cima</option>
            <option value="left">Esquerda</option>
            <option value="right">Direita</option>
          </Select>
        </FieldGroup>
      </Section>

      {/* Movimento */}
      <Section>
        <SectionTitle>Movimento e Animacao</SectionTitle>
        <FieldGroup>
          <Label>Velocidade de movimento (px/frame)</Label>
          <NumberInput
            value={actor.moveSpeed}
            min={0}
            max={16}
            step={1}
            onChange={(e) => onUpdate({ moveSpeed: parseFloat(e.target.value) || 0 })}
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Velocidade de animacao</Label>
          <Select
            value={actor.animSpeed}
            onChange={(e) => onUpdate({ animSpeed: parseInt(e.target.value) })}
          >
            <option value="0">Sem animacao</option>
            <option value="4">Muito rapida</option>
            <option value="8">Rapida</option>
            <option value="16">Normal</option>
            <option value="32">Lenta</option>
          </Select>
        </FieldGroup>
      </Section>

      {/* Scripts */}
      <Section>
        <SectionTitle>Scripts</SectionTitle>
        <ScriptButton onClick={() => openScript('script')}>
          Interacao ({actor.script.length} eventos)
        </ScriptButton>
        <ScriptButton onClick={() => openScript('startScript')}>
          Ao iniciar ({actor.startScript.length} eventos)
        </ScriptButton>
        <ScriptButton onClick={() => openScript('updateScript')}>
          A cada frame ({actor.updateScript.length} eventos)
        </ScriptButton>
        <ScriptButton onClick={() => openScript('hitScript')}>
          Ao receber dano ({actor.hitScript.length} eventos)
        </ScriptButton>
      </Section>
    </Panel>
  );
};

export default ActorEditor;
