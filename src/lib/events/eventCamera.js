// eventCamera.js - Eventos de Camera para MD Studio (SGDK/Mega Drive)
// No Mega Drive, a camera e implementada movendo o plano de scroll do VDP
// usando VDP_setHorizontalScroll e VDP_setVerticalScroll

const cameraMoveToEvent = {
  id: 'EVENT_CAMERA_MOVE_TO',
  name: 'Camera Move To',
  description: 'Move a camera para uma nova posicao com velocidade especificada.',
  fields: [
    {
      key: 'x',
      label: 'X',
      description: 'Posicao horizontal.',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      key: 'y',
      label: 'Y',
      description: 'Posicao vertical.',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      key: 'speed',
      label: 'Speed',
      description: 'Velocidade de movimento. Use Instant para mover imediatamente.',
      type: 'cameraSpeed',
      defaultValue: 'speed2',
    },
  ],
  compile: (input, { helpers: { _cameraMoveTo } }) => {
    _cameraMoveTo(input.x, input.y, input.speed);
  },
};

const cameraMoveToLockOnPlayerEvent = {
  id: 'EVENT_CAMERA_MOVE_TO_LOCK_ON_PLAYER',
  name: 'Camera Move To Lock On Player',
  description: 'Move a camera para centralizar no player, travando quando o player se move.',
  fields: [
    {
      key: 'speed',
      label: 'Speed',
      description: 'Velocidade de movimento. Use Instant para mover imediatamente.',
      type: 'cameraSpeed',
      defaultValue: 'speed2',
    },
    {
      key: 'lockH',
      label: 'Lock H',
      description: 'Travar eixo horizontal.',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'lockV',
      label: 'Lock V',
      description: 'Travar eixo vertical.',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'preventBacktracking',
      label: 'Prevent Backtracking',
      description: 'Impede a camera de rolar para tras.',
      type: 'boolean',
      defaultValue: false,
    },
  ],
  compile: (input, { helpers: { _cameraLockPlayer } }) => {
    _cameraLockPlayer(input.speed, input.lockH, input.lockV, input.preventBacktracking);
  },
};

const cameraShakeEvent = {
  id: 'EVENT_CAMERA_SHAKE',
  name: 'Camera Shake',
  description: 'Shake the camera for a period of time.',
  fields: [
    {
      key: 'time',
      label: 'Duration',
      description: 'The length of time to shake camera for.',
      type: 'number',
      min: 0,
      defaultValue: 0.5,
    },
    {
      key: 'magnitude',
      label: 'Magnitude',
      description: 'The amount of camera movement.',
      type: 'number',
      min: 0,
      defaultValue: 1,
    },
    {
      key: 'shakeDirection',
      label: 'Movement Type',
      type: 'select',
      options: [
        ['horizontal', 'Horizontal'],
        ['vertical', 'Vertical'],
        ['both', 'Both'],
      ],
      defaultValue: 'both',
    },
  ],
  compile: (input, { helpers: { _cameraShake } }) => {
    _cameraShake(input.time, input.magnitude, input.shakeDirection);
  },
};

const setCameraBoundsEvent = {
  id: 'EVENT_SET_CAMERA_BOUNDS',
  name: 'Set Camera Bounds',
  description: 'Define os limites da camera, impedindo-a de se mover fora da area especificada.',
  fields: [
    { key: 'x', label: 'X', type: 'number', min: 0, defaultValue: 0 },
    { key: 'y', label: 'Y', type: 'number', min: 0, defaultValue: 0 },
    { key: 'width', label: 'Width', type: 'number', min: 0, defaultValue: 0 },
    { key: 'height', label: 'Height', type: 'number', min: 0, defaultValue: 0 },
  ],
  compile: (input, { helpers: { _setCameraBounds } }) => {
    _setCameraBounds(input.x, input.y, input.width, input.height);
  },
};

const setCameraLockOnPlayerEvent = {
  id: 'EVENT_SET_CAMERA_LOCK_ON_PLAYER',
  name: 'Set Camera Lock On Player',
  description: 'Trava a camera no player com eixos opcionais.',
  fields: [
    {
      key: 'lockH',
      label: 'Lock H',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'lockV',
      label: 'Lock V',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'preventBacktracking',
      label: 'Prevent Backtracking',
      type: 'boolean',
      defaultValue: false,
    },
  ],
  compile: (input, { helpers: { _setCameraLockPlayer } }) => {
    _setCameraLockPlayer(input.lockH, input.lockV, input.preventBacktracking);
  },
};

const setCameraPositionEvent = {
  id: 'EVENT_SET_CAMERA_POSITION',
  name: 'Set Camera Position',
  description: 'Move a camera para uma nova posicao imediatamente.',
  fields: [
    { key: 'x', label: 'X', type: 'number', min: 0, defaultValue: 0 },
    { key: 'y', label: 'Y', type: 'number', min: 0, defaultValue: 0 },
  ],
  compile: (input, { helpers: { _setCameraPosition } }) => {
    _setCameraPosition(input.x, input.y);
  },
};

const setCameraPropertyEvent = {
  id: 'EVENT_SET_CAMERA_PROPERTY',
  name: 'Set Camera Property',
  description: 'Atualiza uma propriedade da camera de jogo.',
  fields: [
    {
      key: 'property',
      label: 'Property',
      type: 'select',
      options: [
        ['deadzoneX', 'Camera Deadzone X'],
        ['deadzoneY', 'Camera Deadzone Y'],
        ['offsetX', 'Camera Offset X'],
        ['offsetY', 'Camera Offset Y'],
      ],
      defaultValue: 'deadzoneX',
    },
    {
      key: 'value',
      label: 'Value',
      type: 'number',
      defaultValue: 0,
    },
  ],
  compile: (input, { helpers: { _setCameraProperty } }) => {
    _setCameraProperty(input.property, input.value);
  },
};

module.exports = {
  cameraMoveToEvent,
  cameraMoveToLockOnPlayerEvent,
  cameraShakeEvent,
  setCameraBoundsEvent,
  setCameraLockOnPlayerEvent,
  setCameraPositionEvent,
  setCameraPropertyEvent,
};
