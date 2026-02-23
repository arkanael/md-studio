const l10n = require('../helpers/l10n').default;

const ifVariableTrueEvent = {
  id: 'EVENT_IF_TRUE',
  groups: ['EVENT_GROUP_CONTROL_FLOW'],
  name: l10n('EVENT_IF_TRUE'),
  description: l10n('EVENT_IF_TRUE_DESC'),
  fields: [
    {
      key: 'variable',
      label: l10n('FIELD_VARIABLE'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
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
    sgdk.emitComment('Se Variavel for Verdadeira');
    sgdk.emitLine(`if (${input.variable} != 0) {`);
    compileEvents(input.true);
    if (input.false && input.false.length > 0) {
      sgdk.emitLine(`} else {`);
      compileEvents(input.false);
    }
    sgdk.emitLine(`}`);
  },
};

const switchEvent = {
  id: 'EVENT_SWITCH',
  groups: ['EVENT_GROUP_CONTROL_FLOW'],
  name: l10n('EVENT_SWITCH'),
  description: l10n('EVENT_SWITCH_DESC'),
  fields: [
    {
      key: 'variable',
      label: l10n('FIELD_VARIABLE'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
    {
      key: 'choices',
      type: 'number',
      label: l10n('FIELD_NUMBER_OF_OPTIONS'),
      min: 1,
      max: 16,
      defaultValue: 2,
    },
  ],
  compile: (input, { sgdk, compileEvents }) => {
    sgdk.emitComment('Switch de Variavel');
    sgdk.emitLine(`switch (${input.variable}) {`);
    for (let i = 0; i < input.choices; i++) {
      sgdk.emitLine(`  case ${input[`value${i}`] || i}:`);
      compileEvents(input[`events${i}`]);
      sgdk.emitLine(`    break;`);
    }
    sgdk.emitLine(`}`);
  },
};

const loopForeverEvent = {
  id: 'EVENT_LOOP_FOREVER',
  groups: ['EVENT_GROUP_CONTROL_FLOW'],
  name: l10n('EVENT_LOOP_FOREVER'),
  description: l10n('EVENT_LOOP_FOREVER_DESC'),
  fields: [
    {
      key: 'true',
      label: l10n('FIELD_LOOP'),
      type: 'events',
    },
  ],
  compile: (input, { sgdk, compileEvents }) => {
    sgdk.emitComment('Loop Infinito');
    sgdk.emitLine(`while (1) {`);
    compileEvents(input.true);
    sgdk.emitLine(`  SYS_doVBlankProcess();`);
    sgdk.emitLine(`}`);
  },
};

const stopScriptEvent = {
  id: 'EVENT_STOP',
  groups: ['EVENT_GROUP_CONTROL_FLOW'],
  name: l10n('EVENT_STOP'),
  description: l10n('EVENT_STOP_DESC'),
  fields: [],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Parar Script');
    sgdk.emitLine(`return;`);
  },
};

module.exports = {
  ifVariableTrueEvent,
  switchEvent,
  loopForeverEvent,
  stopScriptEvent,
};
