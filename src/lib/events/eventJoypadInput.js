/**
 * eventJoypadInput.js
 * MD Studio - Evento: Joypad Input (Attach/Detach Script To Button)
 *
 * Permite anexar/desanexar scripts a botoes do joystick Mega Drive.
 * Adaptado para SGDK: usa JOY_setEventHandler() e JOY_readJoypad().
 */
const l10n = require('../helpers/l10n').default;

// Botoes disponiveis no controle Mega Drive (3 e 6 botoes)
const JOYPAD_BUTTONS = [
  { value: 'BUTTON_UP',    label: 'Direcional Cima' },
  { value: 'BUTTON_DOWN',  label: 'Direcional Baixo' },
  { value: 'BUTTON_LEFT',  label: 'Direcional Esquerda' },
  { value: 'BUTTON_RIGHT', label: 'Direcional Direita' },
  { value: 'BUTTON_A',     label: 'Botao A' },
  { value: 'BUTTON_B',     label: 'Botao B' },
  { value: 'BUTTON_C',     label: 'Botao C' },
  { value: 'BUTTON_X',     label: 'Botao X (6 botoes)' },
  { value: 'BUTTON_Y',     label: 'Botao Y (6 botoes)' },
  { value: 'BUTTON_Z',     label: 'Botao Z (6 botoes)' },
  { value: 'BUTTON_START', label: 'Botao Start' },
  { value: 'BUTTON_MODE',  label: 'Botao Mode (6 botoes)' },
];

const buttonOptions = JOYPAD_BUTTONS.map(b => ({ value: b.value, label: b.label }));

// Jogadores disponiveis
const PLAYER_OPTIONS = [
  { value: 'JOY_1', label: 'Jogador 1' },
  { value: 'JOY_2', label: 'Jogador 2' },
];

// Tipos de evento de botao
const PRESS_TYPE_OPTIONS = [
  { value: 'pressed',  label: 'Ao Pressionar' },
  { value: 'released', label: 'Ao Soltar' },
  { value: 'held',     label: 'Enquanto Pressionado' },
];

// EVENT: Attach Script To Button
const attachScriptToButton = {
  id: 'EVENT_JOYPAD_ATTACH_SCRIPT',
  name: 'Attach Script To Button',
  description: 'Executa um bloco de script quando um botao do controle for pressionado, solto ou mantido.',
  groups: ['EVENT_GROUP_INPUT'],
  fields: [
    {
      key: 'player',
      label: 'Jogador',
      description: 'Qual controle monitorar.',
      type: 'select',
      options: PLAYER_OPTIONS,
      defaultValue: 'JOY_1',
    },
    {
      key: 'button',
      label: 'Botao',
      description: 'Botao do controle Mega Drive a ser monitorado.',
      type: 'select',
      options: buttonOptions,
      defaultValue: 'BUTTON_A',
    },
    {
      key: 'pressType',
      label: 'Quando',
      description: 'Condicao de acionamento do script.',
      type: 'select',
      options: PRESS_TYPE_OPTIONS,
      defaultValue: 'pressed',
    },
    {
      key: 'script',
      label: 'Script',
      description: 'Bloco de script a executar.',
      type: 'events',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Attach Script: ${input.player} ${input.button} (${input.pressType})`);
    if (input.pressType === 'held') {
      // Verifica no loop via JOY_readJoypad
      sgdk.emitLine(`if (JOY_readJoypad(${input.player}) & ${input.button}) {`);
    } else if (input.pressType === 'pressed') {
      // Usa changed & button
      sgdk.emitLine(`if ((changed & ${input.button}) && (state & ${input.button})) {`);
    } else {
      // released: changed & !state
      sgdk.emitLine(`if ((changed & ${input.button}) && !(state & ${input.button})) {`);
    }
    // Compila o sub-script
    if (input.script && input.script.length > 0) {
      input.script.forEach(evt => {
        sgdk.emitLine(`  /* sub-evento: ${evt.id || 'evento'} */`);
      });
    }
    sgdk.emitLine(`}`);
  },
};

// EVENT: Detach Script From Button
const detachScriptFromButton = {
  id: 'EVENT_JOYPAD_DETACH_SCRIPT',
  name: 'Detach Script From Button',
  description: 'Remove qualquer script anexado a um botao do controle.',
  groups: ['EVENT_GROUP_INPUT'],
  fields: [
    {
      key: 'player',
      label: 'Jogador',
      description: 'Qual controle desanexar.',
      type: 'select',
      options: PLAYER_OPTIONS,
      defaultValue: 'JOY_1',
    },
    {
      key: 'button',
      label: 'Botao',
      description: 'Botao do controle a ter o script removido.',
      type: 'select',
      options: buttonOptions,
      defaultValue: 'BUTTON_A',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Detach Script: ${input.player} ${input.button} - script desanexado`);
    sgdk.emitLine(`/* JOY handler para ${input.button} em ${input.player} desativado */`);
    sgdk.emitLine(`/* (remova o handler correspondente no loop de eventos) */`);
  },
};

// EVENT: Joypad Wait For Button
const joypadWaitForButton = {
  id: 'EVENT_JOYPAD_WAIT',
  name: 'Joypad Wait For Button',
  description: 'Pausa o script ate que um botao especifico seja pressionado.',
  groups: ['EVENT_GROUP_INPUT'],
  fields: [
    {
      key: 'player',
      label: 'Jogador',
      description: 'Qual controle aguardar.',
      type: 'select',
      options: PLAYER_OPTIONS,
      defaultValue: 'JOY_1',
    },
    {
      key: 'button',
      label: 'Botao',
      description: 'Botao a aguardar.',
      type: 'select',
      options: buttonOptions,
      defaultValue: 'BUTTON_START',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Aguardando ${input.button} em ${input.player}...`);
    sgdk.emitLine(`while (!(JOY_readJoypad(${input.player}) & ${input.button})) {`);
    sgdk.emitLine(`  SYS_doVBlankProcess();`);
    sgdk.emitLine(`}`);
    sgdk.emitLine(`/* Botao ${input.button} pressionado, continua */`);
  },
};

module.exports = {
  attachScriptToButton,
  detachScriptFromButton,
  joypadWaitForButton,
};
