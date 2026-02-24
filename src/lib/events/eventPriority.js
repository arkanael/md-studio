/**
 * eventPriority.js
 * MD Studio - Evento: Definir Prioridade do Sprite
 * 
 * Permite definir se um ator aparece acima ou abaixo dos planos de fundo.
 * Adaptado para SGDK/Mega Drive: usa SPR_setPriority()
 */
const l10n = require('../helpers/l10n').default;

const actorField = (label, desc) => ({
  key: 'actorId',
  label: l10n(label || 'ACTOR'),
  description: desc || 'O ator alvo',
  type: 'actor',
  defaultValue: '$self$',
});

const setActorPriority = {
  id: 'EVENT_SET_ACTOR_PRIORITY',
  name: 'Set Actor Priority',
  description: 'Define se o ator sera exibido acima ou abaixo dos planos de fundo (VDP priority bit).',
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    actorField('ACTOR'),
    {
      key: 'highPriority',
      label: 'High Priority (Above Planes)',
      type: 'boolean',
      defaultValue: true,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir prioridade do ator '${input.actorId}'`);
    // Em SGDK, 1 = High, 0 = Normal
    sgdk.emitLine(`SPR_setPriorityLevel(sprites[${input.actorId}], ${input.highPriority ? 1 : 0});`);
    sgdk.emitLine(`SPR_update();`);
  },
};

module.exports = { setActorPriority };
