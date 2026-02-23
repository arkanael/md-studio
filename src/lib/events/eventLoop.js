const id = 'EVENT_LOOP';

const fields = [
  {
    key: 'type',
    label: 'Tipo de loop',
    type: 'select',
    options: [
      ['forever', 'Loop infinito'],
      ['times', 'Repetir N vezes'],
      ['while', 'Enquanto variavel for verdadeira'],
    ],
    defaultValue: 'forever',
  },
  {
    key: 'times',
    label: 'Numero de repeticoes',
    type: 'number',
    min: 1,
    max: 9999,
    defaultValue: 5,
    conditions: [{ key: 'type', eq: 'times' }],
  },
  {
    key: 'variable',
    label: 'Variavel de controle',
    type: 'variable',
    defaultValue: '0',
    conditions: [{ key: 'type', eq: 'while' }],
  },
  {
    key: 'events',
    label: 'Eventos do loop',
    type: 'events',
  },
];

const compile = (input, helpers) => {
  const { sgdk, compileEvents } = helpers;

  const type = input.type || 'forever';

  if (type === 'forever') {
    sgdk.emitLine(`// Loop infinito`);
    sgdk.emitLine(`while (1) {`);
    if (input.events?.length) {
      compileEvents(input.events);
    }
    sgdk.emitLine(`  SYS_doVBlankProcess(); // sincronizar com VBlank`);
    sgdk.emitLine(`}`);
  } else if (type === 'times') {
    const times = input.times || 5;
    sgdk.emitLine(`// Loop repetir ${times} vezes`);
    sgdk.emitLine(`for (int loop_i = 0; loop_i < ${times}; loop_i++) {`);
    if (input.events?.length) {
      compileEvents(input.events);
    }
    sgdk.emitLine(`}`);
  } else if (type === 'while') {
    const varName = `var_${input.variable || '0'}`;
    sgdk.emitLine(`// Loop enquanto ${varName} for verdadeiro`);
    sgdk.emitLine(`while (${varName}) {`);
    if (input.events?.length) {
      compileEvents(input.events);
    }
    sgdk.emitLine(`  SYS_doVBlankProcess();`);
    sgdk.emitLine(`}`);
  }
};

module.exports = {
  id,
  description: 'Executa um bloco de eventos repetidamente: infinito, N vezes, ou enquanto variavel for verdadeira',
  autoLabel: (fetchArg) => {
    const type = fetchArg('type');
    const times = fetchArg('times');
    if (type === 'forever') return 'Loop infinito';
    if (type === 'times') return `Repetir ${times || 5}x`;
    const variable = fetchArg('variable');
    return `Enquanto var_${variable}`;
  },
  groups: ['Logica', 'Controle'],
  weight: 2,
  fields,
  compile,
};
