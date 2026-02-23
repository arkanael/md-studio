const l10n = require('../helpers/l10n').default;

// Definir Variavel com Valor
const variableSetValueEvent = {
  id: 'EVENT_SET_VALUE',
  groups: ['EVENT_GROUP_VARIABLES'],
  name: l10n('EVENT_SET_VALUE'),
  description: l10n('EVENT_SET_VALUE_DESC'),
  fields: [
    {
      key: 'variable',
      label: l10n('FIELD_VARIABLE'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
    {
      key: 'value',
      label: l10n('FIELD_VALUE'),
      type: 'number',
      min: -32768,
      max: 32767,
      defaultValue: 0,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Definir Variavel');
    sgdk.emitLine(`${input.variable} = ${input.value};`);
  },
};

// Incrementar Variavel
const variableIncrementEvent = {
  id: 'EVENT_INC_VALUE',
  groups: ['EVENT_GROUP_VARIABLES'],
  name: l10n('EVENT_INC_VALUE'),
  description: l10n('EVENT_INC_VALUE_DESC'),
  fields: [
    {
      key: 'variable',
      label: l10n('FIELD_VARIABLE'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Incrementar Variavel');
    sgdk.emitLine(`${input.variable}++;`);
  },
};

// Decrementar Variavel
const variableDecrementEvent = {
  id: 'EVENT_DEC_VALUE',
  groups: ['EVENT_GROUP_VARIABLES'],
  name: l10n('EVENT_DEC_VALUE'),
  description: l10n('EVENT_DEC_VALUE_DESC'),
  fields: [
    {
      key: 'variable',
      label: l10n('FIELD_VARIABLE'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Decrementar Variavel');
    sgdk.emitLine(`${input.variable}--;`);
  },
};

// Operacao Matematica em Variavel
const variableMathEvent = {
  id: 'EVENT_VARIABLE_MATH',
  groups: ['EVENT_GROUP_VARIABLES'],
  name: l10n('EVENT_VARIABLE_MATH'),
  description: l10n('EVENT_VARIABLE_MATH_DESC'),
  fields: [
    {
      key: 'vectorX',
      label: l10n('FIELD_VARIABLE'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
    {
      key: 'operation',
      label: l10n('FIELD_OPERATION'),
      type: 'select',
      options: [
        ['set', l10n('FIELD_OP_SET')],
        ['add', l10n('FIELD_OP_ADD')],
        ['sub', l10n('FIELD_OP_SUB')],
        ['mul', l10n('FIELD_OP_MUL')],
        ['div', l10n('FIELD_OP_DIV')],
        ['mod', l10n('FIELD_OP_MOD')],
      ],
      defaultValue: 'set',
    },
    {
      key: 'other',
      label: l10n('FIELD_VALUE'),
      type: 'number',
      min: -32768,
      max: 32767,
      defaultValue: 0,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Operacao Matematica em Variavel');
    const ops = { set: '=', add: '+=', sub: '-=', mul: '*=', div: '/=', mod: '%=' };
    const op = ops[input.operation] || '=';
    sgdk.emitLine(`${input.vectorX} ${op} ${input.other};`);
  },
};

// Definir Variavel como Valor Aleatorio
const variableRandomEvent = {
  id: 'EVENT_VARIABLE_SET_TO_RANDOM',
  groups: ['EVENT_GROUP_VARIABLES'],
  name: l10n('EVENT_VARIABLE_SET_TO_RANDOM'),
  description: l10n('EVENT_VARIABLE_SET_TO_RANDOM_DESC'),
  fields: [
    {
      key: 'variable',
      label: l10n('FIELD_VARIABLE'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
    {
      key: 'min',
      label: l10n('FIELD_MIN'),
      type: 'number',
      min: 0,
      max: 32767,
      defaultValue: 0,
    },
    {
      key: 'range',
      label: l10n('FIELD_RANGE'),
      type: 'number',
      min: 1,
      max: 256,
      defaultValue: 255,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Variavel = Valor Aleatorio');
    sgdk.emitLine(`${input.variable} = ${input.min} + (rand() % ${input.range});`);
  },
};

// Resetar todas as variaveis
const variablesResetAllEvent = {
  id: 'EVENT_RESET_VARIABLES',
  groups: ['EVENT_GROUP_VARIABLES'],
  name: l10n('EVENT_RESET_VARIABLES'),
  description: l10n('EVENT_RESET_VARIABLES_DESC'),
  fields: [],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Resetar Todas as Variaveis');
    sgdk.emitLine(`memset(game_variables, 0, sizeof(game_variables));`);
  },
};

module.exports = {
  variableSetValueEvent,
  variableIncrementEvent,
  variableDecrementEvent,
  variableMathEvent,
  variableRandomEvent,
  variablesResetAllEvent,
};
