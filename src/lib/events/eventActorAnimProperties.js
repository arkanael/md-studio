/**
 * eventActorAnimProperties.js
 * MD Studio — Eventos: Propriedades de Animacao do Ator
 * - Set Actor Animation Frame
 * - Set Actor Animation Speed
 * - Set Actor Animation State
 *
 * Baseado no GB Studio (MIT License - Chris Maltby)
 * Adaptado para SGDK (Mega Drive)
 */
const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: SET ACTOR ANIMATION FRAME
// Define o frame de animacao do sprite
// ============================================================
const setActorAnimFrameEvent = {
  id: 'EVENT_ACTOR_SET_ANIM_FRAME',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_SET_ANIM_FRAME'),
  description: 'Define o frame de animacao do sprite no Mega Drive',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'frame',
      label: l10n('FIELD_ANIMATION_FRAME'),
      description: 'Indice do frame de animacao (0 = primeiro frame)',
      type: 'value',
      min: 0,
      max: 255,
      defaultValue: { type: 'number', value: 0 },
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir frame de animacao do ator '${input.actorId}' para ${input.frame}`);
    sgdk.emitLine(`SPR_setAnimAndFrame(sprites[${input.actorId}], SPR_getAnim(sprites[${input.actorId}]), ${input.frame});`);
    sgdk.emitLine(`SPR_update();`);
  },
};

// ============================================================
// EVENT: SET ACTOR ANIMATION SPEED
// Define a velocidade de animacao do sprite
// SGDK: SPR_setAnimFrameDuration (duracao em frames por quadro)
// ============================================================
const setActorAnimSpeedEvent = {
  id: 'EVENT_ACTOR_SET_ANIM_SPEED',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_SET_ANIM_SPEED'),
  description: 'Define a velocidade de animacao do sprite no Mega Drive',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'speed',
      label: l10n('FIELD_ANIMATION_SPEED'),
      description: 'Duracao em frames SGDK por quadro de animacao (menor = mais rapido)',
      type: 'select',
      options: [
        ['1', 'Muito rapida (1)'],
        ['2', 'Rapida (2)'],
        ['4', 'Normal (4)'],
        ['8', 'Lenta (8)'],
        ['15', 'Muito lenta (15)'],
      ],
      defaultValue: '4',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir velocidade de animacao do ator '${input.actorId}': ${input.speed} frames/quadro`);
    sgdk.emitLine(`SPR_setAnimFrameDuration(sprites[${input.actorId}], ${input.speed || 4});`);
    sgdk.emitLine(`SPR_update();`);
  },
};

// ============================================================
// EVENT: SET ACTOR ANIMATION STATE
// Muda o estado de animacao do sprite (ex: idle, walk, jump)
// SGDK: SPR_setAnim() com indice do estado
// ============================================================
const setActorAnimStateEvent = {
  id: 'EVENT_ACTOR_SET_ANIM_STATE',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_SET_ANIM_STATE'),
  description: 'Define o estado de animacao do sprite no Mega Drive',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'animState',
      label: l10n('FIELD_ANIMATION_STATE'),
      description: 'Estado de animacao (indice da animacao no SpriteDefinition)',
      type: 'value',
      min: 0,
      max: 255,
      defaultValue: { type: 'number', value: 0 },
    },
    {
      key: 'loop',
      label: l10n('FIELD_LOOP_ANIMATION'),
      description: 'Repetir a animacao em loop',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir animacao do ator '${input.actorId}' para estado ${input.animState}`);
    sgdk.emitLine(`SPR_setAnim(sprites[${input.actorId}], ${input.animState});`);
    if (input.loop === false) {
      sgdk.emitLine(`SPR_setAnimMode(sprites[${input.actorId}], ANIM_ONCE);`);
    } else {
      sgdk.emitLine(`SPR_setAnimMode(sprites[${input.actorId}], ANIM_LOOP);`);
    }
    sgdk.emitLine(`SPR_update();`);
  },
};

module.exports = {
  setActorAnimFrameEvent,
  setActorAnimSpeedEvent,
  setActorAnimStateEvent,
};
