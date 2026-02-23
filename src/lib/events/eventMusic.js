const l10n = require('../helpers/l10n').default;

// Tocar Trilha Musical (YM2612/SN76489 no Mega Drive)
const playMusicEvent = {
  id: 'EVENT_MUSIC_PLAY',
  groups: ['EVENT_GROUP_MUSIC'],
  name: l10n('EVENT_MUSIC_PLAY'),
  description: l10n('EVENT_MUSIC_PLAY_DESC'),
  fields: [
    {
      key: 'musicId',
      label: l10n('FIELD_MUSIC'),
      description: l10n('FIELD_MUSIC_DESC'),
      type: 'music',
      defaultValue: '',
    },
    {
      key: 'loop',
      label: l10n('FIELD_LOOP'),
      description: l10n('FIELD_LOOP_DESC'),
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Tocar Musica');
    const musicVar = input.musicId || 'music_track_0';
    sgdk.emitLine(`XGM_startPlay(${musicVar});`);
    if (!input.loop) {
      sgdk.emitLine(`XGM_setLoopNumber(0);`);
    }
  },
};

// Parar Musica
const stopMusicEvent = {
  id: 'EVENT_MUSIC_STOP',
  groups: ['EVENT_GROUP_MUSIC'],
  name: l10n('EVENT_MUSIC_STOP'),
  description: l10n('EVENT_MUSIC_STOP_DESC'),
  fields: [],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Parar Musica');
    sgdk.emitLine(`XGM_stopPlay();`);
  },
};

// Tocar Efeito Sonoro (SFX)
const playSoundEffectEvent = {
  id: 'EVENT_SOUND_PLAY_EFFECT',
  groups: ['EVENT_GROUP_MUSIC'],
  name: l10n('EVENT_SOUND_PLAY_EFFECT'),
  description: l10n('EVENT_SOUND_PLAY_EFFECT_DESC'),
  fields: [
    {
      key: 'type',
      label: l10n('FIELD_SOUND_EFFECT'),
      description: l10n('FIELD_SOUND_EFFECT_DESC'),
      type: 'select',
      options: [
        ['beep', l10n('FIELD_SOUND_EFFECT_BEEP')],
        ['crash', l10n('FIELD_SOUND_EFFECT_CRASH')],
        ['explosion', l10n('FIELD_SOUND_EFFECT_EXPLOSION')],
        ['custom', l10n('FIELD_SOUND_EFFECT_CUSTOM')],
      ],
      defaultValue: 'beep',
    },
    {
      key: 'soundId',
      label: l10n('FIELD_SOUND'),
      description: l10n('FIELD_SOUND_DESC'),
      type: 'sound',
      optional: true,
      defaultValue: '',
      conditions: [{ key: 'type', in: ['custom'] }],
    },
    {
      key: 'channel',
      label: l10n('FIELD_CHANNEL'),
      description: l10n('FIELD_CHANNEL_DESC'),
      type: 'number',
      min: 1,
      max: 4,
      defaultValue: 1,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Tocar Efeito Sonoro');
    if (input.type === 'beep') {
      sgdk.emitLine(`PSG_setFrequency(${(input.channel || 1) - 1}, 440);`);
      sgdk.emitLine(`PSG_setEnvelope(${(input.channel || 1) - 1}, PSG_ENVELOPE_FULL);`);
      sgdk.emitLine(`waitMs(100);`);
      sgdk.emitLine(`PSG_setEnvelope(${(input.channel || 1) - 1}, PSG_ENVELOPE_MIN);`);
    } else if (input.type === 'crash') {
      sgdk.emitLine(`PSG_setNoise(NOISE_TYPE_WHITE, NOISE_FREQUENCY_3);`);
      sgdk.emitLine(`PSG_setEnvelope(3, PSG_ENVELOPE_FULL);`);
      sgdk.emitLine(`waitMs(200);`);
      sgdk.emitLine(`PSG_setEnvelope(3, PSG_ENVELOPE_MIN);`);
    } else if (input.type === 'explosion') {
      sgdk.emitLine(`PSG_setNoise(NOISE_TYPE_WHITE, NOISE_FREQUENCY_3);`);
      sgdk.emitLine(`PSG_setEnvelope(3, PSG_ENVELOPE_FULL);`);
      sgdk.emitLine(`waitMs(300);`);
      sgdk.emitLine(`PSG_setEnvelope(3, PSG_ENVELOPE_MIN);`);
    } else if (input.type === 'custom' && input.soundId) {
      sgdk.emitLine(`XGM2_playPCM(${input.soundId}, sizeof(${input.soundId}), SOUND_PCM_CH1);`);
    }
  },
};

// Parar Todos os Efeitos Sonoros
const stopSoundEffectsEvent = {
  id: 'EVENT_SOUND_STOP_ALL',
  groups: ['EVENT_GROUP_MUSIC'],
  name: l10n('EVENT_SOUND_STOP_ALL'),
  description: l10n('EVENT_SOUND_STOP_ALL_DESC'),
  fields: [],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Parar Todos os Sons');
    sgdk.emitLine(`PSG_setEnvelope(0, PSG_ENVELOPE_MIN);`);
    sgdk.emitLine(`PSG_setEnvelope(1, PSG_ENVELOPE_MIN);`);
    sgdk.emitLine(`PSG_setEnvelope(2, PSG_ENVELOPE_MIN);`);
    sgdk.emitLine(`PSG_setEnvelope(3, PSG_ENVELOPE_MIN);`);
  },
};

module.exports = {
  playMusicEvent,
  stopMusicEvent,
  playSoundEffectEvent,
  stopSoundEffectsEvent,
};
