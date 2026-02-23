/**
 * eventInputCheck.js
 * MD Studio - Evento: Verificar Input do Jogador
 * Gera: if (joy & BUTTON_X) { ... } para o SGDK
 *
 * Mega Drive suporta controles de 3 e 6 botoes:
 * 3 botoes: A, B, C, Start, Up, Down, Left, Right
 * 6 botoes: A, B, C, X, Y, Z, Start, Mode, Up, Down, Left, Right
 */

const l10n = require('../helpers/l10n').default;

const id = 'EVENT_INPUT_CHECK';
const groups = ['EVENT_GROUP_INPUT'];
const weight = 1;

// Mapa de botoes do Mega Drive -> constante SGDK
const MD_BUTTONS = [
  { value: 'up',    label: 'Cima',         sgdk: 'BUTTON_UP'    },
  { value: 'down',  label: 'Baixo',        sgdk: 'BUTTON_DOWN'  },
  { value: 'left',  label: 'Esquerda',     sgdk: 'BUTTON_LEFT'  },
  { value: 'right', label: 'Direita',      sgdk: 'BUTTON_RIGHT' },
  { value: 'a',     label: 'Botao A',      sgdk: 'BUTTON_A'     },
  { value: 'b',     label: 'Botao B',      sgdk: 'BUTTON_B'     },
  { value: 'c',     label: 'Botao C',      sgdk: 'BUTTON_C'     },
  { value: 'x',     label: 'Botao X (6B)', sgdk: 'BUTTON_X'     },
  { value: 'y',     label: 'Botao Y (6B)', sgdk: 'BUTTON_Y'     },
  { value: 'z',     label: 'Botao Z (6B)', sgdk: 'BUTTON_Z'     },
  { value: 'start', label: 'Start',        sgdk: 'BUTTON_START' },
  { value: 'mode',  label: 'Mode (6B)',    sgdk: 'BUTTON_MODE'  },
];

const autoLabel = (fetchArg) => {
  const btn = MD_BUTTONS.find(b => b.value === fetchArg('button'));
  return `Se ${btn?.label || fetchArg('button')} pressionado`;
};

const fields = [
  {
    key: 'button',
    label: 'Botao',
    description: 'Botao do controle Mega Drive a verificar. Botoes X, Y, Z e Mode requerem controle de 6 botoes.',
    type: 'select',
    options: MD_BUTTONS.map(b => [b.value, b.label]),
    defaultValue: 'right',
  },
  {
    key: 'player',
    label: 'Jogador',
    description: 'Qual controle verificar (1 ou 2)',
    type: 'select',
    options: [['1', 'Jogador 1'], ['2', 'Jogador 2']],
    defaultValue: '1',
  },
  {
    key: 'true',
    label: 'Se pressionado',
    description: 'Eventos executados quando o botao esta pressionado',
    type: 'events',
  },
  {
    key: 'false',
    label: 'Caso contrario',
    description: 'Eventos executados quando o botao NAO esta pressionado',
    type: 'events',
    optional: true,
  },
];

/**
 * compile()
 * Gera:
 *   u16 joy = JOY_readJoypad(JOY_1);
 *   if (joy & BUTTON_RIGHT) { ... } else { ... }
 */
const compile = (input, helpers) => {
  const { sgdk, compileEvents } = helpers;

  const btn = MD_BUTTONS.find(b => b.value === input.button);
  const sgdkBtn = btn?.sgdk || 'BUTTON_A';
  const joyPort = input.player === '2' ? 'JOY_2' : 'JOY_1';

  sgdk.emitComment(`Verificar input: ${btn?.label || input.button} (Jogador ${input.player || 1})`);
  sgdk.emitLine(`{`);
  sgdk.emitLine(`    u16 _joy = JOY_readJoypad(${joyPort});`);
  sgdk.emitLine(`    if (_joy & ${sgdkBtn}) {`);

  if (input.true?.length) {
    sgdk.emitLine(`        // Botao pressionado`);
    compileEvents(input.true);
  }

  if (input.false?.length) {
    sgdk.emitLine(`    } else {`);
    sgdk.emitLine(`        // Botao nao pressionado`);
    compileEvents(input.false);
  }

  sgdk.emitLine(`    }`);
  sgdk.emitLine(`}`);
};

module.exports = {
  id,
  description: 'Verifica se um botao do controle Mega Drive esta pressionado',
  autoLabel,
  groups,
  weight,
  fields,
  compile,
};
