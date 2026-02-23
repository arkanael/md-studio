const id = 'EVENT_ACTOR_SET_DIRECTION';

const fields = [
  {
    key: 'actorId',
    label: 'Ator',
    type: 'actor',
    defaultValue: 'player',
  },
  {
    key: 'direction',
    label: 'Direcao',
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
    key: 'animIndex',
    label: 'Indice de animacao para direcao',
    type: 'number',
    min: 0,
    max: 15,
    defaultValue: 0,
    description: 'Indice da animacao no sprite sheet correspondente a direcao',
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;

  const actorId = input.actorId || 'player';
  const direction = input.direction || 'down';
  const animIndex = input.animIndex || 0;

  const actorVar = actorId === 'player' ? 'player_sprite' : `actor_${actorId}_sprite`;

  const dirCommentMap = {
    down: 'baixo',
    up: 'cima',
    left: 'esquerda',
    right: 'direita',
  };

  const dirComment = dirCommentMap[direction] || direction;

  sgdk.emitLine(`// Evento: Definir direcao do ator ${actorId} para ${dirComment}`);
  sgdk.emitLine(`SPR_setAnim(${actorVar}, ${animIndex}); // animacao: ${dirComment}`);
};

module.exports = {
  id,
  description: 'Define a direcao e animacao de um ator usando SPR_setAnim do SGDK',
  autoLabel: (fetchArg) => {
    const actorId = fetchArg('actorId');
    const direction = fetchArg('direction');
    const dirLabels = { down: 'Baixo', up: 'Cima', left: 'Esquerda', right: 'Direita' };
    return `${actorId || 'Ator'} olhar para ${dirLabels[direction] || direction}`;
  },
  groups: ['Atores', 'Animacao'],
  weight: 1,
  fields,
  compile,
};
