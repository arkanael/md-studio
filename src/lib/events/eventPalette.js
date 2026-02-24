// eventPalette.js - Palette Control for MD Studio (SGDK)
// Handles color modifications and palette fades.

const setPaletteColorEvent = {
  id: 'EVENT_SET_PALETTE_COLOR',
  name: 'Set Palette Color',
  description: 'Modify a specific color in the palette.',
  groups: ['EVENT_GROUP_PALETTE'],
  fields: [
    {
      key: 'palette',
      label: 'Palette Index (0-3)',
      type: 'number',
      min: 0,
      max: 3,
      defaultValue: 0,
    },
    {
      key: 'colorIndex',
      label: 'Color Index (0-15)',
      type: 'number',
      min: 0,
      max: 15,
      defaultValue: 0,
    },
    {
      key: 'color',
      label: 'Color (Hex)',
      type: 'text',
      defaultValue: '0xFFF',
    },
  ],
  compile: (input, { helpers: { sgdk } }) => {
    sgdk.emitLine(`VDP_setPaletteColor(${input.palette} * 16 + ${input.colorIndex}, ${input.color});`);
  },
};

const fadePaletteEvent = {
  id: 'EVENT_FADE_PALETTE',
  name: 'Fade Palette',
  description: 'Fade the entire palette or a specific one.',
  groups: ['EVENT_GROUP_PALETTE'],
  fields: [
    {
      key: 'type',
      label: 'Fade Type',
      type: 'select',
      options: [
        ['in', 'Fade In'],
        ['out', 'Fade Out'],
      ],
      defaultValue: 'in',
    },
    {
      key: 'speed',
      label: 'Speed',
      type: 'number',
      min: 1,
      max: 60,
      defaultValue: 10,
    },
  ],
  compile: (input, { helpers: { sgdk } }) => {
    if (input.type === 'in') {
      sgdk.emitLine(`PAL_fadeIn(0, 63, palette_full, ${input.speed}, FALSE);`);
    } else {
      sgdk.emitLine(`PAL_fadeOut(0, 63, ${input.speed}, FALSE);`);
    }
  },
};

module.exports = {
  setPaletteColorEvent,
  fadePaletteEvent,
};
