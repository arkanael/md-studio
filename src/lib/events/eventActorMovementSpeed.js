/**
 * eventActorMovementSpeed.js
 * MD Studio — Eventos: Velocidade de Movimento e Sprite Sheet do Ator
 * - Set Actor Movement Speed
 * - Set Actor Sprite Sheet
 * - Set Player Sprite Sheet
 *
 * Baseado no GB Studio (MIT License - Chris Maltby)
 * Adaptado para SGDK (Mega Drive)
 */
const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: SET ACTOR MOVEMENT SPEED
// Define a velocidade de movimento do ator
// No Mega Drive: velocidade em pixels por frame
// ============================================================
const setActorMovementSpeedEvent = {
  id: 'EVENT_ACTOR_SET_MOVEMENT_SPEED',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_SET_MOVEMENT_SPEED'),
  description: 'Define a velocidade de movimento do ator no Mega Drive',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'speed',
      label: l10n('FIELD_SPEED'),
      description: 'Velocidade em pixels por frame (1-8)',
      type: 'select',
      options: [
        ['1', 'Velocidade 1 (lenta)'],
        ['2', 'Velocidade 2'],
        ['3', 'Velocidade 3'],
        ['4', 'Velocidade 4 (normal)'],
        ['6', 'Velocidade 6'],
        ['8', 'Velocidade 8 (rapida)'],
      ],
      defaultValue: '2',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir velocidade de movimento do ator '${input.actorId}': ${input.speed} px/frame`);
    sgdk.emitLine(`actor_speed[${input.actorId}] = ${input.speed || 2};`);
  },
};

// ============================================================
// EVENT: SET ACTOR SPRITE SHEET
// Muda o sprite do ator
// SGDK: SPR_setDefinition()
// ============================================================
const setActorSpriteSheetEvent = {
  id: 'EVENT_ACTOR_SET_SPRITE',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_SET_SPRITE'),
  description: 'Muda o sprite usado para renderizar o ator no Mega Drive',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'spriteSheetId',
      label: l10n('FIELD_SPRITE_SHEET'),
      description: 'Sprite a ser usado para o ator',
      type: 'sprite',
      defaultValue: '',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir sprite do ator '${input.actorId}' para '${input.spriteSheetId}'`);
    sgdk.emitLine(`SPR_setDefinition(sprites[${input.actorId}], &${input.spriteSheetId});`);
    sgdk.emitLine(`SPR_update();`);
  },
};

// ============================================================
// EVENT: SET PLAYER SPRITE SHEET
// Muda o sprite do jogador
// ============================================================
const setPlayerSpriteSheetEvent = {
  id: 'EVENT_PLAYER_SET_SPRITE',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_PLAYER_SET_SPRITE'),
  description: 'Muda o sprite usado para renderizar o jogador no Mega Drive',
  fields: [
    {
      key: 'spriteSheetId',
      label: l10n('FIELD_SPRITE_SHEET'),
      description: 'Sprite a ser usado para o jogador',
      type: 'sprite',
      defaultValue: '',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir sprite do jogador para '${input.spriteSheetId}'`);
    sgdk.emitLine(`SPR_setDefinition(sprites[PLAYER], &${input.spriteSheetId});`);
    sgdk.emitLine(`SPR_update();`);
  },
};

module.exports = {
  setActorMovementSpeedEvent,
  setActorSpriteSheetEvent,
  setPlayerSpriteSheetEvent,
};
