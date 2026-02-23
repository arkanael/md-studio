const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: DIALOGUE - Exibir Diálogo
// Equivalente ao "Text: Display Dialogue" do GB Studio
// Exibe uma caixa de texto na parte inferior da tela
// ============================================================
const displayDialogueEvent = {
  id: 'EVENT_TEXT',
  groups: ['EVENT_GROUP_DIALOGUE'],
  name: l10n('EVENT_TEXT'),
  description: l10n('EVENT_TEXT_DESC'),
  fields: [
    {
      key: 'text',
      label: l10n('FIELD_TEXT'),
      description: l10n('FIELD_TEXT_DESC'),
      type: 'textarea',
      placeholder: l10n('FIELD_TEXT_PLACEHOLDER'),
      updateLabel: true,
      defaultValue: '',
    },
    {
      key: 'avatarId',
      label: l10n('FIELD_AVATAR'),
      description: l10n('FIELD_AVATAR_DESC'),
      type: 'avatar',
      optional: true,
      defaultValue: '',
    },
    {
      key: 'clearPrevious',
      label: l10n('FIELD_CLEAR_PREVIOUS'),
      description: l10n('FIELD_CLEAR_PREVIOUS_DESC'),
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  compile: (input, { sgdk }) => {
    const text = input.text || '';
    const lines = text.split('\n').slice(0, 3);
    sgdk.emitComment('Exibir Dialogo');
    if (input.clearPrevious) {
      sgdk.emitLine(`VDP_clearTextLine(BG_B, 0, 0, 320);`);
    }
    sgdk.emitLine(`VDP_setTextPlan(BG_B);`);
    lines.forEach((line, i) => {
      const safe = line.replace(/'/g, "\\'").replace(/"/g, '\\"').substring(0, 38);
      sgdk.emitLine(`VDP_drawText("${safe}", 1, ${24 + i});`);
    });
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

// ============================================================
// EVENT: DISPLAY MENU - Exibir Menu de Opções
// Equivalente ao "Text: Display Menu" do GB Studio
// Exibe um menu com múltiplas opções e armazena a escolha
// ============================================================
const displayMenuEvent = {
  id: 'EVENT_MENU',
  groups: ['EVENT_GROUP_DIALOGUE'],
  name: l10n('EVENT_MENU'),
  description: l10n('EVENT_MENU_DESC'),
  fields: [
    {
      key: 'variable',
      label: l10n('FIELD_VARIABLE'),
      description: l10n('FIELD_VARIABLE_DESC'),
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
    {
      key: 'items',
      label: l10n('FIELD_ITEMS'),
      description: l10n('FIELD_ITEMS_DESC'),
      type: 'number',
      min: 2,
      max: 8,
      defaultValue: 2,
    },
    {
      key: 'layout',
      label: l10n('FIELD_LAYOUT'),
      description: l10n('FIELD_LAYOUT_DESC'),
      type: 'select',
      options: [
        ['menu', l10n('FIELD_LAYOUT_MENU')],
        ['dialogue', l10n('FIELD_LAYOUT_DIALOGUE')],
      ],
      defaultValue: 'menu',
    },
    {
      key: 'cancelOnLastOption',
      label: l10n('FIELD_CANCEL_ON_LAST_OPTION'),
      description: l10n('FIELD_CANCEL_ON_LAST_OPTION_DESC'),
      type: 'checkbox',
      defaultValue: false,
    },
    {
      key: 'cancelOnB',
      label: l10n('FIELD_CANCEL_ON_B'),
      description: l10n('FIELD_CANCEL_ON_B_DESC'),
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  compile: (input, { sgdk }) => {
    const items = input.items || 2;
    const variable = input.variable || 'var0';
    sgdk.emitComment('Exibir Menu de Opcoes');
    sgdk.emitLine(`u8 ${variable}_selection = 0;`);
    sgdk.emitLine(`u8 ${variable}_cursor = 0;`);
    sgdk.emitLine(`u8 ${variable}_items = ${items};`);
    sgdk.emitLine(`VDP_setTextPlan(BG_B);`);
    for (let i = 0; i < items; i++) {
      sgdk.emitLine(`VDP_drawText("Opcao ${i + 1}", 22, ${20 + i});`);
    }
    sgdk.emitLine(`while (${variable}_selection == 0) {`);
    sgdk.emitLine(`  u16 value = JOY_readJoypad(JOY_1);`);
    sgdk.emitLine(`  if (value & BUTTON_DOWN) { if (${variable}_cursor < ${items - 1}) ${variable}_cursor++; }`);
    sgdk.emitLine(`  if (value & BUTTON_UP) { if (${variable}_cursor > 0) ${variable}_cursor--; }`);
    sgdk.emitLine(`  if (value & BUTTON_A) { ${variable}_selection = ${variable}_cursor + 1; }`);
    if (input.cancelOnB) {
      sgdk.emitLine(`  if (value & BUTTON_B) { ${variable}_selection = 0; break; }`);
    }
    sgdk.emitLine(`  SYS_doVBlankProcess();`);
    sgdk.emitLine(`}`);
    sgdk.emitLine(`${variable} = ${variable}_selection;`);
  },
};

// ============================================================
// EVENT: SET TEXT ANIMATION SPEED - Velocidade de Animação
// Equivalente ao "Text: Set Animation Speed" do GB Studio
// Define a velocidade de abertura/fechamento e desenho do texto
// ============================================================
const setTextAnimationSpeedEvent = {
  id: 'EVENT_TEXT_SET_ANIMATION_SPEED',
  groups: ['EVENT_GROUP_DIALOGUE'],
  name: l10n('EVENT_TEXT_SET_ANIMATION_SPEED'),
  description: l10n('EVENT_TEXT_SET_ANIMATION_SPEED_DESC'),
  fields: [
    {
      key: 'speedIn',
      label: l10n('FIELD_TEXT_OPEN_SPEED'),
      description: l10n('FIELD_TEXT_OPEN_SPEED_DESC'),
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 1,
    },
    {
      key: 'speedOut',
      label: l10n('FIELD_TEXT_CLOSE_SPEED'),
      description: l10n('FIELD_TEXT_CLOSE_SPEED_DESC'),
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 1,
    },
    {
      key: 'textSpeed',
      label: l10n('FIELD_TEXT_DRAW_SPEED'),
      description: l10n('FIELD_TEXT_DRAW_SPEED_DESC'),
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 1,
    },
    {
      key: 'fastForward',
      label: l10n('FIELD_FAST_FORWARD'),
      description: l10n('FIELD_FAST_FORWARD_DESC'),
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Configurar Velocidade de Animacao de Texto');
    sgdk.emitLine(`// Text animation speed: in=${input.speedIn} out=${input.speedOut} draw=${input.textSpeed}`);
    sgdk.emitLine(`u8 textSpeedIn = ${input.speedIn || 1};`);
    sgdk.emitLine(`u8 textSpeedOut = ${input.speedOut || 1};`);
    sgdk.emitLine(`u8 textDrawSpeed = ${input.textSpeed || 1};`);
    if (input.fastForward) {
      sgdk.emitLine(`u8 textFastForward = 1;`);
    }
  },
};

module.exports = {
  displayDialogueEvent,
  displayMenuEvent,
  setTextAnimationSpeedEvent,
};
