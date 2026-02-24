/**
 * eventEngineFields.js
 * MD Studio - Evento: Engine Field Update / Store
 *
 * Permite modificar e armazenar campos internos do engine SGDK.
 * Adaptado para Mega Drive: usa defines e variaveis globais do engine.
 */
const l10n = require('../helpers/l10n').default;

// Campos do engine SGDK disponiveis para configuracao
const ENGINE_FIELDS = [
  { value: 'gravity',         label: 'Gravidade (gravity)' },
  { value: 'playerSpeed',     label: 'Velocidade do Jogador (playerSpeed)' },
  { value: 'jumpForce',       label: 'Forca de Pulo (jumpForce)' },
  { value: 'scrollSpeedX',    label: 'Scroll Horizontal (scrollSpeedX)' },
  { value: 'scrollSpeedY',    label: 'Scroll Vertical (scrollSpeedY)' },
  { value: 'spriteLimit',     label: 'Limite de Sprites (spriteLimit)' },
  { value: 'collisionMask',   label: 'Mascara de Colisao (collisionMask)' },
  { value: 'frameRate',       label: 'Frame Rate Alvo (frameRate)' },
];

const fieldOptions = ENGINE_FIELDS.map(f => ({ value: f.value, label: f.label }));

// EVENT: Engine Field Update — altera o valor de um campo do engine
const engineFieldUpdate = {
  id: 'EVENT_ENGINE_FIELD_UPDATE',
  name: 'Engine Field Update',
  description: 'Atualiza o valor de um campo interno do engine SGDK (variavel global do sistema).',
  groups: ['EVENT_GROUP_ENGINE'],
  fields: [
    {
      key: 'fieldName',
      label: 'Campo do Engine',
      description: 'O parametro interno do engine a ser modificado.',
      type: 'select',
      options: fieldOptions,
      defaultValue: 'gravity',
    },
    {
      key: 'value',
      label: 'Novo Valor',
      description: 'Valor numerico a ser atribuido ao campo.',
      type: 'number',
      defaultValue: 0,
      min: -32768,
      max: 32767,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Engine Field Update: ${input.fieldName} = ${input.value}`);
    // Emite atribuicao de variavel global do engine
    sgdk.emitLine(`engine_${input.fieldName} = ${input.value};`);
  },
};

// EVENT: Engine Field Store — armazena o valor atual de um campo em uma variavel
const engineFieldStore = {
  id: 'EVENT_ENGINE_FIELD_STORE',
  name: 'Engine Field Store',
  description: 'Armazena o valor atual de um campo do engine em uma variavel do script.',
  groups: ['EVENT_GROUP_ENGINE'],
  fields: [
    {
      key: 'fieldName',
      label: 'Campo do Engine',
      description: 'O campo do engine cujo valor sera lido.',
      type: 'select',
      options: fieldOptions,
      defaultValue: 'gravity',
    },
    {
      key: 'variable',
      label: 'Variavel de Destino',
      description: 'Variavel que recebera o valor atual do campo.',
      type: 'variable',
      defaultValue: 'VARIABLE_0',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Engine Field Store: ${input.variable} = engine_${input.fieldName}`);
    sgdk.emitLine(`${input.variable} = engine_${input.fieldName};`);
  },
};

// EVENT: Engine Field Reset — restaura o campo para o valor padrao
const engineFieldReset = {
  id: 'EVENT_ENGINE_FIELD_RESET',
  name: 'Engine Field Reset',
  description: 'Restaura um campo do engine para o seu valor padrao de inicializacao.',
  groups: ['EVENT_GROUP_ENGINE'],
  fields: [
    {
      key: 'fieldName',
      label: 'Campo do Engine',
      description: 'O campo do engine a ser restaurado.',
      type: 'select',
      options: fieldOptions,
      defaultValue: 'gravity',
    },
  ],
  compile: (input, { sgdk }) => {
    // Mapa de valores padrao dos campos SGDK
    const defaults = {
      gravity:       2,
      playerSpeed:   2,
      jumpForce:     4,
      scrollSpeedX:  0,
      scrollSpeedY:  0,
      spriteLimit:   20,
      collisionMask: 0xFF,
      frameRate:     60,
    };
    const def = defaults[input.fieldName] !== undefined ? defaults[input.fieldName] : 0;
    sgdk.emitComment(`Engine Field Reset: ${input.fieldName} -> ${def} (padrao)`);
    sgdk.emitLine(`engine_${input.fieldName} = ${def}; /* reset para padrao */`);
  },
};

module.exports = {
  engineFieldUpdate,
  engineFieldStore,
  engineFieldReset,
};
