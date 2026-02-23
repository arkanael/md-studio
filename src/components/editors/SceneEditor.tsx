import React, { useState } from 'react';
import styled from 'styled-components';
import { Scene, Actor, Trigger } from '../../types';

interface SceneEditorProps {
  scene: Scene;
  onUpdate: (scene: Scene) => void;
}

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #2d2d2d;
  color: #fff;
  height: 100%;
`;

const CanvasArea = styled.div`
  width: 100%;
  height: 480px;
  background: #000;
  border: 1px solid #444;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ControlsArea = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const PropertyField = styled.div`
  display: flex;
  flex-direction: column;
  label {
    font-size: 12px;
    margin-bottom: 5px;
    color: #aaa;
  }
  input, select {
    background: #3d3d3d;
    border: 1px solid #555;
    color: #fff;
    padding: 8px;
    border-radius: 4px;
  }
`;

export const SceneEditor: React.FC<SceneEditorProps> = ({ scene, onUpdate }) => {
  return (
    <EditorContainer>
      <h3>Editor de Cena: {scene.name}</h3>
      <CanvasArea>
        {/* Placeholder para o canvas de renderização SGDK */}
        <div style={{ color: '#666' }}>Canvas de Visualização (Sega Mega Drive 320x224)</div>
      </CanvasArea>
      
      <ControlsArea>
        <PropertyField>
          <label>Nome da Cena</label>
          <input 
            value={scene.name} 
            onChange={(e) => onUpdate({ ...scene, name: e.target.value })} 
          />
        </PropertyField>
        <PropertyField>
          <label>Background (SGDK .res)</label>
          <input 
            value={scene.backgroundId} 
            onChange={(e) => onUpdate({ ...scene, backgroundId: e.target.value })} 
          />
        </PropertyField>
        <PropertyField>
          <label>Modo de Scroll</label>
          <select value={scene.scrollMode} onChange={(e) => onUpdate({ ...scene, scrollMode: e.target.value })}>
            <option value="none">Nenhum</option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="both">Ambos (Parallax)</option>
          </select>
        </PropertyField>
      </ControlsArea>
    </EditorContainer>
  );
};
