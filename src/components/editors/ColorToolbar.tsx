import React from 'react';
import styled from 'styled-components';
import type { ColorBrushTool, BackgroundPaletteMode } from '../../lib/scenes/colorTypes';
import {
  MAX_SCENE_PALETTES,
  DIALOGUE_PALETTE_INDEX,
  PALETTE_LABELS,
  DEFAULT_PALETTES,
} from '../../lib/scenes/colorTypes';

// --------------------------------------------------
// ColorToolbar - Barra lateral do editor de cores
// 4 paletas SGDK, ferramentas pincel/borracha/magic,
// toggle priority, selector de modo de background
// --------------------------------------------------

const Toolbar = styled.div`
  width: 200px;
  min-width: 200px;
  background: #0d0d1a;
  border-right: 1px solid #1e1e3a;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  user-select: none;
`;

const Section = styled.div`
  padding: 10px 8px 6px;
  border-bottom: 1px solid #1e1e3a;
`;

const SectionTitle = styled.div`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
  margin-bottom: 6px;
`;

const ToolRow = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const ToolBtn = styled.button<{ active?: boolean }>`
  flex: 1;
  min-width: 36px;
  padding: 5px 4px;
  background: ${(p) => (p.active ? '#2563eb' : '#161628')};
  border: 1px solid ${(p) => (p.active ? '#3b82f6' : '#2a2a4a')};
  border-radius: 4px;
  color: ${(p) => (p.active ? '#fff' : '#888')};
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${(p) => (p.active ? '#1d4ed8' : '#1e1e3a')};
    color: #fff;
  }
`;

const PaletteGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PaletteRow = styled.button<{ active?: boolean; isDialogue?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px;
  background: ${(p) => (p.active ? '#1e2a4a' : 'transparent')};
  border: 1px solid ${(p) => (p.active ? '#3b82f6' : p.isDialogue ? '#20c840' : '#2a2a4a')};
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.15s;
  &:hover {
    background: #1a1a2e;
    border-color: #3b82f6;
  }
`;

const PaletteColorStrip = styled.div`
  display: flex;
  gap: 1px;
  flex-wrap: wrap;
  width: 72px;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  background: ${(p) => p.color};
  border-radius: 1px;
`;

const PaletteName = styled.span<{ isDialogue?: boolean }>`
  font-size: 9px;
  color: ${(p) => (p.isDialogue ? '#20c840' : '#aaa')};
  flex: 1;
`;

const PaletteIndex = styled.span<{ index: number }>`
  font-size: 8px;
  font-weight: bold;
  color: ${(p) =>
    p.index === 0
      ? '#e8a020'
      : p.index === 1
      ? '#2080e8'
      : p.index === 2
      ? '#c020e8'
      : '#20c840'};
`;

const PriorityToggle = styled.button<{ active?: boolean }>`
  width: 100%;
  padding: 5px 6px;
  background: ${(p) => (p.active ? '#2d1b4a' : '#161628')};
  border: 1px solid ${(p) => (p.active ? '#9333ea' : '#2a2a4a')};
  border-radius: 4px;
  color: ${(p) => (p.active ? '#c084fc' : '#666')};
  font-size: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  &:hover {
    background: #221133;
    border-color: #9333ea;
    color: #c084fc;
  }
`;

const ModeSelect = styled.select`
  width: 100%;
  padding: 4px 6px;
  background: #161628;
  border: 1px solid #2a2a4a;
  border-radius: 4px;
  color: #aaa;
  font-size: 10px;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const InfoText = styled.div`
  font-size: 9px;
  color: #444;
  line-height: 1.4;
  padding: 4px 0;
`;

export interface ColorToolbarProps {
  selectedPalette: number;
  activeTool: ColorBrushTool;
  showPriority: boolean;
  paletteMode: BackgroundPaletteMode;
  onSelectPalette: (index: number) => void;
  onSelectTool: (tool: ColorBrushTool) => void;
  onTogglePriority: () => void;
  onChangePaletteMode: (mode: BackgroundPaletteMode) => void;
}

export const ColorToolbar: React.FC<ColorToolbarProps> = ({
  selectedPalette,
  activeTool,
  showPriority,
  paletteMode,
  onSelectPalette,
  onSelectTool,
  onTogglePriority,
  onChangePaletteMode,
}) => {
  return (
    <Toolbar>
      {/* Ferramentas de pintura */}
      <Section>
        <SectionTitle>Ferramenta</SectionTitle>
        <ToolRow>
          <ToolBtn
            active={activeTool === 'pencil'}
            onClick={() => onSelectTool('pencil')}
            title="Pincel - pinta tile por tile"
          >
            Pincel
          </ToolBtn>
          <ToolBtn
            active={activeTool === 'eraser'}
            onClick={() => onSelectTool('eraser')}
            title="Borracha - remove cor do tile"
          >
            Borracha
          </ToolBtn>
        </ToolRow>
        <ToolRow style={{ marginTop: 4 }}>
          <ToolBtn
            active={activeTool === 'magic'}
            onClick={() => onSelectTool('magic')}
            title="Magic Brush - pinta todos tiles com mesma paleta"
          >
            Magic Brush
          </ToolBtn>
        </ToolRow>
      </Section>

      {/* Selecao de paleta */}
      <Section>
        <SectionTitle>Paleta de Cores</SectionTitle>
        <PaletteGrid>
          {DEFAULT_PALETTES.map((palette, index) => {
            const isDialogue = index === DIALOGUE_PALETTE_INDEX;
            return (
              <PaletteRow
                key={palette.id}
                active={selectedPalette === index}
                isDialogue={isDialogue}
                onClick={() => onSelectPalette(index)}
                title={isDialogue ? `${palette.name} - usada para UI/Dialogo` : palette.name}
              >
                <PaletteIndex index={index}>
                  {PALETTE_LABELS[index]}
                </PaletteIndex>
                <PaletteColorStrip>
                  {palette.colors.slice(0, 8).map((color, ci) => (
                    <ColorSwatch key={ci} color={color} />
                  ))}
                </PaletteColorStrip>
                <PaletteName isDialogue={isDialogue}>
                  {isDialogue ? 'UI' : `P${index}`}
                </PaletteName>
              </PaletteRow>
            );
          })}
        </PaletteGrid>
        <InfoText>
          PAL3 usada para UI e dialogos
        </InfoText>
      </Section>

      {/* Priority tiles */}
      <Section>
        <SectionTitle>Priority Tiles</SectionTitle>
        <PriorityToggle
          active={showPriority}
          onClick={onTogglePriority}
          title="Tiles com prioridade aparecem na frente dos sprites"
        >
          {showPriority ? '★ Priority ON' : '☆ Priority OFF'}
        </PriorityToggle>
        <InfoText>
          Tiles com prioridade ficam na frente dos sprites (SGDK layer priority)
        </InfoText>
      </Section>

      {/* Modo de paletas de background */}
      <Section>
        <SectionTitle>Modo de Background</SectionTitle>
        <ModeSelect
          value={paletteMode}
          onChange={(e) => onChangePaletteMode(e.target.value as BackgroundPaletteMode)}
        >
          <option value="manual">Manual</option>
          <option value="automatic">Automatico</option>
          <option value="extract">Extrair Paletas</option>
        </ModeSelect>
        <InfoText>
          {paletteMode === 'manual' && 'Pinte os tiles manualmente'}
          {paletteMode === 'automatic' && 'Paletas geradas automaticamente da imagem'}
          {paletteMode === 'extract' && 'Extrai paletas da imagem de fundo'}
        </InfoText>
      </Section>
    </Toolbar>
  );
};

export default ColorToolbar;
