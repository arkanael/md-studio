const l10n = require("../helpers/l10n").default;

const id = "EVENT_SAVE_DATA";

const fields = [
  {
    key: "slot",
    type: "select",
    options: [
      [0, l10n("SLOT_1")],
      [1, l10n("SLOT_2")],
      [2, l10n("SLOT_3")],
    ],
    defaultValue: 0,
  },
  {
    key: "true",
    type: "events",
    label: l10n("ON_SAVE"),
  },
];

const compile = (input, { sgdk }) => {
  const { slot, true: trueEvents } = input;
  sgdk.emitComment(`Salvar dados no slot ${slot}`);
  sgdk.emitLine(`SRAM_enable();`);
  sgdk.saveData(slot); // Abstração para salvar variáveis
  if (trueEvents) {
    sgdk.compileEvents(trueEvents);
  }
  sgdk.emitLine(`SRAM_disable();`);
};

const loadDataEvent = {
  id: "EVENT_LOAD_DATA",
  name: l10n("EVENT_LOAD_DATA"),
  description: "Carrega os dados salvos de um slot.",
  fields: [
    {
      key: "slot",
      type: "select",
      options: [
        [0, l10n("SLOT_1")],
        [1, l10n("SLOT_2")],
        [2, l10n("SLOT_3")],
      ],
      defaultValue: 0,
    },
  ],
  compile: (input, { sgdk }) => {
    const { slot } = input;
    sgdk.emitComment(`Carregar dados do slot ${slot}`);
    sgdk.emitLine(`SRAM_enableRO();`);
    sgdk.loadData(slot);
    sgdk.emitLine(`SRAM_disable();`);
  },
};

const removeDataEvent = {
  id: "EVENT_REMOVE_DATA",
  name: l10n("EVENT_REMOVE_DATA"),
  description: "Remove os dados salvos de um slot.",
  fields: [
    {
      key: "slot",
      type: "select",
      options: [
        [0, l10n("SLOT_1")],
        [1, l10n("SLOT_2")],
        [2, l10n("SLOT_3")],
      ],
      defaultValue: 0,
    },
  ],
  compile: (input, { sgdk }) => {
    const { slot } = input;
    sgdk.emitComment(`Remover dados do slot ${slot}`);
    sgdk.emitLine(`SRAM_enable();`);
    sgdk.clearData(slot);
    sgdk.emitLine(`SRAM_disable();`);
  },
};

const ifDataSavedEvent = {
  id: "EVENT_IF_DATA_SAVED",
  name: l10n("EVENT_IF_DATA_SAVED"),
  description: "Se houver dados salvos no slot, execute os eventos.",
  fields: [
    {
      key: "slot",
      type: "select",
      options: [
        [0, l10n("SLOT_1")],
        [1, l10n("SLOT_2")],
        [2, l10n("SLOT_3")],
      ],
      defaultValue: 0,
    },
    {
      key: "true",
      type: "events",
    },
    {
      key: "false",
      type: "events",
    },
  ],
  compile: (input, { sgdk }) => {
    const { slot, true: trueEvents, false: falseEvents } = input;
    sgdk.ifDataSaved(slot, trueEvents, falseEvents);
  },
};

module.exports = {
  id,
  name: l10n("EVENT_SAVE_DATA"),
  description: "Salva o estado atual do jogo.",
  fields,
  compile,
  loadDataEvent,
  removeDataEvent,
  ifDataSavedEvent,
};
