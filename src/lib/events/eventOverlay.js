const l10n = require('../helpers/l10n').default;

// Overlay: Show - Exibir Overlay
const overlayShowEvent = {
  id: 'EVENT_OVERLAY_SHOW',
  groups: ['EVENT_GROUP_SCREEN'],
  name: l10n('EVENT_OVERLAY_SHOW'),
  description: l10n('EVENT_OVERLAY_SHOW_DESC'),
  fields: [
    {
      key: 'color',
      label: l10n('FIELD_COLOR'),
      type: 'select',
      options: [
        ['black', l10n('FIELD_COLOR_BLACK')],
        ['white', l10n('FIELD_COLOR_WHITE')],
      ],
      defaultValue: 'black',
    },
    {
      key: 'x',
      label: l10n('FIELD_X'),
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'y',
      label: l10n('FIELD_Y'),
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Exibir Overlay');
    sgdk.emitLine(`VDP_setWindowVPos(FALSE, ${input.y});`);
    sgdk.emitLine(`VDP_setWindowHPos(FALSE, ${input.x});`);
  },
};

// Overlay: Hide - Ocultar Overlay
const overlayHideEvent = {
  id: 'EVENT_OVERLAY_HIDE',
  groups: ['EVENT_GROUP_SCREEN'],
  name: l10n('EVENT_OVERLAY_HIDE'),
  description: l10n('EVENT_OVERLAY_HIDE_DESC'),
  fields: [],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Ocultar Overlay');
    sgdk.emitLine(`VDP_setWindowVPos(FALSE, 0);`);
    sgdk.emitLine(`VDP_setWindowHPos(FALSE, 0);`);
  },
};

// Overlay: Move To - Mover Overlay
const overlayMoveToEvent = {
  id: 'EVENT_OVERLAY_MOVE_TO',
  groups: ['EVENT_GROUP_SCREEN'],
  name: l10n('EVENT_OVERLAY_MOVE_TO'),
  description: l10n('EVENT_OVERLAY_MOVE_TO_DESC'),
  fields: [
    {
      key: 'x',
      label: l10n('FIELD_X'),
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'y',
      label: l10n('FIELD_Y'),
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'speed',
      label: l10n('FIELD_SPEED'),
      type: 'number',
      min: 0,
      max: 5,
      defaultValue: 1,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Mover Overlay');
    sgdk.emitLine(`VDP_setWindowVPos(FALSE, ${input.y});`);
    sgdk.emitLine(`VDP_setWindowHPos(FALSE, ${input.x});`);
  },
};

module.exports = {
  overlayShowEvent,
  overlayHideEvent,
  overlayMoveToEvent,
};
