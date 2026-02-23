const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: SET BACKGROUND PALETTES
// Equivalente ao "Color: Set Background Palettes" do GB Studio
// No Mega Drive: define paletas VDP (PAL0-PAL3) para BG
// ============================================================
const setBackgroundPalettesEvent = {
  id: 'EVENT_SET_BG_PALETTES',
  groups: ['EVENT_GROUP_COLOR'],
  name: l10n('EVENT_SET_BG_PALETTES'),
  description: l10n('EVENT_SET_BG_PALETTES_DESC'),
  fields: [
    {
      key: 'palette0',
      label: '0: ' + l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'background',
      defaultValue: '',
      optional: true,
    },
    {
      key: 'palette1',
      label: '1: ' + l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'background',
      defaultValue: '',
      optional: true,
    },
    {
      key: 'palette2',
      label: '2: ' + l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'background',
      defaultValue: '',
      optional: true,
    },
    {
      key: 'palette3',
      label: '3: ' + l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'background',
      defaultValue: '',
      optional: true,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Definir Paletas de Fundo');
    // No Mega Drive, paletas sao arrays de 16 cores u16
    if (input.palette0) sgdk.emitLine(`PAL_setPalette(PAL0, ${input.palette0}, CPU);`);
    if (input.palette1) sgdk.emitLine(`PAL_setPalette(PAL1, ${input.palette1}, CPU);`);
    if (input.palette2) sgdk.emitLine(`PAL_setPalette(PAL2, ${input.palette2}, CPU);`);
    if (input.palette3) sgdk.emitLine(`PAL_setPalette(PAL3, ${input.palette3}, CPU);`);
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

// ============================================================
// EVENT: SET SPRITE PALETTES
// Equivalente ao "Color: Set Sprite Palettes" do GB Studio
// No Mega Drive: define paletas VDP para sprites (PAL0-PAL3)
// ============================================================
const setSpritePalettesEvent = {
  id: 'EVENT_SET_SPRITE_PALETTES',
  groups: ['EVENT_GROUP_COLOR'],
  name: l10n('EVENT_SET_SPRITE_PALETTES'),
  description: l10n('EVENT_SET_SPRITE_PALETTES_DESC'),
  fields: [
    {
      key: 'palette0',
      label: '0: ' + l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'sprite',
      defaultValue: '',
      optional: true,
    },
    {
      key: 'palette1',
      label: '1: ' + l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'sprite',
      defaultValue: '',
      optional: true,
    },
    {
      key: 'palette2',
      label: '2: ' + l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'sprite',
      defaultValue: '',
      optional: true,
    },
    {
      key: 'palette3',
      label: '3: ' + l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'sprite',
      defaultValue: '',
      optional: true,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Definir Paletas de Sprite');
    // Sprites no MD compartilham as mesmas 4 paletas do VDP
    if (input.palette0) sgdk.emitLine(`PAL_setPalette(PAL0, ${input.palette0}, CPU);`);
    if (input.palette1) sgdk.emitLine(`PAL_setPalette(PAL1, ${input.palette1}, CPU);`);
    if (input.palette2) sgdk.emitLine(`PAL_setPalette(PAL2, ${input.palette2}, CPU);`);
    if (input.palette3) sgdk.emitLine(`PAL_setPalette(PAL3, ${input.palette3}, CPU);`);
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

// ============================================================
// EVENT: SET UI PALETTE
// Equivalente ao "Color: Set UI Palette" do GB Studio
// No Mega Drive: paleta usada para texto/UI no plano BG_B
// ============================================================
const setUIPaletteEvent = {
  id: 'EVENT_SET_UI_PALETTE',
  groups: ['EVENT_GROUP_COLOR'],
  name: l10n('EVENT_SET_UI_PALETTE'),
  description: l10n('EVENT_SET_UI_PALETTE_DESC'),
  fields: [
    {
      key: 'palette',
      label: l10n('FIELD_PALETTE'),
      type: 'palette',
      paletteType: 'ui',
      defaultValue: '',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Definir Paleta da UI');
    // UI usa PAL1 por convencao no MD Studio
    if (input.palette) sgdk.emitLine(`PAL_setPalette(PAL1, ${input.palette}, CPU);`);
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

// ============================================================
// EVENT: SET SINGLE PALETTE ENTRY
// Define uma unica cor em uma posicao especifica da paleta
// ============================================================
const setPaletteEntryEvent = {
  id: 'EVENT_SET_PALETTE_ENTRY',
  groups: ['EVENT_GROUP_COLOR'],
  name: l10n('EVENT_SET_PALETTE_ENTRY'),
  description: l10n('EVENT_SET_PALETTE_ENTRY_DESC'),
  fields: [
    {
      key: 'paletteIndex',
      label: l10n('FIELD_PALETTE_INDEX'),
      type: 'select',
      options: [
        ['0', 'PAL0'],
        ['1', 'PAL1'],
        ['2', 'PAL2'],
        ['3', 'PAL3'],
      ],
      defaultValue: '0',
    },
    {
      key: 'colorIndex',
      label: l10n('FIELD_COLOR_INDEX'),
      type: 'number',
      min: 0,
      max: 15,
      defaultValue: 0,
    },
    {
      key: 'r',
      label: 'R',
      type: 'number',
      min: 0,
      max: 7,
      defaultValue: 7,
    },
    {
      key: 'g',
      label: 'G',
      type: 'number',
      min: 0,
      max: 7,
      defaultValue: 7,
    },
    {
      key: 'b',
      label: 'B',
      type: 'number',
      min: 0,
      max: 7,
      defaultValue: 7,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Definir Cor na Paleta');
    const palMap = { '0': 'PAL0', '1': 'PAL1', '2': 'PAL2', '3': 'PAL3' };
    const pal = palMap[input.paletteIndex] || 'PAL0';
    const idx = input.colorIndex || 0;
    // Mega Drive: cor RGB333 empacotada como u16
    const r = (input.r || 0) & 0x7;
    const g = (input.g || 0) & 0x7;
    const b = (input.b || 0) & 0x7;
    sgdk.emitLine(`PAL_setColor(${idx + (parseInt(input.paletteIndex || '0') * 16)}, RGB3_3_3(${r}, ${g}, ${b}));`);
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

module.exports = {
  setBackgroundPalettesEvent,
  setSpritePalettesEvent,
  setUIPaletteEvent,
  setPaletteEntryEvent,
};
