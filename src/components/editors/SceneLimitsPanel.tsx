import React from 'react';
import styled from 'styled-components';
import type { MDSceneType } from '../../lib/scenes/sceneTypes';
import type { MDSceneUsage, MDResolutionMode } from '../../lib/scenes/sceneLimits';
import { getSceneLimitsSummary } from '../../lib/scenes/sceneLimitsUtils';

// --------------------------------------------------
// SceneLimitsPanel - Painel detalhado de limites
// Exibe barras de progresso para cada recurso do hardware
// Avisos detalhados e sugestoes para otimizacao SGDK
// --------------------------------------------------

const Panel = styled.div`
  background: #0d0d1a;
  border-top: 1px solid #1e1e3a;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  color: #aaa;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
`;

const LimitCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span<{ status: 'ok' | 'warning' | 'error' }>`
  color: ${(p) => (p.status === 'error' ? '#ef4444' : p.status === 'warning' ? '#eab308' : '#fff')};
`;

const ProgressBar = styled.div`
  height: 4px;
  background: #161628;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number; status: 'ok' | 'warning' | 'error' }>`
  height: 100%;
  width: ${(p) => Math.min(100, p.percent)}%;
  background: ${(p) => (p.status === 'error' ? '#ef4444' : p.status === 'warning' ? '#eab308' : '#2563eb')};
  transition: width 0.3s ease;
`;

const MessagesArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

const Message = styled.div<{ type: 'warning' | 'error' }>`
  font-size: 10px;
  padding: 6px 8px;
  border-radius: 4px;
  background: ${(p) => (p.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)')};
  border: 1px solid ${(p) => (p.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)')};
  color: ${(p) => (p.type === 'error' ? '#fca5a5' : '#fde047')};
  line-height: 1.4;
`;

const DensityMsg = styled(Message)`
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.2);
  color: #93c5fd;
`;

export interface SceneLimitsPanelProps {
  sceneType: MDSceneType;
  usage: MDSceneUsage;
  resMode?: MDResolutionMode;
}

export const SceneLimitsPanel: React.FC<SceneLimitsPanelProps> = ({
  sceneType,
  usage,
  resMode = 'H40',
}) => {
  const summary = getSceneLimitsSummary(usage, sceneType, resMode);

  return (
    <Panel>
      <Grid>
        {summary.checks.map((check) => (
          <LimitCard key={check.label}>
            <LabelRow>
              <span>{getLabelName(check.label)}</span>
              <Value status={check.status}>
                {check.current} / {check.max}
              </Value>
            </LabelRow>
            <ProgressBar>
              <ProgressFill
                percent={(check.current / check.max) * 100}
                status={check.status}
              />
            </ProgressBar>
          </LimitCard>
        ))}

        <LimitCard>
          <LabelRow>
            <span>Uso Geral VRAM</span>
            <Value
              status={
                summary.vram.percentUsed >= 100
                  ? 'error'
                  : summary.vram.percentUsed >= 80
                  ? 'warning'
                  : 'ok'
              }
            >
              {summary.vram.percentUsed}%
            </Value>
          </LabelRow>
          <ProgressBar>
            <ProgressFill
              percent={summary.vram.percentUsed}
              status={
                summary.vram.percentUsed >= 100
                  ? 'error'
                  : summary.vram.percentUsed >= 80
                  ? 'warning'
                  : 'ok'
              }
            />
          </ProgressBar>
        </LimitCard>
      </Grid>

      <MessagesArea>
        {summary.messages.map((msg, i) => (
          <Message key={i} type={msg.includes('excedido') || msg.includes('excedida') ? 'error' : 'warning'}>
            {msg}
          </Message>
        ))}
        {summary.actorDensity.hasWarning && (
          <DensityMsg type="warning">
            {summary.actorDensity.message}
          </DensityMsg>
        )}
        {!summary.hasErrors && !summary.hasWarnings && summary.messages.length === 0 && (
          <div style={{ fontSize: '10px', color: '#444', textAlign: 'center' }}>
            Todos os limites estao dentro da capacidade do hardware Mega Drive.
          </div>
        )}
      </MessagesArea>
    </Panel>
  );
};

function getLabelName(label: string): string {
  switch (label) {
    case 'A': return 'Atores (Metasprites)';
    case 'S': return 'Tiles de Sprite';
    case 'T': return 'Triggers (Software)';
    case 'BG': return 'Tiles de Background';
    case 'PAL': return 'Paletas';
    default: return label;
  }
}

export default SceneLimitsPanel;
