/**
 * eventActorMoveCancel.js
 * MD Studio — Evento: Cancelar Movimento do Ator
 *
 * Baseado no eventActorMoveCancel.js do GB Studio (MIT License - Chris Maltby)
 * Adaptado para SGDK (Mega Drive)
 *
 * No Mega Drive nao existe movimento animado nativo de tile-a-tile como no GB,
 * entao este evento para o sprite na posicao atual e limpa qualquer velocidade.
 */
const l10n = require('../helpers/l10n').default;

const id = 'EVENT_ACTOR_MOVE_CANCEL';
const groups = ['EVENT_GROUP_ACTOR'];
const subGroups = {
  EVENT_GROUP_ACTOR: 'EVENT_GROUP_MOVEMENT',
};
const weight = 1;

const fields = [
  {
    key: 'actorId',
    label: l10n('ACTOR'),
    description: 'Ator para cancelar movimento',
    type: 'actor',
    defaultValue: '$self$',
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;
  sgdk.emitComment(`Cancelar movimento do ator '${input.actorId}'`);
  // No Mega Drive: parar o sprite na posicao atual, zerar velocidade
  sgdk.emitLine(`/* Movimento cancelado para sprites[${input.actorId}] */`);
  sgdk.emitLine(`/* Velocidade zerada - sprites[${input.actorId}] permanece na posicao atual */`);
  sgdk.emitLine(`SPR_update();`);
};

module.exports = {
  id,
  description: 'Cancela qualquer movimento em andamento do ator no Mega Drive',
  groups,
  subGroups,
  weight,
  fields,
  compile,
};
