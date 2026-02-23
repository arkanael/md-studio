const l10n = require('../helpers/l10n').default;

// Definir Animacao do Ator
const actorSetAnimationEvent = {
  id: 'EVENT_ACTOR_SET_ANIMATION',
  groups: ['EVENT_GROUP_ACTOR'],
  name: l10n('EVENT_ACTOR_SET_ANIMATION'),
  description: l10n('EVENT_ACTOR_SET_ANIMATION_DESC'),
  fields: [
    {
      key: 'actorId',
      label: l10n('FIELD_ACTOR'),
      description: l10n('FIELD_ACTOR_DESC'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'animName',
      label: l10n('FIELD_ANIMATION_STATE'),
      description: l10n('FIELD_ANIMATION_STATE_DESC'),
      type: 'animationstate',
      defaultValue: '',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Definir Animacao do Ator');
    const actor = input.actorId || 'actor_0';
    const anim = input.animName || 0;
    sgdk.emitLine(`SPR_setAnim(${actor}_sprite, ${anim});`);
  },
};

// Pausar Animacao do Ator
const actorStopAnimationEvent = {
  id: 'EVENT_ACTOR_STOP_UPDATE',
  groups: ['EVENT_GROUP_ACTOR'],
  name: l10n('EVENT_ACTOR_STOP_UPDATE'),
  description: l10n('EVENT_ACTOR_STOP_UPDATE_DESC'),
  fields: [
    {
      key: 'actorId',
      label: l10n('FIELD_ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Pausar Animacao do Ator');
    const actor = input.actorId || 'actor_0';
    sgdk.emitLine(`SPR_setAutoAnimation(${actor}_sprite, FALSE);`);
  },
};

// Definir Velocidade de Movimento do Ator
const actorSetMoveSpeedEvent = {
  id: 'EVENT_ACTOR_SET_MOVE_SPEED',
  groups: ['EVENT_GROUP_ACTOR'],
  name: l10n('EVENT_ACTOR_SET_MOVE_SPEED'),
  description: l10n('EVENT_ACTOR_SET_MOVE_SPEED_DESC'),
  fields: [
    {
      key: 'actorId',
      label: l10n('FIELD_ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'speed',
      label: l10n('FIELD_SPEED'),
      description: l10n('FIELD_SPEED_DESC'),
      type: 'moveSpeed',
      defaultValue: 1,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Definir Velocidade do Ator');
    const actor = input.actorId || 'actor_0';
    const speed = input.speed || 1;
    sgdk.emitLine(`${actor}_speed = FIX16(${speed});`);
  },
};

// Definir Velocidade de Animacao do Ator
const actorSetAnimationSpeedEvent = {
  id: 'EVENT_ACTOR_SET_ANIMATION_SPEED',
  groups: ['EVENT_GROUP_ACTOR'],
  name: l10n('EVENT_ACTOR_SET_ANIMATION_SPEED'),
  description: l10n('EVENT_ACTOR_SET_ANIMATION_SPEED_DESC'),
  fields: [
    {
      key: 'actorId',
      label: l10n('FIELD_ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'speed',
      label: l10n('FIELD_SPEED'),
      type: 'animSpeed',
      defaultValue: 3,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Definir Velocidade de Animacao do Ator');
    const actor = input.actorId || 'actor_0';
    const speed = Math.max(1, Math.min(8, input.speed || 3));
    sgdk.emitLine(`SPR_setFrameChangeTimer(${actor}_sprite, ${speed});`);
  },
};

// Mover Ator Para Posicao do Ator
const actorMoveRelativeEvent = {
  id: 'EVENT_ACTOR_MOVE_RELATIVE',
  groups: ['EVENT_GROUP_ACTOR'],
  name: l10n('EVENT_ACTOR_MOVE_RELATIVE'),
  description: l10n('EVENT_ACTOR_MOVE_RELATIVE_DESC'),
  fields: [
    {
      key: 'actorId',
      label: l10n('FIELD_ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'x',
      label: l10n('FIELD_X'),
      type: 'number',
      min: -32,
      max: 32,
      defaultValue: 0,
    },
    {
      key: 'y',
      label: l10n('FIELD_Y'),
      type: 'number',
      min: -32,
      max: 32,
      defaultValue: 0,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Mover Ator Relativamente');
    const actor = input.actorId || 'actor_0';
    const dx = (input.x || 0) * 8;
    const dy = (input.y || 0) * 8;
    if (dx !== 0) sgdk.emitLine(`${actor}_x += ${dx};`);
    if (dy !== 0) sgdk.emitLine(`${actor}_y += ${dy};`);
    sgdk.emitLine(`SPR_setPosition(${actor}_sprite, ${actor}_x, ${actor}_y);`);
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

module.exports = {
  actorSetAnimationEvent,
  actorStopAnimationEvent,
  actorSetMoveSpeedEvent,
  actorSetAnimationSpeedEvent,
  actorMoveRelativeEvent,
};
