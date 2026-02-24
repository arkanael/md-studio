// eventPlane.js - Background Plane Control for MD Studio (SGDK)
// Allows setting the scroll position of BG_A and BG_B planes independently.

const setPlaneScrollEvent = {
  id: 'EVENT_SET_PLANE_SCROLL',
  name: 'Set Plane Scroll',
  description: 'Set the scroll position for a background plane (BG_A or BG_B).',
  groups: ['EVENT_GROUP_SCENE'],
  fields: [
    {
      key: 'plane',
      label: 'Plane',
      type: 'select',
      options: [
        ['BG_A', 'Plane A'],
        ['BG_B', 'Plane B'],
      ],
      defaultValue: 'BG_A',
    },
    {
      key: 'x',
      label: 'X',
      type: 'number',
      min: -1024,
      max: 1024,
      defaultValue: 0,
    },
    {
      key: 'y',
      label: 'Y',
      type: 'number',
      min: -1024,
      max: 1024,
      defaultValue: 0,
    },
  ],
  compile: (input, { helpers: { sgdk } }) => {
    sgdk.emitLine(`VDP_setHorizontalScroll(${input.plane}, ${input.x});`);
    sgdk.emitLine(`VDP_setVerticalScroll(${input.plane}, ${input.y});`);
  },
};

module.exports = {
  setPlaneScrollEvent,
};
