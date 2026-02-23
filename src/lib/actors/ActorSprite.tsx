import React from 'react';
import { ActorData } from './actorTypes';

interface ActorSpriteProps {
  actor: ActorData;
  selected?: boolean;
  onClick?: () => void;
}

const TILE_SIZE = 16;

const directionToAngle: Record<ActorData['direction'], number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

export const ActorSprite: React.FC<ActorSpriteProps> = ({
  actor,
  selected = false,
  onClick,
}) => {
  const angle = directionToAngle[actor.direction];

  const style: React.CSSProperties = {
    position: 'absolute',
    left: actor.x * TILE_SIZE,
    top: actor.y * TILE_SIZE,
    width: TILE_SIZE * 2,
    height: TILE_SIZE * 2,
    cursor: 'pointer',
    outline: selected ? '2px solid #00bcd4' : 'none',
    zIndex: selected ? 10 : 5,
    transform: `rotate(${angle}deg)`,
    transformOrigin: 'center',
  };

  return (
    <div
      className={`actor-sprite${selected ? ' actor-sprite--selected' : ''}`}
      style={style}
      onClick={onClick}
      title={actor.name}
      data-actor-id={actor.id}
    >
      <div className="actor-sprite__body">
        {actor.spriteSheetId ? (
          <img
            src={`/sprites/${actor.spriteSheetId}.png`}
            alt={actor.name}
            style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
          />
        ) : (
          <div
            className="actor-sprite__placeholder"
            style={{
              width: '100%',
              height: '100%',
              background: '#444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              color: '#aaa',
            }}
          >
            {actor.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {selected && (
        <div
          className="actor-sprite__label"
          style={{
            position: 'absolute',
            bottom: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: '#fff',
            whiteSpace: 'nowrap',
            background: 'rgba(0,0,0,0.6)',
            padding: '1px 4px',
            borderRadius: 2,
          }}
        >
          {actor.name}
        </div>
      )}
    </div>
  );
};

export default ActorSprite;
