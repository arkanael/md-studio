const id = 'EVENT_SCENE_SWITCH';

const fields = [
  {
    key: 'sceneId',
    label: 'Cena de destino',
    type: 'scene',
    defaultValue: '',
  },
  {
    key: 'x',
    label: 'Posicao X inicial',
    type: 'number',
    min: 0,
    max: 255,
    defaultValue: 0,
  },
  {
    key: 'y',
    label: 'Posicao Y inicial',
    type: 'number',
    min: 0,
    max: 255,
    defaultValue: 0,
  },
  {
    key: 'direction',
    label: 'Direcao inicial',
    type: 'select',
    options: [
      ['down', 'Baixo'],
      ['up', 'Cima'],
      ['left', 'Esquerda'],
      ['right', 'Direita'],
    ],
    defaultValue: 'down',
  },
  {
    key: 'fadeSpeed',
    label: 'Velocidade do fade',
    type: 'select',
    options: [
      ['0', 'Instantaneo'],
      ['1', 'Muito rapido'],
      ['2', 'Rapido'],
      ['3', 'Normal'],
      ['4', 'Lento'],
      ['5', 'Muito lento'],
    ],
    defaultValue: '2',
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;

  const sceneId = input.sceneId || 'SCENE_UNKNOWN';
  const x = input.x || 0;
  const y = input.y || 0;
  const dir = input.direction || 'down';
  const fadeSpeed = input.fadeSpeed || '2';

  const dirMap = {
    down: 'DIR_DOWN',
    up: 'DIR_UP',
    left: 'DIR_LEFT',
    right: 'DIR_RIGHT',
  };

  const cDir = dirMap[dir] || 'DIR_DOWN';

  sgdk.emitLine(`// Evento: Trocar de cena para ${sceneId}`);
  sgdk.emitLine(`MD_fadeOut(${fadeSpeed});`);
  sgdk.emitLine(`MD_sceneSwitch(SCENE_${sceneId.toUpperCase()}, ${x}, ${y}, ${cDir});`);
  sgdk.emitLine(`MD_fadeIn(${fadeSpeed});`);
};

module.exports = {
  id,
  description: 'Troca a cena atual para outra cena do jogo com efeito de fade',
  autoLabel: (fetchArg) => {
    const sceneId = fetchArg('sceneId');
    return `Ir para cena: ${sceneId || 'desconhecida'}`;
  },
  groups: ['Cenas', 'Navegacao'],
  weight: 2,
  fields,
  compile,
};
