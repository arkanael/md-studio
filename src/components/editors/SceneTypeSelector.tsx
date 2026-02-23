import React from 'react';
import styled from 'styled-components';
import {
  MDSceneType,
  SCENE_TYPE_OPTIONS,
  MD_SCENE_TYPES,
} from '../../lib/scenes/sceneTypes';

interface SceneTypeSelectorProps {
  value: MDSceneType;
  onChange: (type: MDSceneType) => void;
}

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #aaa;
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

const TypeCard = styled.button<{ selected: boolean }>`
  background: ${(p) => (p.selected ? '#3a5a8a' : '#2d2d2d')};
  border: 2px solid ${(p) => (p.selected ? '#5b9bd5' : '#444')};
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
  color: #fff;

  &:hover {
    border-color: #5b9bd5;
    background: #334;
  }
`;

const TypeName = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TypeBadge = styled.div`
  font-size: 9px;
  color: #9ecbff;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const TypeDescription = styled.div`
  margin-top: 8px;
  padding: 8px 10px;
  background: #1e2a3a;
  border-left: 3px solid #5b9bd5;
  border-radius: 0 4px 4px 0;
  font-size: 11px;
  color: #ccc;
  line-height: 1.5;
`;

const SgdkNote = styled.div`
  margin-top: 6px;
  font-size: 10px;
  color: #7ec8e3;
  font-family: monospace;
`;

const PLAYER_MOVE_LABELS: Record<string, string> = {
  grid: 'Grid',
  free: 'Livre',
  physics: 'Fisica',
  cursor: 'Cursor',
  shooter: 'Shooter',
};

export const SceneTypeSelector: React.FC<SceneTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const selectedInfo = MD_SCENE_TYPES[value];

  return (
    <SelectorContainer>
      <Label>Tipo de Cena</Label>

      <TypeGrid>
        {SCENE_TYPE_OPTIONS.map((opt) => (
          <TypeCard
            key={opt.value}
            selected={opt.value === value}
            onClick={() => onChange(opt.value as MDSceneType)}
            title={opt.description}
          >
            <TypeName>{opt.label}</TypeName>
            <TypeBadge>
              {PLAYER_MOVE_LABELS[MD_SCENE_TYPES[opt.value as MDSceneType].playerMoveType]}
            </TypeBadge>
          </TypeCard>
        ))}
      </TypeGrid>

      {selectedInfo && (
        <TypeDescription>
          <strong>{selectedInfo.label}:</strong> {selectedInfo.description}
          <SgdkNote>SGDK: {selectedInfo.sgdkNotes}</SgdkNote>
        </TypeDescription>
      )}
    </SelectorContainer>
  );
};
