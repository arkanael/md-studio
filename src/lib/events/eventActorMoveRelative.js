/**
 * eventActorMoveRelative.js
 * MD Studio — Evento: Mover Ator Relativamente (offset X,Y)
 *
 * Baseado no eventActorMoveRelative.js do GB Studio (MIT License - Chris Maltby)
 * Adaptado para SGDK (Mega Drive)
 *
 * INTERFACE VISUAL: identica ao GB Studio
 * COMPILE: emite SPR_setPosition relativo ao SPR_getPositionX/Y atual
 */
const l10n = require('../helpers/l10n').default;

const id = 'EVENT_ACTOR_MOVE_RELATIVE';
const groups = ['EVENT_GROUP_ACTOR'];
const subGroups = {
  EVENT_GROUP_ACTOR: 'EVENT_GROUP_MOVEMENT',
};
const weight = 2;

const fields = [
  {
    key: '__section',
    type: 'tabs',
    defaultValue: 'movement',
    variant: 'eventSection',
    values: {
      movement: l10n('FIELD_MOVEMENT'),
      options: l10n('FIELD_OPTIONS'),
    },
  },
  {
    type: 'group',
    wrapItems: true,
    flexBasis: '100%',
    fields: [
      {
        key: 'actorId',
        label: l10n('ACTOR'),
        description: 'Ator a ser movido relativamente',
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
    ],
    conditions: [
      { key: '__section', in: ['movement', undefined] },
    ],
  },
  {
    type: 'group',
    wrapItems: true,
    flexBasis: '100%',
    fields: [
      {
        key: 'collideWith',
        width: '50%',
        label: 'Colidir com',
        type: 'togglebuttons',
        options: [
          ['walls', 'Paredes', 'Paredes'],
          ['actors', 'Atores', 'Atores'],
        ],
        allowNone: true,
        allowMultiple: true,
        defaultValue: ['walls'],
      },
    ],
    conditions: [
      { key: '__section', in: ['options'] },
    ],
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;
  const dxPixels = input.units === 'pixels' ? input.x : `${input.x} * 8`;
  const dyPixels = input.units === 'pixels' ? input.y : `${input.y} * 8`;
  sgdk.emitComment(`Mover ator '${input.actorId}' relativamente por (${input.x}, ${input.y}) ${input.units || 'tiles'}`);
  sgdk.emitLine(`SPR_setPosition(sprites[${input.actorId}],`);
  sgdk.emitLine(`  SPR_getPositionX(sprites[${input.actorId}]) + (${dxPixels}),`);
  sgdk.emitLine(`  SPR_getPositionY(sprites[${input.actorId}]) + (${dyPixels}));`);
  sgdk.emitLine(`SPR_update();`);
  sgdk.emitLine(`SYS_doVBlankProcess();`);
};

module.exports = {
  id,
  description: 'Move o ator relativamente a sua posicao atual no Mega Drive',
  groups,
  subGroups,
  weight,
  fields,
  compile,
  waitUntilAfterInitFade: true,
};
