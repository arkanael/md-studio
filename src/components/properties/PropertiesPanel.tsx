import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store';
import {
  updateScene,
  selectScene,
} from '../../store/features/editor/editorSlice';
import ActorEditor from '../editors/ActorEditor';

// -------------------------------------------------
// PropertiesPanel - Painel de propriedades direito
// Mostra e edita as propriedades da cena ou ator
// selecionado no WorldEditor
// -------------------------------------------------

const Panel = styled.div`
  width: 260px;
  min-width: 220px;
  background: #0d0d1a;
  border-left: 1px solid #0f3460;
  display: flex;
  flex-direction: column;
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

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  padding: 0;

  &:hover { color: #e94560; }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #0f3460; border-radius: 2px; }
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

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
    letter-spacing: 0.5px;
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
    transition: border-color 0.2s;

    &:focus { border-color: #e94560; }
    &:hover { border-color: #1a4a8a; }
  }
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
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
  color: ${p => p.active ? '#e0e0e0' : '#555'};
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { color: #aaa; }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 1px 6px;
  background: rgba(233,69,96,0.2);
  border: 1px solid rgba(233,69,96,0.4);
  border-radius: 10px;
  font-size: 9px;
  color: #e94560;
  margin-left: 6px;
`;

const EventItem = styled.div`
  padding: 6px 8px;
  background: #16213e;
  border: 1px solid #0f3460;
  border-radius: 4px;
  margin-bottom: 6px;
  font-size: 11px;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover { border-color: #e94560; color: #e0e0e0; }

  .event-icon { color: #e94560; }
`;

const AddEventBtn = styled.button`
  width: 100%;
  padding: 6px;
  background: rgba(233,69,96,0.1);
  border: 1px dashed rgba(233,69,96,0.4);
  border-radius: 4px;
  color: #e94560;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: rgba(233,69,96,0.2); }
`;

type PropTab = 'scene' | 'actors' | 'events';

const SCENE_TYPES = [
  { value: 'platformer', label: 'Plataforma' },
  { value: 'topdown', label: 'Top-Down' },
  { value: 'shooter', label: 'Shoot em Up' },
  { value: 'adventure', label: 'Aventura' },
];

const EVENT_TYPES = [
  { icon: '▶️', label: 'Ao iniciar a fase' },
  { icon: '🚶', label: 'Ao sair pela direita' },
  { icon: '🚶', label: 'Ao sair pela esquerda' },
  { icon: '⚡', label: 'Ao tocar ator' },
  { icon: '🏆', label: 'Ao pegar item' },
  { icon: '💀', label: 'Ao morrer' },
];

const PropertiesPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<PropTab>('scene');
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);

  const selectedSceneId = useSelector((state: RootState) => state.editor.selectedSceneId);
  const scenes = useSelector((state: RootState) => state.editor.scenes);
  const selectedScene = scenes.find(s => s.id === selectedSceneId);

  if (!selectedScene) return null;

  const handleSceneChange = (field: string, value: string | number) => {
    dispatch(updateScene({ id: selectedScene.id, changes: { [field]: value } }));
  };

  return (
    <Panel>
      <PanelHeader>
        Propriedades
        <CloseBtn onClick={() => dispatch(selectScene(null))}>x</CloseBtn>
      </PanelHeader>

      <TabBar>
        <Tab active={activeTab === 'scene'} onClick={() => setActiveTab('scene')}>Cena</Tab>
        <Tab active={activeTab === 'actors'} onClick={() => setActiveTab('actors')}>
          Atores
          {selectedScene.actors.length > 0 && <Badge>{selectedScene.actors.length}</Badge>}
        </Tab>
        <Tab active={activeTab === 'events'} onClick={() => setActiveTab('events')}>Eventos</Tab>
      </TabBar>

      <Content>
        {activeTab === 'scene' && (
          <>
            <Section>
              <SectionTitle>Identificacao</SectionTitle>
              <Field>
                <label>Nome da Fase</label>
                <input
                  value={selectedScene.name}
                  onChange={e => handleSceneChange('name', e.target.value)}
                />
              </Field>
              <Field>
                <label>Tipo de Jogo</label>
                <select
                  value={selectedScene.type}
                  onChange={e => handleSceneChange('type', e.target.value)}
                >
                  {SCENE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>
            </Section>

            <Section>
              <SectionTitle>Dimensoes (Tiles)</SectionTitle>
              <FieldRow>
                <Field>
                  <label>Largura</label>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    value={selectedScene.width}
                    onChange={e => handleSceneChange('width', parseInt(e.target.value))}
                  />
                </Field>
                <Field>
                  <label>Altura</label>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    value={selectedScene.height}
                    onChange={e => handleSceneChange('height', parseInt(e.target.value))}
                  />
                </Field>
              </FieldRow>
            </Section>

            <Section>
              <SectionTitle>Posicao no Mapa</SectionTitle>
              <FieldRow>
                <Field>
                  <label>X</label>
                  <input
                    type="number"
                    value={selectedScene.x}
                    onChange={e => handleSceneChange('x', parseInt(e.target.value))}
                  />
                </Field>
                <Field>
                  <label>Y</label>
                  <input
                    type="number"
                    value={selectedScene.y}
                    onChange={e => handleSceneChange('y', parseInt(e.target.value))}
                  />
                </Field>
              </FieldRow>
            </Section>

            <Section>
              <SectionTitle>Background</SectionTitle>
              <Field>
                <label>Imagem de Fundo</label>
                <select value={selectedScene.backgroundId || ''}>
                  <option value="">Nenhum</option>
                </select>
              </Field>
              <Field>
                <label>Tileset</label>
                <select value={selectedScene.tilesetId || ''}>
                  <option value="">Nenhum</option>
                </select>
              </Field>
            </Section>

            <Section>
              <SectionTitle>Configuracao SGDK</SectionTitle>
              <Field>
                <label>Plano de Fundo</label>
                <select defaultValue="BG_A">
                  <option value="BG_A">Plano A (BGA)</option>
                  <option value="BG_B">Plano B (BGB)</option>
                  <option value="WINDOW">Window</option>
                </select>
              </Field>
              <Field>
                <label>Musica (XGM)</label>
                <input placeholder="Ex: music_stage1" />
              </Field>
            </Section>
          </>
        )}

        {activeTab === 'actors' && (
          <Section>
            <SectionTitle>Atores na Cena ({selectedScene.actors.length})</SectionTitle>
            {selectedScene.actors.length === 0 ? (
              <div style={{ color: '#555', fontSize: '11px', textAlign: 'center', padding: '20px 0' }}>
                Nenhum ator. Use a ferramenta Ator para adicionar.
              </div>
            ) : (
              selectedScene.actors.map(actorId => (
                <EventItem
                  key={actorId}
                  onClick={() => setSelectedActorId(actorId)}
                >
                  <span className="event-icon">🎭</span>
                  {actorId}
                </EventItem>
              ))
            )}
          </Section>
        )}

        {activeTab === 'events' && (
          <Section>
            <SectionTitle>Eventos da Cena</SectionTitle>
            {selectedScene.triggers.length === 0 ? (
              <>
                {EVENT_TYPES.slice(0, 2).map((evt, i) => (
                  <EventItem key={i}>
                    <span className="event-icon">{evt.icon}</span>
                    {evt.label}
                  </EventItem>
                ))}
                <AddEventBtn>+ Adicionar Evento</AddEventBtn>
              </>
            ) : (
              <>
                {selectedScene.triggers.map(triggerId => (
                  <EventItem key={triggerId}>
                    <span className="event-icon">⚡</span>
                    {triggerId}
                  </EventItem>
                ))}
                <AddEventBtn>+ Adicionar Evento</AddEventBtn>
              </>
            )}
          </Section>
        )}
      </Content>

      {selectedActorId && (
        <ActorEditor
          actorId={selectedActorId}
          onClose={() => setSelectedActorId(null)}
        />
      )}
    </Panel>
  );
};

export default PropertiesPanel;
