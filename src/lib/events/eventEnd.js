const id = 'EVENT_END';

const fields = [
  {
    key: 'mode',
    label: 'Modo de encerramento',
    type: 'select',
    options: [
      ['stop', 'Parar execucao do script'],
      ['reset', 'Resetar o jogo'],
      ['credits', 'Ir para tela de creditos'],
    ],
    defaultValue: 'stop',
  },
  {
    key: 'creditsSceneId',
    label: 'Cena de creditos',
    type: 'scene',
    defaultValue: '',
    conditions: [{ key: 'mode', eq: 'credits' }],
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;

  const mode = input.mode || 'stop';

  if (mode === 'stop') {
    sgdk.emitLine(`// Fim do script - parar execucao`);
    sgdk.emitLine(`return; // encerrar funcao atual`);
  } else if (mode === 'reset') {
    sgdk.emitLine(`// Resetar o jogo`);
    sgdk.emitLine(`SYS_reset(); // reiniciar o sistema`);
  } else if (mode === 'credits') {
    const sceneId = input.creditsSceneId || 'SCENE_CREDITS';
    sgdk.emitLine(`// Ir para tela de creditos`);
    sgdk.emitLine(`MD_fadeOut(2);`);
    sgdk.emitLine(`MD_sceneSwitch(SCENE_${sceneId.toUpperCase()}, 0, 0, DIR_DOWN);`);
    sgdk.emitLine(`MD_fadeIn(2);`);
  }
};

module.exports = {
  id,
  description: 'Encerra a execucao do script atual, reseta o jogo ou navega para tela de creditos',
  autoLabel: (fetchArg) => {
    const mode = fetchArg('mode');
    if (mode === 'reset') return 'Resetar jogo';
    if (mode === 'credits') return 'Ir para creditos';
    return 'Fim do script';
  },
  groups: ['Controle', 'Jogo'],
  weight: 0.5,
  fields,
  compile,
  isTerminal: true, // indica que este evento encerra o fluxo
};
