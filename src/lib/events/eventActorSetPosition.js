const id = 'EVENT_ACTOR_SET_POSITION';

const fields = [
  {
    key: 'actorId',
    label: 'Ator',
    type: 'actor',
    defaultValue: 'player',
  },
  {
    key: 'x',
    label: 'Posicao X',
    type: 'number',
    min: 0,
    max: 255,
    defaultValue: 0,
  },
  {
    key: 'y',
    label: 'Posicao Y',
    type: 'number',
    min: 0,
    max: 255,
    defaultValue: 0,
  },
  {
    key: 'usePixels',
    label: 'Usar pixels (desmarcado = tiles)',
    type: 'checkbox',
    defaultValue: false,
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;

  const actorId = input.actorId || 'player';
  const x = input.x || 0;
  const y = input.y || 0;
  const usePixels = input.usePixels || false;

  // No Mega Drive / SGDK, sprites trabalham em pixels
  // Se tiles: multiplicar por 16 (tamanho de tile padrao)
  const px = usePixels ? x : x * 16;
  const py = usePixels ? y : y * 16;

  const actorVar = actorId === 'player' ? 'player_sprite' : `actor_${actorId}_sprite`;

  sgdk.emitLine(`// Evento: Posicionar ator ${actorId} em (${px}, ${py})`);
  sgdk.emitLine(`SPR_setPosition(${actorVar}, ${px}, ${py});`);
};

module.exports = {
  id,
  description: 'Define a posicao de um ator na cena usando coordenadas em tiles ou pixels',
  autoLabel: (fetchArg) => {
    const actorId = fetchArg('actorId');
    const x = fetchArg('x');
    const y = fetchArg('y');
    return `Posicionar ${actorId || 'ator'} em (${x}, ${y})`;
  },
  groups: ['Atores', 'Posicao'],
  weight: 1,
  fields,
  compile,
};
