/**
 * eventActorScript.js
 * MD Studio - Eventos de Script do Ator (OnUpdate)
 *
 * Equivalente GB Studio:
 *   - EVENT_ACTOR_START_UPDATE_SCRIPT  (Start Actor's "On Update" Script)
 *   - EVENT_ACTOR_STOP_UPDATE_SCRIPT   (Stop Actor's "On Update" Script)
 */

'use strict';

// ─── Start Actor's "On Update" Script ────────────────────────────────────

/**
 * Inicia o script OnUpdate de um ator se ele não está sendo executado.
 *
 * SGDK: atores não têm script OnUpdate nativo, mas este evento
 * habilita a lógica de atualização do ator pelo engine MD Studio.
 */
const startActorUpdateScript = {
  id: 'EVENT_ACTOR_START_UPDATE_SCRIPT',
  label: 'Start Actor\'s "On Update" Script',
  description: 'Inicia o script OnUpdate de um ator se ele não está sendo executado.',
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_SCRIPT'],
  fields: [
    {
      key: 'actorId',
      label: 'Actor',
      type: 'actor',
      defaultValue: '$self$',
      description: 'O ator cujo script OnUpdate será iniciado.',
    },
  ],
  compile: (input, helpers) => {
    const { actorSetActive, appendRaw, _addComment } = helpers;
    _addComment('Start Actor OnUpdate Script');
    actorSetActive(input.actorId);
    // SGDK: habilita a flag de atualização do ator
    appendRaw(`
  {\n    // Start actor OnUpdate script\n    actor_setUpdateEnabled(active_actor, TRUE);\n  }`);
  },
};

// ─── Stop Actor's "On Update" Script ─────────────────────────────────────

/**
 * Para o script OnUpdate de um ator se ele estava sendo executado.
 *
 * SGDK: desabilita a flag de atualização do ator.
 */
const stopActorUpdateScript = {
  id: 'EVENT_ACTOR_STOP_UPDATE_SCRIPT',
  label: 'Stop Actor\'s "On Update" Script',
  description: 'Para o script OnUpdate de um ator se ele estava sendo executado.',
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_SCRIPT'],
  fields: [
    {
      key: 'actorId',
      label: 'Actor',
      type: 'actor',
      defaultValue: '$self$',
      description: 'O ator cujo script OnUpdate será parado.',
    },
  ],
  compile: (input, helpers) => {
    const { actorSetActive, appendRaw, _addComment } = helpers;
    _addComment('Stop Actor OnUpdate Script');
    actorSetActive(input.actorId);
    // SGDK: desabilita a flag de atualização do ator
    appendRaw(`
  {\n    // Stop actor OnUpdate script\n    actor_setUpdateEnabled(active_actor, FALSE);\n  }`);
  },
};

module.exports = {
  startActorUpdateScript,
  stopActorUpdateScript,
};
