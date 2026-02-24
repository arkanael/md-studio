/**
 * eventVariableExtended.js
 * MD Studio - Eventos estendidos de Variáveis (Math, Flags, Engine Fields, etc)
 */

const l10n = require('../helpers/l10n');

// --- Variable Set To True/False ---
const setVariableTrue = {
  id: 'EVENT_SET_VARIABLE_TRUE',
  name: l10n('EVENT_SET_VARIABLE_TRUE'),
  groups: ['EVENT_GROUP_VARIABLES'],
  fields: [{ key: 'variable', type: 'variable', label: l10n('FIELD_VARIABLE'), defaultValue: 'LAST_VARIABLE' }],
  compile: (params, helpers) => {
    helpers.writeRaw(`var_${params.variable} = 1;`);
  }
};

const setVariableFalse = {
  id: 'EVENT_SET_VARIABLE_FALSE',
  name: l10n('EVENT_SET_VARIABLE_FALSE'),
  groups: ['EVENT_GROUP_VARIABLES'],
  fields: [{ key: 'variable', type: 'variable', label: l10n('FIELD_VARIABLE'), defaultValue: 'LAST_VARIABLE' }],
  compile: (params, helpers) => {
    helpers.writeRaw(`var_${params.variable} = 0;`);
  }
};

// --- Variable Increment/Decrement By 1 ---
const variableInc = {
  id: 'EVENT_VARIABLE_INC',
  name: l10n('EVENT_VARIABLE_INC'),
  groups: ['EVENT_GROUP_VARIABLES'],
  fields: [{ key: 'variable', type: 'variable', label: l10n('FIELD_VARIABLE'), defaultValue: 'LAST_VARIABLE' }],
  compile: (params, helpers) => {
    helpers.writeRaw(`var_${params.variable}++;`);
  }
};

const variableDec = {
  id: 'EVENT_VARIABLE_DEC',
  name: l10n('EVENT_VARIABLE_DEC'),
  groups: ['EVENT_GROUP_VARIABLES'],
  fields: [{ key: 'variable', type: 'variable', label: l10n('FIELD_VARIABLE'), defaultValue: 'LAST_VARIABLE' }],
  compile: (params, helpers) => {
    helpers.writeRaw(`var_${params.variable}--;`);
  }
};

// --- Store Engine Field In Variable ---
const storeEngineField = {
  id: 'EVENT_STORE_ENGINE_FIELD',
  name: l10n('EVENT_STORE_ENGINE_FIELD'),
  groups: ['EVENT_GROUP_VARIABLES', 'EVENT_GROUP_ENGINE_FIELDS'],
  fields: [
    { key: 'engineField', type: 'engineField', label: l10n('FIELD_ENGINE_FIELD'), defaultValue: 'jump_vel' },
    { key: 'variable', type: 'variable', label: l10n('FIELD_VARIABLE'), defaultValue: 'LAST_VARIABLE' }
  ],
  compile: (params, helpers) => {
    helpers.writeRaw(`var_${params.variable} = engine_fields.${params.engineField};`);
  }
};

// --- Variable Flags (Set, Add, Clear) ---
const variableFlagsSet = {
  id: 'EVENT_VARIABLE_FLAGS_SET',
  name: l10n('EVENT_VARIABLE_FLAGS_SET'),
  groups: ['EVENT_GROUP_VARIABLES'],
  fields: [
    { key: 'variable', type: 'variable', label: l10n('FIELD_VARIABLE'), defaultValue: 'LAST_VARIABLE' },
    { key: 'flag1', type: 'checkbox', label: 'Flag 1', defaultValue: false },
    { key: 'flag2', type: 'checkbox', label: 'Flag 2', defaultValue: false }
  ],
  compile: (params, helpers) => {
    let val = 0;
    if (params.flag1) val |= 1;
    if (params.flag2) val |= 2;
    helpers.writeRaw(`var_${params.variable} = ${val};`);
  }
};

// --- Evaluate Math Expression ---
const evaluateMathExpression = {
  id: 'EVENT_EVALUATE_MATH',
  name: l10n('EVENT_EVALUATE_MATH'),
  groups: ['EVENT_GROUP_VARIABLES', 'EVENT_GROUP_MATH'],
  fields: [
    { key: 'variable', type: 'variable', label: l10n('FIELD_VARIABLE'), defaultValue: 'LAST_VARIABLE' },
    { key: 'expression', type: 'text', label: l10n('FIELD_EXPRESSION'), defaultValue: '' }
  ],
  compile: (params, helpers) => {
    helpers.writeRaw(`var_${params.variable} = ${params.expression};`);
  }
};

// --- Seed Random Number Generator ---
const seedRNG = {
  id: 'EVENT_SEED_RNG',
  name: l10n('EVENT_SEED_RNG'),
  groups: ['EVENT_GROUP_VARIABLES', 'EVENT_GROUP_MATH'],
  compile: (params, helpers) => {
    helpers.writeRaw(`randomize();`);
  }
};

// --- Reset All Variables ---
const resetAllVariables = {
  id: 'EVENT_RESET_VARIABLES',
  name: l10n('EVENT_RESET_VARIABLES'),
  groups: ['EVENT_GROUP_VARIABLES'],
  compile: (params, helpers) => {
    helpers.writeRaw(`memset(script_variables, 0, sizeof(script_variables));`);
  }
};

module.exports = {
  setVariableTrue,
  setVariableFalse,
  variableInc,
  variableDec,
  storeEngineField,
  variableFlagsSet,
  evaluateMathExpression,
  seedRNG,
  resetAllVariables
};
