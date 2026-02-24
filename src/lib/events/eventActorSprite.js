/**
 * eventActorSprite.js
 * MD Studio - Eventos: Definir Sprite Sheet do Ator
 */
const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: SET ACTOR SPRITE SHEET
// Altera a definicao de sprite (sprite sheet) do ator
// ============================================================
const setActorSpriteEvent = {
  id: 'EVENT_ACTOR_SET_SPRITE',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_SET_SPRITE'),
  description: 'Altera o Sprite Sheet (definicao) de um ator no Mega Drive',
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
      type: 'sprite',
      defaultValue: 'LAST_SPRITE',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir Sprite Sheet do ator '${input.actorId}'`);
    sgdk.emitLine(`SPR_setDefinition(sprites[${input.actorId}], &${input.spriteSheetId});`);
    sgdk.emitLine(`SPR_update();`);
  },
};

module.exports = {
  setActorSpriteEvent,
};
