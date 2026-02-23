const l10n = require('../helpers/l10n').default;

const idFadeIn = 'EVENT_SCREEN_FADE_IN';
const idFadeOut = 'EVENT_SCREEN_FADE_OUT';

const groups = ['EVENT_GROUP_SCREEN'];

const screenFadeIn = {
  id: idFadeIn,
  name: 'Fade Screen In',
  description: 'Faz a tela aparecer gradualmente do preto',
  groups,
  fields: [
    {
      key: 'speed',
      label: 'Speed',
      type: 'fadeSpeed',
      defaultValue: 2,
    }
  ],
  compile: (input, helpers) => {
    const { sgdk } = helpers;
    sgdk.emitComment(`Fade In com velocidade ${input.speed}`);
    sgdk.emitLine(`VDP_fadeIn(0, 63, palette_full, ${input.speed} * 10, FALSE);`);
  }
};

const screenFadeOut = {
  id: idFadeOut,
  name: 'Fade Screen Out',
  description: 'Faz a tela desaparecer gradualmente para o preto',
  groups,
  fields: [
    {
      key: 'speed',
      label: 'Speed',
      type: 'fadeSpeed',
      defaultValue: 2,
    }
  ],
  compile: (input, helpers) => {
    const { sgdk } = helpers;
    sgdk.emitComment(`Fade Out com velocidade ${input.speed}`);
    sgdk.emitLine(`VDP_fadeOut(0, 63, ${input.speed} * 10, FALSE);`);
  }
};

module.exports = {
  screenFadeIn,
  screenFadeOut
};
