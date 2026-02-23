/**
 * eventActorMoveTo.js
 * MD Studio — Evento: Mover Ator Para X,Y
 *
 * Baseado no eventActorMoveTo.js do GB Studio (MIT License - Chris Maltby)
 * Adaptado para gerar codigo C compativel com SGDK (Mega Drive)
 *
 * INTERFACE VISUAL: identica ao GB Studio (campos reutilizados)
 * COMPILE: adaptado para emitir SPR_setPosition() do SGDK
 */

const l10n = require('../helpers/l10n').default;

const id = 'EVENT_ACTOR_MOVE_TO';
const groups = ['EVENT_GROUP_ACTOR'];
const subGroups = {
  EVENT_GROUP_ACTOR: 'EVENT_GROUP_MOVEMENT',
};
const weight = 2;

// Label automatico exibido no bloco visual
const autoLabel = (fetchArg, input) => {
  const unitPostfix = input.units === 'pixels' ? 'px' : '';
  return l10n('EVENT_ACTOR_MOVE_TO_LABEL', {
    actor: fetchArg('actorId'),
    x: `${fetchArg('x')}${unitPostfix}`,
    y: `${fetchArg('y')}${unitPostfix}`,
  });
};

// Campos do painel visual (interface drag & drop)
// Identicos ao GB Studio — sem alteracoes necessarias
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
        description: 'Ator que sera movido',
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
            description: 'Posicao X de destino (em tiles, 1 tile = 8px no Mega Drive)',
            type: 'value',
            min: 0,
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
            description: 'Posicao Y de destino (em tiles, 1 tile = 8px no Mega Drive)',
            type: 'value',
            min: 0,
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

/**
 * compile()
 * Recebe os valores preenchidos no editor visual
 * e emite o codigo C correspondente para o SGDK.
 *
 * GB Studio original: chama actorMoveToScriptValues() que gera bytecode GBVM
 * MD Studio: chama sgdkCodeBuilder.actorMoveTo() que emite C legivel
 */
const compile = (input, helpers) => {
  const { sgdk } = helpers;

  // Converte unidade: se for 'pixels', usa direto; se for 'tiles', multiplica por 8
  const xPixels = input.units === 'pixels' ? input.x : `${input.x} * 8`;
  const yPixels = input.units === 'pixels' ? input.y : `${input.y} * 8`;

  sgdk.emitComment(`Mover ator '${input.actorId}' para (${input.x}, ${input.y}) ${input.units || 'tiles'}`);
  sgdk.emitLine(`SPR_setPosition(sprites[${input.actorId}], ${xPixels}, ${yPixels});`);
  sgdk.emitLine(`SPR_update();`);
  sgdk.emitLine(`SYS_doVBlankProcess();`);
};

module.exports = {
  id,
  description: 'Move o ator para uma posicao especifica no Mega Drive',
  autoLabel,
  groups,
  subGroups,
  weight,
  fields,
  compile,
  waitUntilAfterInitFade: true,
  // Hint para o preview visual: mostra o destino no canvas
  helper: {
    type: 'position',
    x: 'x',
    y: 'y',
    units: 'units',
    tileWidth: 1,   // Mega Drive: tiles de 8x8 (diferente do GB que usa 8x16)
    tileHeight: 1,
  },
};
