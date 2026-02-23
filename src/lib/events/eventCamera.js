// eventCamera.js - Eventos de Camera para MD Studio (SGDK/Mega Drive)
// No Mega Drive, a camera e implementada movendo o plano de scroll do VDP
// usando VDP_setHorizontalScroll e VDP_setVerticalScroll

// Camera Move To - Move a camera para uma nova posicao com velocidade
const cameraMoveToEvent = {
  id: 'EVENT_CAMERA_MOVE_TO',
  name: 'Camera Move To',
  description: 'Move a camera para uma nova posicao com velocidade especificada.',
  fields: [
    { key: 'x', label: 'X', description: 'Posicao horizontal.', type: 'number', min: 0, defaultValue: 0 },
    { key: 'y', label: 'Y', description: 'Posicao vertical.', type: 'number', min: 0, defaultValue: 0 },
    { key: 'speed', label: 'Speed', description: 'Velocidade de movimento. Use Instant para mover imediatamente.', type: 'cameraSpeed', defaultValue: 'speed2' },
  ],
  compile: (input, { helpers: { _cameraMoveTo } }) => {
    _cameraMoveTo(input.x, input.y, input.speed);
  },
};

// Camera Move To Lock On Player - Move a camera de volta para centralizar no player
const cameraMoveToLockOnPlayerEvent = {
  id: 'EVENT_CAMERA_MOVE_TO_LOCK_ON_PLAYER',
  name: 'Camera Move To Lock On Player',
  description: 'Move a camera para centralizar no player, travando quando o player se move.',
  fields: [
    { key: 'speed', label: 'Speed', description: 'Velocidade de movimento. Use Instant para mover imediatamente.', type: 'cameraSpeed', defaultValue: 'speed2' },
    { key: 'lockH', label: 'Lock H', description: 'Travar eixo horizontal.', type: 'boolean', defaultValue: true },
    { key: 'lockV', label: 'Lock V', description: 'Travar eixo vertical.', type: 'boolean', defaultValue: true },
    { key: 'preventBacktracking', label: 'Prevent Backtracking', description: 'Impede a camera de rolar para tras.', type: 'boolean', defaultValue: false },
  ],
  compile: (input, { helpers: { _cameraLockPlayer } }) => {
    _cameraLockPlayer(input.speed, input.lockH, input.lockV, input.preventBacktracking);
  },
};

// Camera Shake - Treme a camera por um periodo de tempo
const cameraShakeEvent = {
  id: 'EVENT_CAMERA_SHAKE',
  name: 'Camera Shake',
  description: 'Treme a camera por um periodo de tempo.',
  fields: [
    { key: 'duration', label: 'Duration', description: 'Duracao do tremor em segundos ou frames.', type: 'number', defaultValue: 0.5, placeholder: '0.5' },
    { key: 'units', label: 'Units', type: 'select', options: [['seconds', 'Seconds'], ['frames', 'Frames']], defaultValue: 'seconds' },
    { key: 'shakeAxis', label: 'Movement Type', description: 'Eixo de tremor.', type: 'select', options: [['both', 'Both'], ['horizontal', 'Horizontal Only'], ['vertical', 'Vertical Only']], defaultValue: 'both' },
    { key: 'magnitude', label: 'Magnitude', description: 'Intensidade do tremor.', type: 'number', min: 0, defaultValue: 0 },
  ],
  compile: (input, { helpers: { _cameraShake } }) => {
    const frames = input.units === 'seconds' ? Math.round(input.duration * 60) : Math.round(input.duration);
    _cameraShake(frames, input.shakeAxis, input.magnitude);
  },
};

// Set Camera Bounds - Define os limites da camera
const setCameraBoundsEvent = {
  id: 'EVENT_SET_CAMERA_BOUNDS',
  name: 'Set Camera Bounds',
  description: 'Define os limites da camera para evitar que saia da area especificada.',
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

// Set Camera Lock On Player - Define camera para centralizar no player
const setCameraLockOnPlayerEvent = {
  id: 'EVENT_SET_CAMERA_LOCK_ON_PLAYER',
  name: 'Set Camera Lock On Player',
  description: 'Define a camera para centralizar no player, travando quando o player se move.',
  fields: [
    { key: 'lockH', label: 'Lock H', type: 'boolean', defaultValue: true },
    { key: 'lockV', label: 'Lock V', type: 'boolean', defaultValue: true },
    { key: 'preventBacktracking', label: 'Prevent Backtracking', type: 'boolean', defaultValue: false },
  ],
  compile: (input, { helpers: { _cameraLockPlayer } }) => {
    _cameraLockPlayer('instant', input.lockH, input.lockV, input.preventBacktracking);
  },
};

// Set Camera Position - Move a camera para uma nova posicao de forma instantanea
const setCameraPositionEvent = {
  id: 'EVENT_CAMERA_SET_POSITION',
  name: 'Set Camera Position',
  description: 'Move a camera para uma nova posicao de forma instantanea via VDP scroll.',
  fields: [
    { key: 'x', label: 'X', type: 'number', min: 0, defaultValue: 0 },
    { key: 'y', label: 'Y', type: 'number', min: 0, defaultValue: 0 },
  ],
  compile: (input, { helpers: { _cameraSetPosition } }) =>
    // No SGDK: VDP_setHorizontalScroll(BG_A, -input.x);
    // VDP_setVerticalScroll(BG_A, input.y);
    _cameraSetPosition(input.x, input.y),
};

// Set Camera Property - Atualiza uma propriedade da camera
const setCameraPropertyEvent = {
  id: 'EVENT_CAMERA_SET_PROPERTY',
  name: 'Set Camera Property',
  description: 'Atualiza uma propriedade da camera do jogo.',
  fields: [
    {
      key: 'property',
      label: 'Property',
      type: 'select',
      options: [
        ['deadzoneX', 'Camera Deadzone X'],
        ['deadzoneY', 'Camera Deadzone Y'],
        ['scrollSpeed', 'Scroll Speed'],
      ],
      defaultValue: 'deadzoneX',
    },
    { key: 'value', label: 'Value', type: 'number', defaultValue: 0 },
  ],
  compile: (input, { helpers: { _cameraPropertySet } }) => {
    _cameraPropertySet(input.property, input.value);
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
