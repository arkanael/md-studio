const l10n = require("../helpers/l10n").default;

const id = "EVENT_IF_VARIABLE_COMPARE";

const fields = [
  {
    key: "variable",
    type: "variable",
    defaultValue: "LAST_VARIABLE",
  },
  {
    key: "operator",
    type: "operator",
    defaultValue: "==",
  },
  {
    key: "value",
    type: "union",
    types: ["number", "variable"],
    defaultType: "number",
    defaultValue: {
      number: 0,
      variable: "LAST_VARIABLE",
    },
  },
  {
    key: "true",
    type: "events",
  },
  {
    key: "false",
    type: "events",
  },
];

const compile = (input, { sgdk }) => {
  const { variable, operator, value, true: trueEvents, false: falseEvents } = input;
  sgdk.ifVariable(variable, operator, value, trueEvents, falseEvents);
};

const loopEvent = {
  id: "EVENT_LOOP",
  name: l10n("EVENT_LOOP"),
  description: "Repete os eventos dentro do loop infinitamente.",
  fields: [
    {
      key: "true",
      type: "events",
    },
  ],
  compile: (input, { sgdk }) => {
    const { true: trueEvents } = input;
    sgdk.loop(trueEvents);
  },
};

const stopScriptEvent = {
  id: "EVENT_STOP",
  name: l10n("EVENT_STOP"),
  description: "Para a execução do script atual.",
  fields: [
    {
      label: l10n("Stops current script from running."),
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.stop();
  },
};

const switchEvent = {
  id: "EVENT_SWITCH",
  name: l10n("EVENT_SWITCH"),
  description: "Executa diferentes eventos dependendo do valor de uma variável.",
  fields: [
    {
      key: "variable",
      type: "variable",
      defaultValue: "LAST_VARIABLE",
    },
    {
      key: "choices",
      type: "number",
      defaultValue: 2,
      min: 1,
      max: 16,
    },
  ],
  compile: (input, { sgdk }) => {
    const { variable, choices } = input;
    sgdk.switch(variable, choices);
  },
};

const ifButtonHeldEvent = {
  id: "EVENT_IF_BUTTON_HELD",
  name: l10n("EVENT_IF_BUTTON_HELD"),
  description: "Se o botão estiver pressionado, execute os eventos.",
  fields: [
    {
      key: "buttons",
      type: "buttons",
      defaultValue: ["a"],
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
    const { buttons, true: trueEvents, false: falseEvents } = input;
    sgdk.ifButtonHeld(buttons, trueEvents, falseEvents);
  },
};

module.exports = {
  id,
  name: l10n("EVENT_IF_VARIABLE_COMPARE"),
  description: "Se a variável atender à condição, execute os eventos.",
  fields,
  compile,
  loopEvent,
  stopScriptEvent,
  switchEvent,
  ifButtonHeldEvent,
};
