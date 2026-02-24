/**
 * eventControlFlowExtended.js
 * MD Studio - Eventos de Controle de Fluxo Estendidos (Loop For, If Button Held, Pause/Resume)
 */
'use strict';

const l10n = require('../helpers/l10n').default;

const loopFor = {
  id: 'EVENT_LOOP_FOR',
  label: 'Loop For',
  groups: ['EVENT_GROUP_CONTROL_FLOW'],
  fields: [
    { key: 'variable', label: 'For Variable', type: 'variable', defaultValue: 'LAST_VARIABLE' },
    { key: 'from', label: 'From', type: 'number', defaultValue: 0 },
    { key: 'comparison', label: 'Comparison', type: 'operator', defaultValue: '<=' },
    { key: 'to', label: 'To', type: 'number', defaultValue: 10 },
    { key: 'operation', label: 'Operation', type: 'select', options: [['+=', 'Add (+=)'], ['-=', 'Sub (-=)']], defaultValue: '+=' },
    { key: 'value', label: 'Value', type: 'number', defaultValue: 1 },
    { key: 'true', label: 'Events', type: 'events' },
  ],
  compile: (input, helpers) => {
    const { appendRaw, compileEvents, _addComment } = helpers;
    _addComment('Loop For');
    appendRaw(`  for (script_var_${input.variable} = ${input.from}; script_var_${input.variable} ${input.comparison} ${input.to}; script_var_${input.variable} ${input.operation} ${input.value}) {`);
    compileEvents(input.true);
    appendRaw(`    SYS_doVBlankProcess();`);
    appendRaw(`  }`);
  },
};

const ifButtonHeld = {
  id: 'EVENT_IF_BUTTON_HELD',
  label: 'If Button Held',
  groups: ['EVENT_GROUP_CONTROL_FLOW', 'EVENT_GROUP_INPUT'],
  fields: [
    { key: 'buttons', label: 'Any of', type: 'buttons', defaultValue: ['a'] },
    { key: 'true', label: 'True', type: 'events' },
    { key: 'false', label: 'False', type: 'events' },
  ],
  compile: (input, helpers) => {
    const { appendRaw, compileEvents, _addComment } = helpers;
    _addComment('If Button Held');
    const buttonMask = input.buttons.map(b => `BUTTON_${b.toUpperCase()}`).join(' | ');
    appendRaw(`  if (JOY_readJoypad(JOY_1) & (${buttonMask})) {`);
    compileEvents(input.true);
    if (input.false && input.false.length > 0) {
      appendRaw(`  } else {`);
      compileEvents(input.false);
    }
    appendRaw(`  }`);
  },
};

const pauseLogic = {
  id: 'EVENT_PAUSE_LOGIC',
  label: 'Pause Logic For Scene Type',
  groups: ['EVENT_GROUP_CONTROL_FLOW'],
  compile: (input, helpers) => {
    helpers.appendRaw(`  engine_pause_logic();`);
  },
};

const resumeLogic = {
  id: 'EVENT_RESUME_LOGIC',
  label: 'Resume Logic For Scene Type',
  groups: ['EVENT_GROUP_CONTROL_FLOW'],
  compile: (input, helpers) => {
    helpers.appendRaw(`  engine_resume_logic();`);
  },
};

module.exports = { loopFor, ifButtonHeld, pauseLogic, resumeLogic };
