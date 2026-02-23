const id = 'EVENT_SET_VARIABLE';

const fields = [
  {
    key: 'variable',
    label: 'Variavel',
    type: 'variable',
    defaultValue: '0',
  },
  {
    key: 'operation',
    label: 'Operacao',
    type: 'select',
    options: [
      ['set', 'Definir valor (=)'],
      ['add', 'Somar (+=)'],
      ['sub', 'Subtrair (-=)'],
      ['mul', 'Multiplicar (*=)'],
      ['div', 'Dividir (/=)'],
      ['mod', 'Modulo (%=)'],
    ],
    defaultValue: 'set',
  },
  {
    key: 'value',
    label: 'Valor',
    type: 'number',
    min: -32768,
    max: 32767,
    defaultValue: 0,
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;

  const varName = `var_${input.variable}`;
  const val = input.value !== undefined ? input.value : 0;
  const op = input.operation || 'set';

  const opMap = {
    set: '=',
    add: '+=',
    sub: '-=',
    mul: '*=',
    div: '/=',
    mod: '%=',
  };

  const cOp = opMap[op] || '=';

  sgdk.emitLine(`// Evento: Variavel ${varName} ${cOp} ${val}`);
  sgdk.emitLine(`${varName} ${cOp} ${val};`);
};

module.exports = {
  id,
  description: 'Define ou modifica o valor de uma variavel do jogo',
  autoLabel: (fetchArg) => {
    const variable = fetchArg('variable');
    const op = fetchArg('operation');
    const value = fetchArg('value');
    const opLabels = { set: '=', add: '+=', sub: '-=', mul: '*=', div: '/=', mod: '%=' };
    return `var_${variable} ${opLabels[op] || '='} ${value}`;
  },
  groups: ['Variaveis'],
  weight: 1,
  fields,
  compile,
};
