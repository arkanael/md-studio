const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: EVALUATE MATH EXPRESSION
// Equivalente ao "Math: Evaluate Math Expression" do GB Studio
// Avalia uma expressao matematica e armazena em uma variavel
// ============================================================
const evaluateMathExpressionEvent = {
  id: 'EVENT_EVALUATE_EXPRESSION',
  groups: ['EVENT_GROUP_MATH'],
  name: l10n('EVENT_EVALUATE_EXPRESSION'),
  description: l10n('EVENT_EVALUATE_EXPRESSION_DESC'),
  fields: [
    {
      key: 'variable',
      label: l10n('FIELD_VARIABLE'),
      description: l10n('FIELD_VARIABLE_DESC'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
    {
      key: 'expression',
      label: l10n('FIELD_EXPRESSION'),
      description: l10n('FIELD_EXPRESSION_DESC'),
      type: 'mathExpression',
      defaultValue: '0',
      placeholder: '0',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Avaliar Expressao Matematica');
    // A expressao e compilada como C diretamente
    const expr = (input.expression || '0')
      .replace(/\$/g, '')  // remove prefixo de variavel do GB Studio
      .trim();
    sgdk.emitLine(`${input.variable} = (s16)(${expr});`);
  },
};

// ============================================================
// EVENT: IF MATH EXPRESSION
// Equivalente ao "Math: If Math Expression" do GB Studio
// Executa condicionalmente se a expressao for verdadeira
// ============================================================
const ifMathExpressionEvent = {
  id: 'EVENT_IF_EXPRESSION',
  groups: ['EVENT_GROUP_MATH'],
  name: l10n('EVENT_IF_EXPRESSION'),
  description: l10n('EVENT_IF_EXPRESSION_DESC'),
  fields: [
    {
      key: 'expression',
      label: l10n('FIELD_CONDITION'),
      description: l10n('FIELD_CONDITION_DESC'),
      type: 'mathExpression',
      defaultValue: '0',
      placeholder: '0',
    },
    {
      key: 'true',
      label: l10n('FIELD_TRUE'),
      type: 'events',
    },
    {
      key: 'false',
      label: l10n('FIELD_FALSE'),
      type: 'events',
    },
  ],
  compile: (input, { sgdk, compileEvents }) => {
    sgdk.emitComment('Se Expressao Matematica for Verdadeira');
    const expr = (input.expression || '0')
      .replace(/\$/g, '')
      .trim();
    sgdk.emitLine(`if (${expr}) {`);
    compileEvents(input.true);
    if (input.false && input.false.length > 0) {
      sgdk.emitLine(`} else {`);
      compileEvents(input.false);
    }
    sgdk.emitLine(`}`);
  },
};

// ============================================================
// EVENT: LOOP WHILE MATH EXPRESSION
// Equivalente ao "Math: Loop While Math Expression" do GB Studio
// Loop enquanto a expressao for verdadeira
// ============================================================
const loopWhileMathExpressionEvent = {
  id: 'EVENT_LOOP_WHILE_EXPRESSION',
  groups: ['EVENT_GROUP_MATH'],
  name: l10n('EVENT_LOOP_WHILE_EXPRESSION'),
  description: l10n('EVENT_LOOP_WHILE_EXPRESSION_DESC'),
  fields: [
    {
      key: 'expression',
      label: l10n('FIELD_CONDITION'),
      type: 'mathExpression',
      defaultValue: '0',
      placeholder: '0',
    },
    {
      key: 'true',
      label: l10n('FIELD_LOOP'),
      type: 'events',
    },
  ],
  compile: (input, { sgdk, compileEvents }) => {
    sgdk.emitComment('Loop Enquanto Expressao for Verdadeira');
    const expr = (input.expression || '0')
      .replace(/\$/g, '')
      .trim();
    sgdk.emitLine(`while (${expr}) {`);
    compileEvents(input.true);
    sgdk.emitLine(`  SYS_doVBlankProcess();`);
    sgdk.emitLine(`}`);
  },
};

// ============================================================
// EVENT: MATH FUNCTIONS
// Equivalente ao "Math: Math Functions" do GB Studio
// Operacoes matematicas: set/add/sub/mul/div/mod/min/max/abs
// ============================================================
const mathFunctionsEvent = {
  id: 'EVENT_MATH_FUNCTIONS',
  groups: ['EVENT_GROUP_MATH'],
  name: l10n('EVENT_MATH_FUNCTIONS'),
  description: l10n('EVENT_MATH_FUNCTIONS_DESC'),
  fields: [
    {
      key: 'variable',
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
        ['min', l10n('FIELD_OP_MIN')],
        ['max', l10n('FIELD_OP_MAX')],
        ['abs', l10n('FIELD_OP_ABS')],
        ['clamp', l10n('FIELD_OP_CLAMP')],
      ],
      defaultValue: 'set',
    },
    {
      key: 'valueType',
      label: l10n('FIELD_VALUE_TYPE'),
      type: 'select',
      options: [
        ['val', l10n('FIELD_VALUE_CONST')],
        ['var', l10n('FIELD_VALUE_VARIABLE')],
        ['rnd', l10n('FIELD_VALUE_RANDOM')],
      ],
      defaultValue: 'val',
    },
    {
      key: 'value',
      label: l10n('FIELD_VALUE'),
      type: 'number',
      min: -32768,
      max: 32767,
      defaultValue: 0,
      conditions: [{ key: 'valueType', in: ['val'] }],
    },
    {
      key: 'other',
      label: l10n('FIELD_OTHER_VARIABLE'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
      conditions: [{ key: 'valueType', in: ['var'] }],
    },
    {
      key: 'minVal',
      label: l10n('FIELD_MIN'),
      type: 'number',
      min: -32768,
      max: 32767,
      defaultValue: 0,
      conditions: [{ key: 'operation', in: ['clamp'] }],
    },
    {
      key: 'maxVal',
      label: l10n('FIELD_MAX'),
      type: 'number',
      min: -32768,
      max: 32767,
      defaultValue: 255,
      conditions: [{ key: 'operation', in: ['clamp'] }],
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Funcao Matematica em Variavel');
    const v = input.variable || 'var0';
    const rhs = input.valueType === 'var' ? (input.other || 'var0')
              : input.valueType === 'rnd' ? `(rand() % 256)`
              : (input.value || 0);
    switch (input.operation) {
      case 'set': sgdk.emitLine(`${v} = ${rhs};`); break;
      case 'add': sgdk.emitLine(`${v} += ${rhs};`); break;
      case 'sub': sgdk.emitLine(`${v} -= ${rhs};`); break;
      case 'mul': sgdk.emitLine(`${v} *= ${rhs};`); break;
      case 'div': sgdk.emitLine(`if (${rhs} != 0) ${v} /= ${rhs};`); break;
      case 'mod': sgdk.emitLine(`if (${rhs} != 0) ${v} %= ${rhs};`); break;
      case 'min': sgdk.emitLine(`${v} = (${v} < ${rhs}) ? ${v} : ${rhs};`); break;
      case 'max': sgdk.emitLine(`${v} = (${v} > ${rhs}) ? ${v} : ${rhs};`); break;
      case 'abs': sgdk.emitLine(`${v} = (${v} < 0) ? -${v} : ${v};`); break;
      case 'clamp':
        sgdk.emitLine(`if (${v} < ${input.minVal || 0}) ${v} = ${input.minVal || 0};`);
        sgdk.emitLine(`if (${v} > ${input.maxVal || 255}) ${v} = ${input.maxVal || 255};`);
        break;
      default: sgdk.emitLine(`${v} = ${rhs};`);
    }
  },
};

module.exports = {
  evaluateMathExpressionEvent,
  ifMathExpressionEvent,
  loopWhileMathExpressionEvent,
  mathFunctionsEvent,
};
