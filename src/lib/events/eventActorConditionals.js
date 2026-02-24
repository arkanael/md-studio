/**
 * eventActorConditionals.js
 * MD Studio - Eventos Condicionais de Ator
 *
 * Equivalente GB Studio:
 *   - EVENT_IF_ACTOR_DISTANCE_FROM_ACTOR  (If Actor Distance From Actor)
 *   - EVENT_IF_ACTOR_FACING_DIRECTION     (If Actor Facing Direction)
 *   - EVENT_IF_ACTOR_RELATIVE_TO_ACTOR    (If Actor Relative To Actor)
 */

'use strict';

// ─── If Actor Distance From Actor ──────────────────────────────────────────

/**
 * Executa parte do script condicionalmente se um ator está dentro de
 * uma certa distância de outro ator.
 *
 * SGDK: calcula distância euclidiana ou Manhattan entre posições dos sprites.
 */
const ifActorDistanceFromActor = {
  id: 'EVENT_IF_ACTOR_DISTANCE_FROM_ACTOR',
  label: 'If Actor Distance From Actor',
  description: 'Executa parte do script se um ator está dentro de uma distância de outro ator.',
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_CONTROL_FLOW'],
  fields: [
    {
      key: 'actorId',
      label: 'Actor',
      type: 'actor',
      defaultValue: 'player',
      description: 'O ator que será verificado.',
    },
    {
      key: 'operator',
      label: 'Comparison',
      type: 'operator',
      defaultValue: '<=',
      description: 'Operador de comparação (ex: Menor que, Maior que).',
    },
    {
      key: 'distance',
      label: 'Distance',
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
      description: 'O valor de distância.',
    },
    {
      key: 'otherActorId',
      label: 'From',
      type: 'actor',
      defaultValue: '$self$',
      description: 'O ator com o qual a distância será comparada.',
    },
    {
      key: 'true',
      label: 'True',
      type: 'events',
    },
    {
      key: '__collapseElse',
      label: 'Else',
      type: 'collapsable',
      defaultValue: true,
      conditions: [
        { key: '__alwaysFalse', ne: true },
      ],
    },
    {
      key: 'false',
      label: 'False',
      type: 'events',
      conditions: [
        { key: '__collapseElse', ne: true },
      ],
    },
  ],
  compile: (input, helpers) => {
    const { actorSetActive, ifVariableCompare, _addComment } = helpers;
    _addComment('If Actor Distance From Actor');
    actorSetActive(input.actorId);
    // Calcula distância Manhattan entre ator e otherActor via posições dos sprites
    // e compara com o valor de distância usando o operador fornecido
    helpers.compileConditional(
      input.operator,
      `actor_distance(${input.actorId}, ${input.otherActorId})`,
      input.distance,
      input.true,
      input.false
    );
  },
};

// ─── If Actor Facing Direction ─────────────────────────────────────────────

/**
 * Executa parte do script condicionalmente se o ator está virado
 * em uma direção especificada.
 *
 * SGDK: compara campo de direção do ator.
 */
const ifActorFacingDirection = {
  id: 'EVENT_IF_ACTOR_FACING_DIRECTION',
  label: 'If Actor Facing Direction',
  description: 'Executa parte do script se o ator está virado em uma direção especificada.',
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_CONTROL_FLOW'],
  fields: [
    {
      key: 'actorId',
      label: 'Actor',
      type: 'actor',
      defaultValue: '$self$',
      description: 'O ator que será verificado.',
    },
    {
      key: 'direction',
      label: 'Direction',
      type: 'direction',
      defaultValue: 'down',
      description: 'A direção a verificar.',
    },
    {
      key: 'true',
      label: 'True',
      type: 'events',
    },
    {
      key: '__collapseElse',
      label: 'Else',
      type: 'collapsable',
      defaultValue: true,
      conditions: [
        { key: '__alwaysFalse', ne: true },
      ],
    },
    {
      key: 'false',
      label: 'False',
      type: 'events',
      conditions: [
        { key: '__collapseElse', ne: true },
      ],
    },
  ],
  compile: (input, helpers) => {
    const { actorSetActive, compileEvents, _addComment } = helpers;
    _addComment('If Actor Facing Direction');
    actorSetActive(input.actorId);
    // SGDK: verifica a direção do ator comparando o campo dir
    const dirMap = { down: 'DIR_DOWN', right: 'DIR_RIGHT', up: 'DIR_UP', left: 'DIR_LEFT' };
    const dirConst = dirMap[input.direction] || 'DIR_DOWN';
    helpers.ifActorFacing(input.actorId, dirConst, input.true, input.false);
  },
};

// ─── If Actor Relative To Actor ────────────────────────────────────────────

/**
 * Executa parte do script com base na posição de um ator relativa a outro.
 * Comparações: acima, abaixo, à esquerda, à direita.
 *
 * SGDK: compara coordenadas X/Y dos sprites dos atores.
 */
const ifActorRelativeToActor = {
  id: 'EVENT_IF_ACTOR_RELATIVE_TO_ACTOR',
  label: 'If Actor Relative To Actor',
  description: 'Executa parte do script baseado na posição de um ator relativa a outro.',
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_CONTROL_FLOW'],
  fields: [
    {
      key: 'actorId',
      label: 'Actor',
      type: 'actor',
      defaultValue: 'player',
      description: 'O ator que será verificado.',
    },
    {
      key: 'relative',
      label: 'Comparison',
      type: 'select',
      options: [
        ['above', 'Is Above'],
        ['below', 'Is Below'],
        ['left_of', 'Is Left Of'],
        ['right_of', 'Is Right Of'],
      ],
      defaultValue: 'above',
      description: 'A comparação de posição relativa.',
    },
    {
      key: 'otherActorId',
      label: 'Other Actor',
      type: 'actor',
      defaultValue: '$self$',
      description: 'O ator com o qual será comparada a posição.',
    },
    {
      key: 'true',
      label: 'True',
      type: 'events',
    },
    {
      key: '__collapseElse',
      label: 'Else',
      type: 'collapsable',
      defaultValue: true,
      conditions: [
        { key: '__alwaysFalse', ne: true },
      ],
    },
    {
      key: 'false',
      label: 'False',
      type: 'events',
      conditions: [
        { key: '__collapseElse', ne: true },
      ],
    },
  ],
  compile: (input, helpers) => {
    const { actorSetActive, _addComment } = helpers;
    _addComment('If Actor Relative To Actor');
    actorSetActive(input.actorId);
    // SGDK: compara posições X/Y dos sprites para determinar posição relativa
    helpers.ifActorRelative(input.actorId, input.relative, input.otherActorId, input.true, input.false);
  },
};

module.exports = {
  ifActorDistanceFromActor,
  ifActorFacingDirection,
  ifActorRelativeToActor,
};
