import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editorActions } from '../../store/features/editor/editorSlice';
import { addScene, sceneSelectors } from '../../store/features/scenes/scenesSlice';
import type { RootState } from '../../store/index';
import SceneView from './SceneView';
import NavigatorPanel from '../navigator/NavigatorPanel';
import PropertiesPanel from '../properties/PropertiesPanel';
import styled from 'styled-components';

// --------------------------------------------------
// Layout principal do editor (inspirado no GB Studio)
// Layout: Navigator | Canvas Area | Properties
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

  const scenes = useSelector(sceneSelectors.selectAll);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(editorActions.clearSelection());
    }
  }, [dispatch]);

  const handleAddScene = useCallback(() => {
    dispatch(addScene({ name: `Cena ${scenes.length + 1}` }));
  }, [dispatch, scenes.length]);

  return (
    <EditorContainer>
      {/* === NAVIGATOR PANEL === */}
      <NavigatorPanel />

      {/* === AREA PRINCIPAL === */}
      <CanvasArea>
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
          >
            Grade
          </ToolButton>
          <ToolButton
            $active={showCollisions}
            onClick={() => dispatch(editorActions.toggleCollisions())}
          >
            Colisoes
          </ToolButton>
          <ToolButton onClick={handleAddScene} title=\"Adicionar nova cena\">
            + Cena
          </ToolButton>
        </Toolbar>

        <WorldCanvas
          ref={canvasRef}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
        >
          {scenes.map((scene) => (
            <SceneView
              key={scene.id}
              scene={scene}
              zoom={zoom}
              showGrid={showGrid}
              showCollisions={showCollisions}
              isSelected={scene.id === focusedSceneId}
              onSelect={() => dispatch(editorActions.selectScene(scene.id))}
            />
          ))}

          {scenes.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#555' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>+</div>
              <div>Clique em \"+ Cena\" para criar sua primeira cena</div>
            </div>
          )}

          <ZoomControls>
            <ZoomBtn onClick={() => dispatch(editorActions.zoomIn())}>+</ZoomBtn>
            <ZoomBtn onClick={() => dispatch(editorActions.resetZoom())}>
              {Math.round(zoom * 100)}%
            </ZoomBtn>
            <ZoomBtn onClick={() => dispatch(editorActions.zoomOut())}>-</ZoomBtn>
          </ZoomControls>
        </WorldCanvas>

        <StatusBar>
          <span>Tile: ({mousePos.x}, {mousePos.y})</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Ferramenta: {tool}</span>
          <span>Cenas: {scenes.length}</span>
          <span style={{ marginLeft: 'auto', color: isModified ? '#e94560' : '#4caf50' }}>
            {isModified ? 'Nao salvo' : 'Salvo'}
          </span>
        </StatusBar>
      </CanvasArea>

      {/* === PROPERTIES PANEL === */}
      <PropertiesPanel />
    </EditorContainer>
  );
};

export default WorldEditor;
