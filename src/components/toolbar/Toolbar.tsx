import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store';
import {
  setSelectedTool,
  setWorldZoom,
  addScene,
} from '../../store/features/editor/editorSlice';
import { generateSGDKCode } from '../../lib/compiler/SGDKCodeBuilder';

// -------------------------------------------------
// Toolbar - Barra de ferramentas principal MD Studio
// Ferramentas de edicao, zoom, e gerador de codigo C
// -------------------------------------------------

const Bar = styled.div`
  height: 44px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 4px;
  flex-shrink: 0;
`;

const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 8px;
  border-right: 1px solid #0f3460;

  &:last-child {
    border-right: none;
  }
`;

const ToolBtn = styled.button<{ active?: boolean; variant?: 'primary' | 'danger' | 'success' }>`
  padding: 5px 10px;
  background: ${p => {
    if (p.variant === 'primary') return p.active ? '#e94560' : 'rgba(233,69,96,0.15)';
    if (p.variant === 'danger') return 'rgba(233,69,96,0.15)';
    if (p.variant === 'success') return 'rgba(46,213,115,0.15)';
    return p.active ? '#0f3460' : 'transparent';
  }};
  border: 1px solid ${p => {
    if (p.variant === 'primary') return p.active ? '#e94560' : 'rgba(233,69,96,0.4)';
    if (p.variant === 'danger') return 'rgba(233,69,96,0.4)';
    if (p.variant === 'success') return 'rgba(46,213,115,0.4)';
    return p.active ? '#e94560' : '#0f3460';
  }};
  color: ${p => {
    if (p.variant === 'success') return '#2ed573';
    if (p.variant === 'danger') return '#e94560';
    return p.active ? '#e94560' : '#aaa';
  }};
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #e94560;
    color: #e0e0e0;
  }
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #e94560;
  letter-spacing: 2px;
  margin-right: 8px;
  text-transform: uppercase;
`;

const Spacer = styled.div`
  flex: 1;
`;

const ZoomLabel = styled.span`
  font-size: 11px;
  color: #aaa;
  min-width: 40px;
  text-align: center;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #16213e;
  border: 1px solid #e94560;
  border-radius: 8px;
  padding: 24px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;

  h2 {
    color: #e94560;
    margin: 0 0 16px;
    font-size: 16px;
  }

  pre {
    background: #0d0d1a;
    border: 1px solid #0f3460;
    border-radius: 4px;
    padding: 16px;
    font-size: 11px;
    color: #2ed573;
    overflow-x: auto;
    white-space: pre-wrap;
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    justify-content: flex-end;
  }
`;

export type EditorTool = 'pointer' | 'hand' | 'actor' | 'trigger' | 'collision' | 'eraser';

const TOOLS: { id: EditorTool; label: string; icon: string; title: string }[] = [
  { id: 'pointer', label: 'V', icon: '👆', title: 'Selecionar' },
  { id: 'hand', label: 'H', icon: '✋', title: 'Mover canvas' },
  { id: 'actor', label: 'A', icon: '🎭', title: 'Adicionar ator' },
  { id: 'trigger', label: 'T', icon: '⚡', title: 'Adicionar trigger/evento' },
  { id: 'collision', label: 'C', icon: '🟥', title: 'Pintar colisao' },
  { id: 'eraser', label: 'E', icon: '🧹', title: 'Apagar' },
];

const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedTool = useSelector((state: RootState) => state.editor.selectedTool);
  const zoom = useSelector((state: RootState) => state.editor.worldZoom);
  const scenes = useSelector((state: RootState) => state.editor.scenes);
  const projectName = useSelector((state: RootState) => state.editor.projectName);

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleZoomIn = () => dispatch(setWorldZoom(Math.min(3, zoom + 0.25)));
  const handleZoomOut = () => dispatch(setWorldZoom(Math.max(0.25, zoom - 0.25)));
  const handleZoomReset = () => dispatch(setWorldZoom(1));

  const handleGenerateCode = () => {
    const code = generateSGDKCode(scenes, projectName || 'MeuJogo');
    setGeneratedCode(code);
    setShowCodeModal(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const handleAddScene = () => {
    dispatch(addScene({
      id: `scene_${Date.now()}`,
      name: `Fase ${scenes.length + 1}`,
      x: 100 + scenes.length * 320,
      y: 100,
      width: 20,
      height: 18,
      backgroundId: null,
      actors: [],
      triggers: [],
      collisions: [],
      tilesetId: null,
      type: 'platformer',
    }));
  };

  return (
    <>
      <Bar>
        <Title>MD</Title>

        <ToolGroup>
          <ToolBtn title="Novo Projeto">Novo</ToolBtn>
          <ToolBtn title="Abrir Projeto">Abrir</ToolBtn>
          <ToolBtn title="Salvar Projeto">Salvar</ToolBtn>
        </ToolGroup>

        <ToolGroup>
          {TOOLS.map(tool => (
            <ToolBtn
              key={tool.id}
              active={selectedTool === tool.id}
              title={tool.title}
              onClick={() => dispatch(setSelectedTool(tool.id))}
            >
              {tool.icon}
            </ToolBtn>
          ))}
        </ToolGroup>

        <ToolGroup>
          <ToolBtn onClick={handleAddScene} variant="primary">+ Fase</ToolBtn>
        </ToolGroup>

        <Spacer />

        <ToolGroup>
          <ToolBtn onClick={handleZoomOut} title="Diminuir zoom">−</ToolBtn>
          <ZoomLabel>{Math.round(zoom * 100)}%</ZoomLabel>
          <ToolBtn onClick={handleZoomIn} title="Aumentar zoom">+</ToolBtn>
          <ToolBtn onClick={handleZoomReset} title="Reset zoom">1:1</ToolBtn>
        </ToolGroup>

        <ToolGroup>
          <ToolBtn
            variant="success"
            onClick={handleGenerateCode}
            title="Gerar codigo C para SGDK"
          >
            Gerar C / SGDK
          </ToolBtn>
        </ToolGroup>
      </Bar>

      {showCodeModal && (
        <Modal onClick={() => setShowCodeModal(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <h2>Codigo C gerado para SGDK</h2>
            <pre>{generatedCode}</pre>
            <div className="actions">
              <ToolBtn variant="primary" onClick={handleCopyCode}>Copiar</ToolBtn>
              <ToolBtn onClick={() => setShowCodeModal(false)}>Fechar</ToolBtn>
            </div>
          </ModalBox>
        </Modal>
      )}
    </>
  );
};

export default Toolbar;
