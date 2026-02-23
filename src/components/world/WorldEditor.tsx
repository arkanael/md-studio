import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editorActions } from '../../store/features/editor/editorSlice';
import type { RootState } from '../../store/store';
import type { MDScene } from '../../store/features/entities/entitiesTypes';
import SceneView from './SceneView';
import styled from 'styled-components';

// --------------------------------------------------
// Layout principal do editor (inspirado no GB Studio)
// Layout: Sidebar | Canvas Area
// --------------------------------------------------

const EditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a1a2e;
  color: #e0e0e0;
  font-family: 'Segoe UI', system-ui, sans-serif;
`;

const Sidebar = styled.aside`
  width: 220px;
  min-width: 180px;
  max-width: 300px;
  background: #16213e;
  border-right: 1px solid #0f3460;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #e94560;
  border-bottom: 1px solid #0f3460;
`;

const SidebarList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 8px 0;
  overflow-y: auto;
  flex: 1;
`;

const SidebarItem = styled.li<{ $active?: boolean }>`
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  border-left: 3px solid ${(p) => (p.$active ? '#e94560' : 'transparent')};
  background: ${(p) => (p.$active ? '#0f3460' : 'transparent')};
  color: ${(p) => (p.$active ? '#ffffff' : '#a0a0c0')};
  transition: all 0.15s;
  &:hover {
    background: #0f3460;
    color: #fff;
  }
`;

const CanvasArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const Toolbar = styled.div`
  height: 40px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  flex-shrink: 0;
`;

const ToolButton = styled.button<{ $active?: boolean }>`
  background: ${(p) => (p.$active ? '#e94560' : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? '#e94560' : '#0f3460')};
  color: ${(p) => (p.$active ? '#fff' : '#a0a0c0')};
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
  &:hover { background: #0f3460; color: #fff; }
`;

const WorldCanvas = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  background:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 8px 8px;
  background-color: #1a1a2e;
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 4px;
  z-index: 10;
`;

const ZoomBtn = styled.button`
  width: 28px;
  height: 28px;
  background: #16213e;
  border: 1px solid #0f3460;
  color: #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #0f3460; }
`;

const StatusBar = styled.div`
  height: 22px;
  background: #0f3460;
  border-top: 1px solid #0f3460;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 11px;
  color: #a0a0c0;
  gap: 16px;
  flex-shrink: 0;
`;

// --------------------------------------------------
// Componente WorldEditor
// --------------------------------------------------
const WorldEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { zoom, tool, focusedSceneId, showGrid, showCollisions, isModified } = useSelector(
    (state: RootState) => state.editor
  );
  // Simulando lista de cenas para o painel lateral
  const scenes: MDScene[] = useSelector((state: RootState) => state.project?.scenes ?? []);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Roda do mouse para zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) dispatch(editorActions.zoomIn());
        else dispatch(editorActions.zoomOut());
      }
    },
    [dispatch]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const tileX = Math.floor((e.clientX - rect.left) / (8 * zoom));
      const tileY = Math.floor((e.clientY - rect.top) / (8 * zoom));
      setMousePos({ x: tileX, y: tileY });
    }
  }, [zoom]);

  return (
    <EditorContainer>
      {/* === SIDEBAR ESQUERDA === */}
      <Sidebar>
        <SidebarHeader>MD Studio</SidebarHeader>

        {/* Secao: Cenas */}
        <SidebarHeader style={{ fontSize: '10px', padding: '8px 16px' }}>Cenas</SidebarHeader>
        <SidebarList>
          {scenes.length === 0 && (
            <SidebarItem
              onClick={() => {/* TODO: criar nova cena */}}
              style={{ color: '#666', fontStyle: 'italic' }}
            >
              + Nova cena
            </SidebarItem>
          )}
          {scenes.map((scene) => (
            <SidebarItem
              key={scene.id}
              $active={scene.id === focusedSceneId}
              onClick={() => dispatch(editorActions.focusScene(scene.id))}
            >
              {scene.name || 'Cena sem nome'}
            </SidebarItem>
          ))}
        </SidebarList>

        {/* Botao voltar ao mundo */}
        {focusedSceneId && (
          <div style={{ padding: '8px 12px', borderTop: '1px solid #0f3460' }}>
            <ToolButton onClick={() => dispatch(editorActions.goBackToWorld())}>
              Voltar ao mapa
            </ToolButton>
          </div>
        )}
      </Sidebar>

      {/* === AREA PRINCIPAL === */}
      <CanvasArea>
        {/* Toolbar de ferramentas */}
        <Toolbar>
          {(['select', 'actor', 'trigger', 'collision', 'eraser'] as const).map((t) => (
            <ToolButton
              key={t}
              $active={tool === t}
              onClick={() => dispatch(editorActions.setTool(t))}
              title={t}
            >
              {t === 'select' && 'Selecionar'}
              {t === 'actor' && 'Ator'}
              {t === 'trigger' && 'Trigger'}
              {t === 'collision' && 'Colisao'}
              {t === 'eraser' && 'Apagar'}
            </ToolButton>
          ))}

          <div style={{ flex: 1 }} />

          <ToolButton
            $active={showGrid}
            onClick={() => dispatch(editorActions.toggleGrid())}
            title="Mostrar grade"
          >
            Grade
          </ToolButton>
          <ToolButton
            $active={showCollisions}
            onClick={() => dispatch(editorActions.toggleCollisions())}
            title="Mostrar colisoes"
          >
            Colisoes
          </ToolButton>
        </Toolbar>

        {/* Canvas de edicao */}
        <WorldCanvas
          ref={canvasRef}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
        >
          {/* Renderizar cenas */}
          {scenes.map((scene) => (
            <SceneView
              key={scene.id}
              scene={scene}
              zoom={zoom}
              showGrid={showGrid}
              showCollisions={showCollisions}
              isSelected={scene.id === focusedSceneId}
              onSelect={() => dispatch(editorActions.focusScene(scene.id))}
            />
          ))}

          {/* Controles de zoom */}
          <ZoomControls>
            <ZoomBtn onClick={() => dispatch(editorActions.zoomIn())} title="Zoom +">+</ZoomBtn>
            <ZoomBtn onClick={() => dispatch(editorActions.resetZoom())} title="Reset zoom">
              {Math.round(zoom * 100)}%
            </ZoomBtn>
            <ZoomBtn onClick={() => dispatch(editorActions.zoomOut())} title="Zoom -">-</ZoomBtn>
          </ZoomControls>
        </WorldCanvas>

        {/* Barra de status */}
        <StatusBar>
          <span>Tile: ({mousePos.x}, {mousePos.y})</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Ferramenta: {tool}</span>
          <span style={{ marginLeft: 'auto', color: isModified ? '#e94560' : '#4caf50' }}>
            {isModified ? 'Nao salvo' : 'Salvo'}
          </span>
        </StatusBar>
      </CanvasArea>
    </EditorContainer>
  );
};

export default WorldEditor;
