import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store';
import { editorActions } from '../../store/features/editor/editorSlice';
import { updateScene, sceneSelectors } from '../../store/features/scenes/scenesSlice';
import { backgroundSelectors, musicSelectors, paletteSelectors } from '../../store/features/entities/entitiesSlice';
import ActorEditor from '../editors/ActorEditor';

const Panel = styled.div`
  width: 280px;
  min-width: 240px;
  background: #0d0d1a;
  border-left: 1px solid #0f3460;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 10px 14px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
  font-size: 11px;
  font-weight: 600;
  color: #e94560;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #0f3460; border-radius: 2px; }
`;

const Section = styled.div` margin-bottom: 16px; `;
const SectionTitle = styled.div`
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
  border-bottom: 1px solid #0f3460;
  padding-bottom: 4px;
`;

const Field = styled.div`
  margin-bottom: 8px;
  label {
    display: block;
    font-size: 10px;
    color: #888;
    margin-bottom: 3px;
    text-transform: uppercase;
  }
  input, select {
    width: 100%;
    padding: 5px 8px;
    background: #16213e;
    border: 1px solid #0f3460;
    border-radius: 4px;
    color: #e0e0e0;
    font-size: 11px;
    outline: none;
    box-sizing: border-box;
    &:focus { border-color: #e94560; }
  }
`;

const TabBar = styled.div` display: flex; border-bottom: 1px solid #0f3460; `;
const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 8px 4px;
  background: ${p => p.active ? '#16213e' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${p => p.active ? '#e94560' : 'transparent'};
  color: ${p => p.active ? '#e0e0e0' : '#555'};
  font-size: 10px;
  cursor: pointer;
`;

const SCENE_TYPES = [
  { value: 'topdown', label: 'Top Down' },
  { value: 'platformer', label: 'Platformer' },
  { value: 'pointandclick', label: 'Point & Click' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'logo', label: 'Logo' },
];

const PropertiesPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'scene' | 'actors' | 'triggers' | 'events'>('scene');
  
  const { selectedSceneId } = useSelector((state: RootState) => state.editor);
  const selectedScene = useSelector((state: RootState) => 
    selectedSceneId ? sceneSelectors.selectById(state, selectedSceneId) : null
  );
  
  const backgrounds = useSelector(backgroundSelectors.selectAll);
  const music = useSelector(musicSelectors.selectAll);

  if (!selectedScene) return (
    <Panel>
      <PanelHeader>Propriedades</PanelHeader>
      <div style={{padding:'20px', color:'#555', fontSize:'11px', textAlign:'center'}}>
        Selecione uma cena para ver suas propriedades.
      </div>
    </Panel>
  );

  const handleUpdateScene = (changes: any) => {
    dispatch(updateScene({ id: selectedScene.id, changes }));
  };

  return (
    <Panel>
      <PanelHeader>
        Cena: {selectedScene.name}
        <button onClick={() => dispatch(editorActions.clearSelection())} style={{background:'none', border:'none', color:'#555', cursor:'pointer'}}>x</button>
      </PanelHeader>
      
      <TabBar>
        <Tab active={activeTab === 'scene'} onClick={() => setActiveTab('scene')}>Cena</Tab>
        <Tab active={activeTab === 'actors'} onClick={() => setActiveTab('actors')}>Atores</Tab>
      </TabBar>

      <Content>
        {activeTab === 'scene' && (
          <>
            <Section>
              <SectionTitle>Basico</SectionTitle>
              <Field>
                <label>Nome</label>
                <input value={selectedScene.name} onChange={e => handleUpdateScene({ name: e.target.value })} />
              </Field>
              <Field>
                <label>Tipo (Logic)</label>
                <select value={(selectedScene as any).type || 'topdown'} onChange={e => handleUpdateScene({ type: e.target.value })}>
                  {SCENE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
            </Section>
            
            <Section>
              <SectionTitle>Assets (SGDK)</SectionTitle>
              <Field>
                <label>Background (Plane A)</label>
                <select value={selectedScene.backgroundId} onChange={e => handleUpdateScene({ backgroundId: e.target.value })}>
                  <option value=\"\">Nenhum</option>
                  {backgrounds.map(bg => <option key={bg.id} value={bg.id}>{bg.name}</option>)}
                </select>
              </Field>
              <Field>
                <label>Musica (XGM)</label>
                <select value={selectedScene.musicId || ''} onChange={e => handleUpdateScene({ musicId: e.target.value })}>
                  <option value=\"\">Nenhuma</option>
                  {music.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </Field>
            </Section>

            <Section>
              <SectionTitle>Player Start</SectionTitle>
              <div style={{display:'flex', gap:'8px'}}>
                <Field style={{flex:1}}>
                  <label>X</label>
                  <input type=\"number\" value={selectedScene.playerStartX} onChange={e => handleUpdateScene({ playerStartX: parseInt(e.target.value) || 0 })} />
                </Field>
                <Field style={{flex:1}}>
                  <label>Y</label>
                  <input type=\"number\" value={selectedScene.playerStartY} onChange={e => handleUpdateScene({ playerStartY: parseInt(e.target.value) || 0 })} />
                </Field>
              </div>
            </Section>
          </>
        )}
        
        {activeTab === 'actors' && (
          <Section>
            <SectionTitle>Atores na cena ({selectedScene.actors.length})</SectionTitle>
            {selectedScene.actors.map(actor => (
              <div key={actor.id} style={{padding:'6px', background:'#16213e', border:'1px solid #0f3460', borderRadius:'4px', marginBottom:'4px', color:'#aaa', fontSize:'11px', cursor:'pointer'}}
                   onClick={() => dispatch(editorActions.selectActor({ sceneId: selectedScene.id, actorId: actor.id }))}>
                🎭 {actor.name || 'Ator'} ({actor.id.slice(0,4)})
              </div>
            ))}
          </Section>
        )}
      </Content>
    </Panel>
  );
};

export default PropertiesPanel;
