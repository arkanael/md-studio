import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  addScene,
  removeScene,
  duplicateScene,
  sceneSelectors,
} from '../../store/features/scenes/scenesSlice';
import { editorActions } from '../../store/features/editor/editorSlice';
import type { RootState } from '../../store/index';

// -------------------------------------------------
// NavigatorPanel - Painel lateral esquerdo
// Lista cenas, atores, backgrounds e recursos
// Inspirado no GB Studio Navigator
// -------------------------------------------------

const Panel = styled.div`
  width: 220px;
  min-width: 180px;
  background: #0d0d1a;
  border-right: 1px solid #0f3460;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 10px 12px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
  font-size: 12px;
  font-weight: 600;
  color: #e94560;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #0f3460;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 6px 4px;
  background: ${(p) => (p.active ? '#1a1a2e' : 'transparent')};
  border: none;
  border-bottom: 2px solid ${(p) => (p.active ? '#e94560' : 'transparent')};
  color: ${(p) => (p.active ? '#e0e0e0' : '#888')};
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #e0e0e0;
    background: #1a1a2e;
  }
`;

const ScrollList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #0f3460; border-radius: 2px; }
`;

const ListItem = styled.div<{ selected?: boolean }>`
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${(p) => (p.selected ? '#16213e' : 'transparent')};
  border-left: 3px solid ${(p) => (p.selected ? '#e94560' : 'transparent')};
  color: ${(p) => (p.selected ? '#e0e0e0' : '#aaa')};
  transition: all 0.15s;
  &:hover {
    background: #16213e;
    color: #e0e0e0;
  }
  .icon { font-size: 14px; }
  .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .actions {
    display: none;
    gap: 2px;
    align-items: center;
  }
  &:hover .actions { display: flex; }
  .action-btn {
    font-size: 10px;
    color: #666;
    padding: 2px 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 2px;
    &:hover { background: rgba(255,255,255,0.1); color: #e0e0e0; }
    &.danger:hover { background: rgba(233,69,96,0.2); color: #e94560; }
  }
`;

const AddButton = styled.button`
  width: calc(100% - 24px);
  margin: 8px 12px;
  padding: 6px;
  background: rgba(233, 69, 96, 0.15);
  border: 1px dashed #e94560;
  border-radius: 4px;
  color: #e94560;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(233, 69, 96, 0.3);
  }
`;

const SectionLabel = styled.div`
  padding: 4px 12px;
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 4px;
`;

const EmptyMessage = styled.div`
  padding: 16px 12px;
  font-size: 11px;
  color: #444;
  text-align: center;
  line-height: 1.5;
`;

type NavTab = 'scenes' | 'actors' | 'assets';

const NavigatorPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<NavTab>('scenes');

  // Dados do store
  const scenes = useSelector(sceneSelectors.selectAll);
  const selectedSceneId = useSelector((state: RootState) => state.editor.selectedSceneId);
  const focusedSceneId = useSelector((state: RootState) => state.editor.focusedSceneId);

  // Atores da cena focada
  const focusedScene = useSelector((state: RootState) =>
    focusedSceneId ? state.scenes.entities[focusedSceneId] : null
  );

  const handleAddScene = () => {
    dispatch(addScene({ name: `Fase ${scenes.length + 1}` }));
  };

  const handleRemoveScene = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Remover esta cena?')) {
      dispatch(removeScene(id));
      if (focusedSceneId === id) {
        dispatch(editorActions.goBackToWorld());
      }
    }
  };

  const handleDuplicateScene = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(duplicateScene(id));
  };

  return (
    <Panel>
      <PanelHeader>MD Studio</PanelHeader>

      <TabBar>
        <Tab active={activeTab === 'scenes'} onClick={() => setActiveTab('scenes')}>Cenas</Tab>
        <Tab active={activeTab === 'actors'} onClick={() => setActiveTab('actors')}>Atores</Tab>
        <Tab active={activeTab === 'assets'} onClick={() => setActiveTab('assets')}>Assets</Tab>
      </TabBar>

      <ScrollList>
        {/* === ABA: CENAS === */}
        {activeTab === 'scenes' && (
          <>
            <SectionLabel>Fases do Jogo ({scenes.length})</SectionLabel>

            {scenes.length === 0 && (
              <EmptyMessage>
                Nenhuma cena criada.<br />
                Clique em &quot;+ Nova Fase&quot; para comecar.
              </EmptyMessage>
            )}

            {scenes.map((scene) => (
              <ListItem
                key={scene.id}
                selected={scene.id === (selectedSceneId ?? focusedSceneId)}
                onClick={() => {
                  dispatch(editorActions.selectScene(scene.id));
                  dispatch(editorActions.focusScene(scene.id));
                }}
              >
                <span className="icon">🗺</span>
                <span className="name">{scene.name}</span>
                <div className="actions">
                  <button
                    className="action-btn"
                    title="Duplicar cena"
                    onClick={(e) => handleDuplicateScene(e, scene.id)}
                  >
                    ⧉
                  </button>
                  <button
                    className="action-btn danger"
                    title="Remover cena"
                    onClick={(e) => handleRemoveScene(e, scene.id)}
                  >
                    ✕
                  </button>
                </div>
              </ListItem>
            ))}

            <AddButton onClick={handleAddScene}>+ Nova Fase</AddButton>
          </>
        )}

        {/* === ABA: ATORES === */}
        {activeTab === 'actors' && (
          <>
            <SectionLabel>
              {focusedScene ? `Atores: ${focusedScene.name}` : 'Atores'}
            </SectionLabel>

            {!focusedScene && (
              <EmptyMessage>Selecione uma cena para ver seus atores.</EmptyMessage>
            )}

            {focusedScene && focusedScene.actors.length === 0 && (
              <EmptyMessage>
                Nenhum ator nesta cena.<br />
                Use a ferramenta Ator para adicionar.
              </EmptyMessage>
            )}

            {focusedScene?.actors.map((actor) => (
              <ListItem
                key={actor.id}
                onClick={() =>
                  dispatch(editorActions.selectActor({ sceneId: focusedScene.id, actorId: actor.id }))
                }
              >
                <span className="icon">🎭</span>
                <span className="name">{actor.name || 'Ator sem nome'}</span>
              </ListItem>
            ))}
          </>
        )}

        {/* === ABA: ASSETS === */}
        {activeTab === 'assets' && (
          <>
            <SectionLabel>Backgrounds</SectionLabel>
            <ListItem><span className="icon">🖼</span><span className="name">Importar imagem...</span></ListItem>

            <SectionLabel>Sprites</SectionLabel>
            <ListItem><span className="icon">🎮</span><span className="name">Importar sprite...</span></ListItem>

            <SectionLabel>Paletas</SectionLabel>
            <ListItem><span className="icon">🎨</span><span className="name">Gerenciar paletas...</span></ListItem>

            <SectionLabel>Musica (XGM)</SectionLabel>
            <ListItem><span className="icon">🎵</span><span className="name">Importar .xgm...</span></ListItem>

            <SectionLabel>Sons (PCM)</SectionLabel>
            <ListItem><span className="icon">🔊</span><span className="name">Importar audio...</span></ListItem>
          </>
        )}
      </ScrollList>
    </Panel>
  );
};

export default NavigatorPanel;
