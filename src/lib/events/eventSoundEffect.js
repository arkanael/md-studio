const id = 'EVENT_SOUND_EFFECT';

const fields = [
  {
    key: 'type',
    label: 'Tipo de som',
    type: 'select',
    options: [
      ['sfx', 'Efeito sonoro (SFX)'],
      ['music', 'Musica de fundo (BGM)'],
      ['stop_music', 'Parar musica'],
    ],
    defaultValue: 'sfx',
  },
  {
    key: 'soundId',
    label: 'ID do som',
    type: 'text',
    placeholder: 'ex: SFX_JUMP, BGM_LEVEL1',
    defaultValue: '',
  },
  {
    key: 'channel',
    label: 'Canal (apenas SFX)',
    type: 'select',
    options: [
      ['SOUND_PCM', 'PCM'],
      ['SOUND_FM', 'FM'],
      ['SOUND_PSG', 'PSG'],
    ],
    defaultValue: 'SOUND_PCM',
  },
  {
    key: 'priority',
    label: 'Prioridade',
    type: 'number',
    min: 0,
    max: 15,
    defaultValue: 5,
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;

  const type = input.type || 'sfx';
  const soundId = input.soundId || 'SFX_UNKNOWN';
  const channel = input.channel || 'SOUND_PCM';
  const priority = input.priority !== undefined ? input.priority : 5;

  if (type === 'sfx') {
    sgdk.emitLine(`// Evento: Tocar efeito sonoro ${soundId}`);
    sgdk.emitLine(`SND_startPlay_PCM(${soundId}, ${priority}, ${channel}, NULL, FALSE);`);
  } else if (type === 'music') {
    sgdk.emitLine(`// Evento: Tocar musica de fundo ${soundId}`);
    sgdk.emitLine(`XGM_startPlay(${soundId});`);
  } else if (type === 'stop_music') {
    sgdk.emitLine(`// Evento: Parar musica de fundo`);
    sgdk.emitLine(`XGM_stopPlay();`);
  }
};

module.exports = {
  id,
  description: 'Toca um efeito sonoro (SFX) ou musica de fundo (BGM) usando o sistema de audio do SGDK',
  autoLabel: (fetchArg) => {
    const type = fetchArg('type');
    const soundId = fetchArg('soundId');
    if (type === 'stop_music') return 'Parar musica';
    return `${type === 'music' ? 'BGM' : 'SFX'}: ${soundId || 'desconhecido'}`;
  },
  groups: ['Audio', 'Som'],
  weight: 1,
  fields,
  compile,
};
