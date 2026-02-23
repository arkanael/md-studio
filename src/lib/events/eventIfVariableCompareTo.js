const id = 'EVENT_IF_VARIABLE_COMPARE_TO';

const fields = [
  {
    key: 'variableA',
    label: 'Variavel A',
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
    key: 'variableB',
    label: 'Variavel B',
    type: 'variable',
    defaultValue: '1',
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

  const varA = `var_${input.variableA}`;
  const varB = `var_${input.variableB}`;
  const op = input.operator || '==';

  sgdk.emitLine(`// Evento: Se ${varA} ${op} ${varB}`);
  sgdk.emitLine(`if (${varA} ${op} ${varB}) {`);

  if (input.true?.length) {
    sgdk.emitLine(`  // Bloco verdadeiro`);
    compileEvents(input.true);
  } else {
    sgdk.emitLine(`  // Nenhuma acao para verdadeiro`);
  }

  sgdk.emitLine(`} else {`);

  if (input.false?.length) {
    sgdk.emitLine(`  // Bloco falso`);
    compileEvents(input.false);
  } else {
    sgdk.emitLine(`  // Nenhuma acao para falso`);
  }

  sgdk.emitLine(`}`);
};

module.exports = {
  id,
  description: 'Compara duas variaveis usando um operador logico e executa blocos conforme resultado',
  autoLabel: (fetchArg) => {
    const varA = fetchArg('variableA');
    const op = fetchArg('operator');
    const varB = fetchArg('variableB');
    return `Se var_${varA} ${op} var_${varB}`;
  },
  groups: ['Logica', 'Variaveis'],
  weight: 1.5,
  fields,
  compile,
};
