import React from 'react';
import styled from 'styled-components';
import type { MDSceneType } from '../../lib/scenes/sceneTypes';
import type { CollisionBrushTool } from '../../lib/scenes/collisionTypes';
import {
  getCollisionTilesForSceneType,
  COLLISION_TILE_DEFINITIONS,
} from '../../lib/scenes/collisionTypes';

interface CollisionToolbarProps {
  sceneType: MDSceneType;
  selectedTileId: string;
  activeTool: CollisionBrushTool;
  onSelectTile: (tileId: string) => void;
  onSelectTool: (tool: CollisionBrushTool) => void;
}

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: #1a1a2e;
  border-right: 1px solid #333;
  min-width: 120px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #666;
  padding: 0 2px;
  margin-bottom: 2px;
`;

const TileBtn = styled.button<{ active: boolean; tileColor: string; tileBorder: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  background: ${(p) => (p.active ? '#252550' : 'transparent')};
  border: 1px solid ${(p) => (p.active ? p.tileBorder : '#333')};
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  color: #ccc;
  font-size: 11px;
  transition: all 0.1s;
  &:hover { background: #252540; border-color: ${(p) => p.tileBorder}; }
`;

const TileSwatch = styled.div<{ color: string; border: string }>`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: ${(p) => p.color};
  border: 1px solid ${(p) => p.border};
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  flex-shrink: 0;
`;

const ToolBtn = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  background: ${(p) => (p.active ? '#1a3a5e' : 'transparent')};
  border: 1px solid ${(p) => (p.active ? '#5b9bd5' : '#333')};
  border-radius: 4px;
  cursor: pointer;
  color: #ccc;
  font-size: 11px;
  transition: all 0.1s;
  &:hover { background: #1a2a4e; border-color: #5b9bd5; }
`;

const TOOL_DEFINITIONS: { id: CollisionBrushTool; label: string; icon: string; hint: string }[] = [
  { id: 'pencil', label: 'Pencil',  icon: 'P', hint: 'Pinta tile a tile' },
  { id: 'eraser', label: 'Eraser',  icon: 'E', hint: 'Apaga colisao do tile' },
  { id: 'slope',  label: 'Slope',   icon: '/', hint: 'Arrastar para criar rampas (Ctrl=direcional, Shift=offset)' },
  { id: 'magic',  label: 'Magic',   icon: '*', hint: 'Pinta todos os tiles iguais de uma vez' },
];

export const CollisionToolbar: React.FC<CollisionToolbarProps> = ({
  sceneType,
  selectedTileId,
  activeTool,
  onSelectTile,
  onSelectTool,
}) => {
  const availableTiles = getCollisionTilesForSceneType(sceneType);

  return (
    <ToolbarContainer>
      <Section>
        <SectionLabel>Ferramenta</SectionLabel>
        {TOOL_DEFINITIONS.map((tool) => (
          <ToolBtn
            key={tool.id}
            active={activeTool === tool.id}
            onClick={() => onSelectTool(tool.id)}
            title={tool.hint}
          >
            <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{tool.icon}</span>
            {tool.label}
          </ToolBtn>
        ))}
      </Section>

      <Section>
        <SectionLabel>Tipo de Colisao</SectionLabel>
        {availableTiles.map((def) => (
          <TileBtn
            key={def.id}
            active={selectedTileId === def.id}
            tileColor={def.color}
            tileBorder={def.borderColor}
            onClick={() => onSelectTile(def.id)}
            title={def.description}
          >
            <TileSwatch color={def.color} border={def.borderColor}>
              {def.symbol}
            </TileSwatch>
            {def.label}
          </TileBtn>
        ))}
      </Section>

      <Section>
        <SectionLabel>Legenda</SectionLabel>
        <div style={{ fontSize: 9, color: '#555', lineHeight: 1.6 }}>
          <div>Ctrl+drag = direcional</div>
          <div>Shift = offset slope</div>
          <div>Ctrl+Shift = inverter</div>
        </div>
      </Section>
    </ToolbarContainer>
  );
};
