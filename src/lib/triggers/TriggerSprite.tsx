import React from 'react';
import { TriggerData } from './triggerTypes';

interface TriggerSpriteProps {
  trigger: TriggerData;
  selected?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.MouseEvent, triggerId: string) => void;
}

const TILE_SIZE = 16;

export const TriggerSprite: React.FC<TriggerSpriteProps> = ({
  trigger,
  selected = false,
  onClick,
  onDragStart,
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: trigger.x * TILE_SIZE,
    top: trigger.y * TILE_SIZE,
    width: trigger.width * TILE_SIZE,
    height: trigger.height * TILE_SIZE,
    cursor: 'pointer',
    zIndex: selected ? 10 : 4,
    boxSizing: 'border-box',
    border: selected
      ? '2px solid #00bcd4'
      : '1px dashed rgba(0, 188, 212, 0.6)',
    background: selected
      ? 'rgba(0, 188, 212, 0.25)'
      : 'rgba(0, 188, 212, 0.1)',
    borderRadius: 2,
  };

  return (
    <div
      className={`trigger-sprite${selected ? ' trigger-sprite--selected' : ''}`}
      style={style}
      onClick={onClick}
      onMouseDown={(e) => onDragStart?.(e, trigger.id)}
      title={trigger.name}
      data-trigger-id={trigger.id}
    >
      {selected && (
        <>
          <div
            className="trigger-sprite__label"
            style={{
              position: 'absolute',
              top: 2,
              left: 4,
              fontSize: 9,
              color: '#00bcd4',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: trigger.width * TILE_SIZE - 8,
              pointerEvents: 'none',
              fontWeight: 'bold',
            }}
          >
            {trigger.name}
          </div>
          {/* Script indicator */}
          {trigger.script.length > 0 && (
            <div
              className="trigger-sprite__script-badge"
              style={{
                position: 'absolute',
                bottom: 2,
                right: 4,
                fontSize: 9,
                color: '#fff',
                background: '#00bcd4',
                borderRadius: 3,
                padding: '0 3px',
                pointerEvents: 'none',
              }}
            >
              {trigger.script.length}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TriggerSprite;
