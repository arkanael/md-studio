const l10n = require('../helpers/l10n').default;

// Verificar se Botao Esta Pressionado (If Input Pressed)
const ifInputPressedEvent = {
  id: 'EVENT_IF_INPUT',
  groups: ['EVENT_GROUP_INPUT'],
  name: l10n('EVENT_IF_INPUT'),
  description: l10n('EVENT_IF_INPUT_DESC'),
  fields: [
    {
      key: 'input',
      label: l10n('FIELD_INPUT'),
      description: l10n('FIELD_INPUT_DESC'),
      type: 'input',
      multiple: true,
      defaultValue: ['b'],
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
    sgdk.emitComment('Se Botao Pressionado');
    // Mapa de botoes GB Studio -> SGDK Mega Drive
    const buttonMap = {
      'up': 'BUTTON_UP',
      'down': 'BUTTON_DOWN',
      'left': 'BUTTON_LEFT',
      'right': 'BUTTON_RIGHT',
      'a': 'BUTTON_A',
      'b': 'BUTTON_B',
      'start': 'BUTTON_START',
      'select': 'BUTTON_MODE',
    };
    const inputs = Array.isArray(input.input) ? input.input : [input.input || 'b'];
    const conditions = inputs.map(btn => `(joy & ${buttonMap[btn] || 'BUTTON_B'})`).join(' || ');
    sgdk.emitLine(`u16 joy = JOY_readJoypad(JOY_1);`);
    sgdk.emitLine(`if (${conditions}) {`);
    compileEvents(input.true);
    if (input.false && input.false.length > 0) {
      sgdk.emitLine(`} else {`);
      compileEvents(input.false);
    }
    sgdk.emitLine(`}`);
  },
};

// Aguardar Pressionamento de Botao (Wait for Input)
const awaitInputEvent = {
  id: 'EVENT_AWAIT_INPUT',
  groups: ['EVENT_GROUP_INPUT'],
  name: l10n('EVENT_AWAIT_INPUT'),
  description: l10n('EVENT_AWAIT_INPUT_DESC'),
  fields: [
    {
      key: 'input',
      label: l10n('FIELD_INPUT'),
      description: l10n('FIELD_INPUT_DESC'),
      type: 'input',
      multiple: true,
      defaultValue: ['a', 'b', 'start'],
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Aguardar Pressionamento de Botao');
    const buttonMap = {
      'up': 'BUTTON_UP',
      'down': 'BUTTON_DOWN',
      'left': 'BUTTON_LEFT',
      'right': 'BUTTON_RIGHT',
      'a': 'BUTTON_A',
      'b': 'BUTTON_B',
      'start': 'BUTTON_START',
      'select': 'BUTTON_MODE',
    };
    const inputs = Array.isArray(input.input) ? input.input : [input.input || 'a'];
    const conditions = inputs.map(btn => `(joy & ${buttonMap[btn] || 'BUTTON_A'})`).join(' || ');
    sgdk.emitLine(`{ u16 joy;`);
    sgdk.emitLine(`  do {`);
    sgdk.emitLine(`    SYS_doVBlankProcess();`);
    sgdk.emitLine(`    joy = JOY_readJoypad(JOY_1);`);
    sgdk.emitLine(`  } while (!(${conditions}));`);
    sgdk.emitLine(`}`);
  },
};

// Vincular Script a Botao (Attach Script to Button)
const attachScriptToButtonEvent = {
  id: 'EVENT_ATTACH_SCRIPT_TO_BUTTON',
  groups: ['EVENT_GROUP_INPUT'],
  name: l10n('EVENT_ATTACH_SCRIPT_TO_BUTTON'),
  description: l10n('EVENT_ATTACH_SCRIPT_TO_BUTTON_DESC'),
  fields: [
    {
      key: 'input',
      label: l10n('FIELD_INPUT'),
      type: 'input',
      multiple: false,
      defaultValue: 'b',
    },
    {
      key: 'true',
      label: l10n('FIELD_SCRIPT'),
      type: 'events',
    },
  ],
  compile: (input, { sgdk, compileEvents }) => {
    sgdk.emitComment('Vincular Script ao Botao (Verificado no Loop Principal)');
    const buttonMap = {
      'up': 'BUTTON_UP',
      'down': 'BUTTON_DOWN',
      'left': 'BUTTON_LEFT',
      'right': 'BUTTON_RIGHT',
      'a': 'BUTTON_A',
      'b': 'BUTTON_B',
      'start': 'BUTTON_START',
      'select': 'BUTTON_MODE',
    };
    const btn = buttonMap[input.input] || 'BUTTON_B';
    sgdk.emitLine(`if (JOY_readJoypad(JOY_1) & ${btn}) {`);
    compileEvents(input.true);
    sgdk.emitLine(`}`);
  },
};

// Remover Script de Botao
const removeScriptFromButtonEvent = {
  id: 'EVENT_REMOVE_SCRIPT_FROM_BUTTON',
  groups: ['EVENT_GROUP_INPUT'],
  name: l10n('EVENT_REMOVE_SCRIPT_FROM_BUTTON'),
  description: l10n('EVENT_REMOVE_SCRIPT_FROM_BUTTON_DESC'),
  fields: [
    {
      key: 'input',
      label: l10n('FIELD_INPUT'),
      type: 'input',
      multiple: false,
      defaultValue: 'b',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Remover Script do Botao (noop - gerenciado pelo loop)');
    sgdk.emitLine(`// Botao desvinculado: ${input.input || 'b'}`);
  },
};

module.exports = {
  ifInputPressedEvent,
  awaitInputEvent,
  attachScriptToButtonEvent,
  removeScriptFromButtonEvent,
};
