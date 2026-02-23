const l10n = require('../helpers/l10n').default;

const idSave = 'EVENT_GAME_DATA_SAVE';
const idLoad = 'EVENT_GAME_DATA_LOAD';
const idClear = 'EVENT_GAME_DATA_CLEAR';

const groups = ['EVENT_GROUP_SAVE_DATA'];

const gameDataSave = {
  id: idSave,
  name: 'Game Data: Save',
  description: 'Salva o progresso do jogo na SRAM do Mega Drive',
  groups,
  fields: [
    {
      key: 'slot',
      label: 'Save Slot',
      type: 'number',
      min: 0,
      max: 3,
      defaultValue: 0,
    }
  ],
  compile: (input, helpers) => {
    const { sgdk } = helpers;
    sgdk.emitComment(`Salvar dados no slot ${input.slot}`);
    sgdk.emitLine(`SRAM_enable();`);
    sgdk.emitLine(`// Logica de escrita na SRAM`);
    sgdk.emitLine(`SRAM_disable();`);
  }
};

const gameDataLoad = {
  id: idLoad,
  name: 'Game Data: Load',
  description: 'Carrega o progresso do jogo da SRAM',
  groups,
  fields: [
    {
      key: 'slot',
      label: 'Save Slot',
      type: 'number',
      min: 0,
      max: 3,
      defaultValue: 0,
    }
  ],
  compile: (input, helpers) => {
    const { sgdk } = helpers;
    sgdk.emitComment(`Carregar dados do slot ${input.slot}`);
    sgdk.emitLine(`SRAM_enableRO();`);
    sgdk.emitLine(`// Logica de leitura da SRAM`);
    sgdk.emitLine(`SRAM_disable();`);
  }
};

const gameDataClear = {
  id: idClear,
  name: 'Game Data: Clear',
  description: 'Limpa os dados salvos na SRAM',
  groups,
  fields: [
    {
      key: 'slot',
      label: 'Save Slot',
      type: 'number',
      min: 0,
      max: 3,
      defaultValue: 0,
    }
  ],
  compile: (input, helpers) => {
    const { sgdk } = helpers;
    sgdk.emitComment(`Limpar dados do slot ${input.slot}`);
    sgdk.emitLine(`SRAM_enable();`);
    sgdk.emitLine(`// Logica de limpeza da SRAM`);
    sgdk.emitLine(`SRAM_disable();`);
  }
};

module.exports = {
  gameDataSave,
  gameDataLoad,
  gameDataClear
};
