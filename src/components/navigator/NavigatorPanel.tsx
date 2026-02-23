import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store';
import {
  selectScene,
  addScene,
  removeScene,
  setSelectedTool,
} from '../../store/features/editor/editorSlice';
import { actorSelectors } from '../../store/features/entities/entitiesSlice';
import { Scene } from '../../store/features/entities/entitiesTypes';

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
  background: ${p => p.active ? '#1a1a2e' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${p => p.active ? '#e94560' : 'transparent'};
  color: ${p => p.active ? '#e0e0e0' : '#888'};
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
  background: ${p => p.selected ? '#16213e' : 'transparent'};
  border-left: 3px solid ${p => p.selected ? '#e94560' : 'transparent'};
  color: ${p => p.selected ? '#e0e0e0' : '#aaa'};
  transition: all 0.15s;

  &:hover {
    background: #16213e;
    color: #e0e0e0;
  }

  .icon { font-size: 14px; }
  .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .delete {
    opacity: 0;
    font-size: 10px;
    color: #e94560;
    padding: 2px 4px;
    &:hover { background: rgba(233,69,96,0.2); border-radius: 2px; }
  }
  &:hover .delete { opacity: 1; }
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

type NavTab = 'scenes' | 'actors' | 'assets';

const NavigatorPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<NavTab>('scenes');

  const scenes = useSelector((state: RootState) => state.editor.scenes);
  const selectedSceneId = useSelector((state: RootState) => state.editor.selectedSceneId);
  const actors = useSelector(actorSelectors.selectAll);

  const handleAddScene = () => {
    const newScene: Scene = {
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
    };
    dispatch(addScene(newScene));
  };

  const handleRemoveScene = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeScene(id));
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
        {activeTab === 'scenes' && (
          <>
            <SectionLabel>Fases do Jogo</SectionLabel>
            {scenes.map(scene => (
              <ListItem
                key={scene.id}
                selected={scene.id === selectedSceneId}
                onClick={() => dispatch(selectScene(scene.id))}
              >
                <span className="icon">🗺️</span>
                <span className="name">{scene.name}</span>
                <span
                  className="delete"
                  onClick={(e) => handleRemoveScene(e, scene.id)}
                >✕</span>
              </ListItem>
            ))}
            <AddButton onClick={handleAddScene}>+ Nova Fase</AddButton>
          </>
        )}
        {activeTab === 'actors' && (
          <>
            <SectionLabel>Atores</SectionLabel>
            {actors.length === 0 && (
              <ListItem>
                <span style={{ color: '#555', fontSize: '11px' }}>Nenhum ator criado</span>
              </ListItem>
            )}
            {actors.map(actor => (
              <ListItem key={actor.id}>
                <span className="icon">🎭</span>
                <span className="name">{actor.name}</span>
              </ListItem>
            ))}
          </>
        )}
        {activeTab === 'assets' && (
          <>
            <SectionLabel>Backgrounds</SectionLabel>
            <ListItem><span className="icon">🖼️</span><span className="name">Importar imagem...</span></ListItem>
            <SectionLabel>Tilesets</SectionLabel>
            <ListItem><span className="icon">🧩</span><span className="name">Importar tileset...</span></ListItem>
            <SectionLabel>Sprites</SectionLabel>
            <ListItem><span className="icon">🎮</span><span className="name">Importar sprite...</span></ListItem>
            <SectionLabel>Sons</SectionLabel>
            <ListItem><span className="icon">🔊</span><span className="name">Importar audio...</span></ListItem>
          </>
        )}
      </ScrollList>
    </Panel>
  );
};

export default NavigatorPanel;
