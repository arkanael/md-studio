/**
 * eventActorActivateDeactivate.js
 * MD Studio — Eventos: Ativar Ator, Desativar Ator, Efeitos de Ator
 *
 * Baseado no GB Studio (MIT License - Chris Maltby)
 * Adaptado para SGDK (Mega Drive)
 */
const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: ACTIVATE ACTOR
// Ativa um ator, tornando-o visivel e iniciando OnUpdate
// ============================================================
const activateActorEvent = {
  id: 'EVENT_ACTOR_ACTIVATE',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_ACTIVATE'),
  description: 'Ativa o ator no Mega Drive (visivel + OnUpdate ativo)',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      description: 'Ator a ser ativado',
      type: 'actor',
      defaultValue: '$self$',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Ativar ator '${input.actorId}'`);
    sgdk.emitLine(`SPR_setVisibility(sprites[${input.actorId}], VISIBLE);`);
    sgdk.emitLine(`SPR_update();`);
  },
};

// ============================================================
// EVENT: DEACTIVATE ACTOR
// Desativa um ator (invisivel + para OnUpdate)
// ============================================================
const deactivateActorEvent = {
  id: 'EVENT_ACTOR_DEACTIVATE',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_DEACTIVATE'),
  description: 'Desativa o ator no Mega Drive (invisivel + OnUpdate parado)',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      description: 'Ator a ser desativado',
      type: 'actor',
      defaultValue: '$self$',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Desativar ator '${input.actorId}'`);
    sgdk.emitLine(`SPR_setVisibility(sprites[${input.actorId}], HIDDEN);`);
    sgdk.emitLine(`SPR_update();`);
  },
};

// ============================================================
// EVENT: ACTOR EFFECTS
// Reproduz uma animacao de efeito no ator (ex: piscar)
// ============================================================
const actorEffectsEvent = {
  id: 'EVENT_ACTOR_EFFECTS',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_EFFECTS'),
  description: 'Reproduz um efeito de animacao no ator (piscar, etc.)',
  fields: [
    {
      key: 'effect',
      label: l10n('FIELD_EFFECT'),
      type: 'select',
      options: [
        ['flicker', 'Piscar (Flicker)'],
        ['shake', 'Tremer (Shake)'],
        ['flash', 'Flash'],
      ],
      defaultValue: 'flicker',
    },
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      description: 'Ator afetado pelo efeito',
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'duration',
      label: l10n('FIELD_DURATION'),
      description: 'Duracao do efeito em frames (60fps)',
      type: 'number',
      min: 1,
      max: 300,
      defaultValue: 30,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Efeito '${input.effect}' no ator '${input.actorId}' por ${input.duration} frames`);
    sgdk.emitLine(`{`);
    sgdk.emitLine(`  u16 _eff_i;`);
    if (input.effect === 'flicker') {
      sgdk.emitLine(`  for (_eff_i = 0; _eff_i < ${input.duration || 30}; _eff_i++) {`);
      sgdk.emitLine(`    SPR_setVisibility(sprites[${input.actorId}], (_eff_i % 2 == 0) ? VISIBLE : HIDDEN);`);
      sgdk.emitLine(`    SPR_update(); SYS_doVBlankProcess();`);
      sgdk.emitLine(`  }`);
      sgdk.emitLine(`  SPR_setVisibility(sprites[${input.actorId}], VISIBLE);`);
    } else if (input.effect === 'shake') {
      sgdk.emitLine(`  s16 _ox = SPR_getPositionX(sprites[${input.actorId}]);`);
      sgdk.emitLine(`  s16 _oy = SPR_getPositionY(sprites[${input.actorId}]);`);
      sgdk.emitLine(`  for (_eff_i = 0; _eff_i < ${input.duration || 30}; _eff_i++) {`);
      sgdk.emitLine(`    SPR_setPosition(sprites[${input.actorId}], _ox + ((_eff_i%2==0)?-2:2), _oy);`);
      sgdk.emitLine(`    SPR_update(); SYS_doVBlankProcess();`);
      sgdk.emitLine(`  }`);
      sgdk.emitLine(`  SPR_setPosition(sprites[${input.actorId}], _ox, _oy);`);
    } else {
      sgdk.emitLine(`  SPR_setVisibility(sprites[${input.actorId}], HIDDEN);`);
      sgdk.emitLine(`  SPR_update(); SYS_doVBlankProcess();`);
      sgdk.emitLine(`  SPR_setVisibility(sprites[${input.actorId}], VISIBLE);`);
    }
    sgdk.emitLine(`  SPR_update();`);
    sgdk.emitLine(`}`);
  },
};

module.exports = {
  activateActorEvent,
  deactivateActorEvent,
  actorEffectsEvent,
};
