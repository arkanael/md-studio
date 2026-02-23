/**
 * eventWait.js
 * MD Studio - Evento: Aguardar X frames
 * Gera: loop de SYS_doVBlankProcess() para o SGDK
 */

const l10n = require('../helpers/l10n').default;

const id = 'EVENT_WAIT';
const groups = ['EVENT_GROUP_CONTROL_FLOW'];
const weight = 1;

const autoLabel = (fetchArg) =>
  l10n('EVENT_WAIT_LABEL', { frames: fetchArg('frames') });

const fields = [
  {
    key: 'frames',
    label: 'Frames para aguardar',
    description:
      'Numero de frames a aguardar (Mega Drive roda a ~60fps NTSC / ~50fps PAL). Ex: 60 = ~1 segundo.',
    type: 'value',
    min: 1,
    max: 9999,
    defaultValue: { type: 'number', value: 30 },
  },
];

/**
 * compile()
 * Gera um loop que chama SYS_doVBlankProcess() N vezes.
 * Cada chamada aguarda 1 frame (sincronizado com VBlank do hardware).
 */
const compile = (input, helpers) => {
  const { sgdk } = helpers;
  const frames = input.frames?.value ?? input.frames ?? 30;

  sgdk.emitComment(`Aguardar ${frames} frame(s) (~${(frames / 60).toFixed(2)}s a 60fps)`);
  sgdk.emitLine(`{`);
  sgdk.emitLine(`    u16 _w = ${frames};`);
  sgdk.emitLine(`    while (_w--) SYS_doVBlankProcess();`);
  sgdk.emitLine(`}`);
};

module.exports = { id, description: 'Pausa a execucao por N frames', autoLabel, groups, weight, fields, compile };
