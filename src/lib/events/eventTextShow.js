const id = 'EVENT_TEXT_SHOW';

const fields = [
  {
    key: 'text',
    label: 'Texto',
    type: 'textarea',
    placeholder: 'Digite o texto a ser exibido...',
    defaultValue: '',
    rows: 3,
    maxLength: 256,
  },
  {
    key: 'x',
    label: 'Posicao X',
    type: 'number',
    min: 0,
    max: 39,
    defaultValue: 0,
  },
  {
    key: 'y',
    label: 'Posicao Y',
    type: 'number',
    min: 0,
    max: 27,
    defaultValue: 26,
  },
  {
    key: 'palette',
    label: 'Paleta de cores',
    type: 'select',
    options: [
      ['PAL0', 'Paleta 0'],
      ['PAL1', 'Paleta 1'],
      ['PAL2', 'Paleta 2'],
      ['PAL3', 'Paleta 3'],
    ],
    defaultValue: 'PAL0',
  },
  {
    key: 'waitForInput',
    label: 'Aguardar input do jogador',
    type: 'checkbox',
    defaultValue: true,
  },
];

const compile = (input, helpers) => {
  const { sgdk } = helpers;

  const text = (input.text || '').replace(/"/g, '\\"');
  const x = input.x || 0;
  const y = input.y !== undefined ? input.y : 26;
  const palette = input.palette || 'PAL0';
  const waitForInput = input.waitForInput !== false;

  sgdk.emitLine(`// Evento: Exibir texto`);
  sgdk.emitLine(`VDP_drawText("${text}", ${palette}, ${x}, ${y});`);

  if (waitForInput) {
    sgdk.emitLine(`// Aguardar pressionar botao para continuar`);
    sgdk.emitLine(`while (!(JOY_readJoypad(JOY_1) & (BUTTON_A | BUTTON_B | BUTTON_C | BUTTON_START))) {`);
    sgdk.emitLine(`  SYS_doVBlankProcess();`);
    sgdk.emitLine(`}`);
    sgdk.emitLine(`VDP_clearText(${x}, ${y}, ${text.length});`);
  }
};

module.exports = {
  id,
  description: 'Exibe um texto na tela usando VDP_drawText do SGDK com suporte a paleta e input',
  autoLabel: (fetchArg) => {
    const text = fetchArg('text');
    const preview = text ? (text.length > 20 ? text.substring(0, 20) + '...' : text) : 'Texto vazio';
    return `Exibir: "${preview}"`;
  },
  groups: ['Texto', 'Interface'],
  weight: 1,
  fields,
  compile,
};
