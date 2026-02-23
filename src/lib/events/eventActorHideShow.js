/**
 * eventActorHideShow.js
 * MD Studio - Evento: Esconder / Mostrar Ator
 *
 * Baseado em Hide Actor / Show Actor do GB Studio Event Glossary
 * Adaptado para SGDK/Mega Drive: usa SPR_setVisibility()
 */
const l10n = require('../helpers/l10n').default;

// ─── HIDE ACTOR ──────────────────────────────────────────────────────────────
const id = 'EVENT_ACTOR_HIDE';
const idShow = 'EVENT_ACTOR_SHOW';

const actorField = (label, desc) => ({
  key: 'actorId',
  label: l10n(label || 'ACTOR'),
  description: desc || 'O ator alvo',
  type: 'actor',
  defaultValue: '$self$',
});

const hideActor = {
  id,
  description: 'Torna o ator invisivel. O script OnUpdate continua rodando.',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_VISIBILITY' },
  weight: 1,
  autoLabel: (fetchArg) =>
    l10n('EVENT_ACTOR_HIDE_LABEL', { actor: fetchArg('actorId') }),
  fields: [actorField('ACTOR')],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Esconder ator '${input.actorId}'`);
    sgdk.emitLine(`SPR_setVisibility(sprites[${input.actorId}], HIDDEN);`);
    sgdk.emitLine(`SPR_update();`);
  },
};

// ─── SHOW ACTOR ──────────────────────────────────────────────────────────────
const showActor = {
  id: idShow,
  description: 'Torna um ator previamente escondido visivel novamente.',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_VISIBILITY' },
  weight: 1,
  autoLabel: (fetchArg) =>
    l10n('EVENT_ACTOR_SHOW_LABEL', { actor: fetchArg('actorId') }),
  fields: [actorField('ACTOR')],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Mostrar ator '${input.actorId}'`);
    sgdk.emitLine(`SPR_setVisibility(sprites[${input.actorId}], VISIBLE);`);
    sgdk.emitLine(`SPR_update();`);
  },
};

module.exports = { hideActor, showActor };
