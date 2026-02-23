import React, { useState } from 'react';
import styled from 'styled-components';
import type { MDSceneType } from '../../lib/scenes/sceneTypes';
import type { MDSceneUsage, MDResolutionMode, LimitCheck } from '../../lib/scenes/sceneLimits';
import { getMDSceneLimits } from '../../lib/scenes/sceneLimits';
import { getSceneLimitsSummary } from '../../lib/scenes/sceneLimitsUtils';

// --------------------------------------------------
// SceneLimitsBar - Barra de limites no estilo GB Studio
// GB Studio: 'A: 0/20 S: 0/96 T: 0/30'
// MD Studio: 'A: 0/16 S: 0/256 BG: 0/1040 T: 0/32'
// Exibe status colorido (ok=cinza, warning=amarelo, error=vermelho)
// Clique expande para o painel completo
// --------------------------------------------------

const Bar = styled.div<{ hasErrors?: boolean; hasWarnings?: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px 8px;
  background: ${(p) =>
    p.hasErrors ? '#2a0a0a' : p.hasWarnings ? '#1e1a00' : '#111118'};
  border-top: 1px solid ${(p) =>
    p.hasErrors ? '#5c1a1a' : p.hasWarnings ? '#4a3e00' : '#1e1e3a'};
  font-size: 10px;
  font-family: monospace;
  cursor: pointer;
  user-select: none;
  min-height: 22px;
  flex-wrap: wrap;
`;

const LimitItem = styled.span<{ status: 'ok' | 'warning' | 'error' }>`
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: bold;
  background: ${
    (p) =>
      p.status === 'error'
        ? 'rgba(239,68,68,0.2)'
        : p.status === 'warning'
        ? 'rgba(234,179,8,0.2)'
        : 'transparent'
  };
  color: ${
    (p) =>
      p.status === 'error'
        ? '#ef4444'
        : p.status === 'warning'
        ? '#eab308'
        : '#666'
  };
  border: 1px solid ${
    (p) =>
      p.status === 'error'
        ? 'rgba(239,68,68,0.4)'
        : p.status === 'warning'
        ? 'rgba(234,179,8,0.3)'
        : 'transparent'
  };
`;

const Separator = styled.span`
  color: #2a2a4a;
  margin: 0 1px;
`;

const ExpandIcon = styled.span<{ expanded?: boolean }>`
  color: #444;
  margin-left: 4px;
  transform: ${(p) => (p.expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  display: inline-block;
  transition: transform 0.15s;
  font-size: 8px;
`;

const WarningBadge = styled.span`
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.4);
  color: #ef4444;
  border-radius: 3px;
  padding: 0 4px;
  font-size: 9px;
  margin-left: 4px;
`;

const ResLabel = styled.span`
  color: #333;
  font-size: 9px;
  margin-left: 4px;
`;

export interface SceneLimitsBarProps {
  sceneType: MDSceneType;
  usage: MDSceneUsage;
  resMode?: MDResolutionMode;
  onExpandToggle?: (expanded: boolean) => void;
  expanded?: boolean;
}

export const SceneLimitsBar: React.FC<SceneLimitsBarProps> = ({
  sceneType,
  usage,
  resMode = 'H40',
  onExpandToggle,
  expanded = false,
}) => {
  const summary = getSceneLimitsSummary(usage, sceneType, resMode);

  const handleClick = () => {
    onExpandToggle?.(!expanded);
  };

  const errorCount = summary.checks.filter((c) => c.status === 'error').length;
  const warnCount = summary.checks.filter((c) => c.status === 'warning').length;

  return (
    <Bar
      hasErrors={summary.hasErrors}
      hasWarnings={summary.hasWarnings && !summary.hasErrors}
      onClick={handleClick}
      title={summary.hasWarnings ? summary.messages.join(' | ') : 'Limites da cena - clique para expandir'}
    >
      {summary.checks.map((check, i) => (
        <React.Fragment key={check.label}>
          {i > 0 && <Separator>|</Separator>}
          <LimitItem status={check.status}>
            {check.label}: {check.current}/{check.max}
          </LimitItem>
        </React.Fragment>
      ))}
      {summary.vram.percentUsed > 0 && (
        <>
          <Separator>|</Separator>
          <LimitItem
            status={
              summary.vram.percentUsed >= 100
                ? 'error'
                : summary.vram.percentUsed >= 80
                ? 'warning'
                : 'ok'
            }
          >
            VRAM: {summary.vram.percentUsed}%
          </LimitItem>
        </>
      )}
      {errorCount > 0 && (
        <WarningBadge>
          {errorCount} erro{errorCount > 1 ? 's' : ''}
        </WarningBadge>
      )}
      {warnCount > 0 && errorCount === 0 && (
        <WarningBadge style={{ background: 'rgba(234,179,8,0.15)', borderColor: 'rgba(234,179,8,0.4)', color: '#eab308' }}>
          {warnCount} aviso{warnCount > 1 ? 's' : ''}
        </WarningBadge>
      )}
      <ResLabel>{resMode}</ResLabel>
      <ExpandIcon expanded={expanded}>&#9660;</ExpandIcon>
    </Bar>
  );
};

export default SceneLimitsBar;
