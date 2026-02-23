const id = 'EVENT_IF_VARIABLE_VALUE';

const fields = [
  {
    key: 'variable',
    label: 'Variavel',
    type: 'variable',
    defaultValue: '0',
  },
  {
    key: 'operator',
    label: 'Operador',
    type: 'select',
    options: [
      ['==', 'igual a (==)'],
      ['!=', 'diferente de (!=)'],
      ['<', 'menor que (<)'],
      ['<=', 'menor ou igual (<=)'],
      ['>', 'maior que (>)'],
      ['>=', 'maior ou igual (>=)'],
    ],
    defaultValue: '==',
  },
  {
    key: 'compareTo',
    label: 'Valor',
    type: 'number',
    min: -32768,
    max: 32767,
    defaultValue: 0,
  },
  {
    key: 'true',
    label: 'Se verdadeiro',
    type: 'events',
  },
  {
    key: 'false',
    label: 'Se falso',
    type: 'events',
  },
];

const compile = (input, helpers) => {
  const { sgdk, compileEvents } = helpers;

  const varName = `var_${input.variable}`;
  const op = input.operator || '==';
  const val = input.compareTo !== undefined ? input.compareTo : 0;

  sgdk.emitLine(`// Evento: Se variavel ${varName} ${op} ${val}`);
  sgdk.emitLine(`if (${varName} ${op} ${val}) {`);

  if (input.true?.length) {
    sgdk.emitLine(`  // Bloco verdadeiro`);
    compileEvents(input.true);
  } else {
    sgdk.emitLine(`  // Nenhuma acao definida para verdadeiro`);
  }

  sgdk.emitLine(`} else {`);

  if (input.false?.length) {
    sgdk.emitLine(`  // Bloco falso`);
    compileEvents(input.false);
  } else {
    sgdk.emitLine(`  // Nenhuma acao definida para falso`);
  }

  sgdk.emitLine(`}`);
};

module.exports = {
  id,
  description: 'Verifica se uma variavel atende a uma condicao e executa eventos conforme resultado',
  autoLabel: (fetchArg) => {
    const variable = fetchArg('variable');
    const op = fetchArg('operator');
    const val = fetchArg('compareTo');
    return `Se var_${variable} ${op} ${val}`;
  },
  groups: ['Logica', 'Variaveis'],
  weight: 1.5,
  fields,
  compile,
};
