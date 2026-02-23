/**
 * eventActorSetRelativePosition.js
 * MD Studio — Evento: Definir Posicao Relativa do Ator
 *
 * Baseado no eventActorSetRelativePosition.js do GB Studio (MIT License - Chris Maltby)
 * Adaptado para SGDK (Mega Drive)
 *
 * Define a posicao do ator relativa a sua posicao anterior (movimento instantaneo)
 */
const l10n = require('../helpers/l10n').default;

const id = 'EVENT_ACTOR_SET_POSITION_RELATIVE';
const groups = ['EVENT_GROUP_ACTOR'];
const subGroups = {
  EVENT_GROUP_ACTOR: 'EVENT_GROUP_MOVEMENT',
};
const weight = 1;

const fields = [
  {
    key: 'actorId',
    label: l10n('ACTOR'),
    description: 'Ator a ser reposicionado',
    type: 'actor',
    defaultValue: '$self$',
    flexBasis: 0,
    minWidth: 150,
  },
  {
    type: 'group',
    wrapItems: true,
    fields: [
      {
        key: 'x',
        label: l10n('FIELD_X'),
        description: 'Deslocamento horizontal relativo (tiles)',
        type: 'value',
        min: -255,
        max: 255,
        width: '50%',
        unitsField: 'units',
        unitsDefault: 'tiles',
        unitsAllowed: ['tiles', 'pixels'],
        defaultValue: { type: 'number', value: 0 },
      },
      {
        key: 'y',
        label: l10n('FIELD_Y'),
        description: 'Deslocamento vertical relativo (tiles)',
        type: 'value',
        min: -255,
        max: 255,
        width: '50%',
        unitsField: 'units',
        unitsDefault: 'tiles',
        unitsAllowed: ['tiles', 'pixels'],
        defaultValue: { type: 'number', value: 0 },
      },
    ],
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;
  const dxPixels = input.units === 'pixels' ? input.x : `${input.x} * 8`;
  const dyPixels = input.units === 'pixels' ? input.y : `${input.y} * 8`;
  sgdk.emitComment(`Definir posicao relativa do ator '${input.actorId}': offset (${input.x}, ${input.y}) ${input.units || 'tiles'}`);
  sgdk.emitLine(`SPR_setPosition(sprites[${input.actorId}],`);
  sgdk.emitLine(`  SPR_getPositionX(sprites[${input.actorId}]) + (${dxPixels}),`);
  sgdk.emitLine(`  SPR_getPositionY(sprites[${input.actorId}]) + (${dyPixels}));`);
  sgdk.emitLine(`SPR_update();`);
};

module.exports = {
  id,
  description: 'Define a posicao do ator relativa a posicao anterior (instantaneo)',
  groups,
  subGroups,
  weight,
  fields,
  compile,
};
