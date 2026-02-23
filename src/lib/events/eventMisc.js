const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: COMMENT
// Equivalente ao "Miscellaneous: Comment" do GB Studio
// Adiciona um comentario no script (sem efeito em jogo)
// ============================================================
const commentEvent = {
  id: 'EVENT_COMMENT',
  groups: ['EVENT_GROUP_MISC'],
  name: l10n('EVENT_COMMENT'),
  description: l10n('EVENT_COMMENT_DESC'),
  updateLabel: true,
  fields: [
    {
      key: 'text',
      label: l10n('FIELD_NOTE'),
      description: l10n('FIELD_NOTE_DESC'),
      type: 'textarea',
      placeholder: 'Text...',
      updateLabel: true,
      defaultValue: '',
    },
  ],
  compile: (input, { sgdk }) => {
    // Comentario e emitido como comentario C no codigo gerado
    const lines = (input.text || '').split('\n');
    if (lines.length === 1) {
      sgdk.emitLine(`// ${lines[0]}`);
    } else {
      sgdk.emitLine(`/*`);
      lines.forEach(line => sgdk.emitLine(` * ${line}`));
      sgdk.emitLine(` */`);
    }
  },
};

// ============================================================
// EVENT: EVENT GROUP
// Equivalente ao "Miscellaneous: Event Group" do GB Studio
// Agrupa eventos para organizacao (sem efeito em jogo)
// ============================================================
const eventGroupEvent = {
  id: 'EVENT_GROUP',
  groups: ['EVENT_GROUP_MISC'],
  name: l10n('EVENT_GROUP'),
  description: l10n('EVENT_GROUP_DESC'),
  fields: [
    {
      key: 'true',
      label: l10n('FIELD_EVENTS'),
      type: 'events',
    },
  ],
  compile: (input, { sgdk, compileEvents }) => {
    // Grupo apenas executa os eventos internos sequencialmente
    compileEvents(input.true);
  },
};

// ============================================================
// EVENT: SCRIPT LOCK
// Equivalente ao "Miscellaneous: Script Lock" do GB Studio
// Pausa outros scripts ate este terminar
// No Mega Drive: desativa interrupcoes temporariamente
// ============================================================
const scriptLockEvent = {
  id: 'EVENT_LOCK',
  groups: ['EVENT_GROUP_MISC'],
  name: l10n('EVENT_LOCK'),
  description: l10n('EVENT_LOCK_DESC'),
  fields: [],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Travar Script - Desativar Interrupcoes');
    sgdk.emitLine(`SYS_disableInts();`);
  },
};

// ============================================================
// EVENT: SCRIPT UNLOCK
// Equivalente ao "Miscellaneous: Script Unlock" do GB Studio
// Reativa outros scripts apos um Script Lock
// ============================================================
const scriptUnlockEvent = {
  id: 'EVENT_UNLOCK',
  groups: ['EVENT_GROUP_MISC'],
  name: l10n('EVENT_UNLOCK'),
  description: l10n('EVENT_UNLOCK_DESC'),
  fields: [],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Destravar Script - Reativar Interrupcoes');
    sgdk.emitLine(`SYS_enableInts();`);
  },
};

// ============================================================
// EVENT: LABEL DEFINE / LABEL GOTO
// Equivalente ao "Miscellaneous: Label Define / Label Goto"
// Define um marcador e salta para ele (goto em C)
// ============================================================
const labelDefineEvent = {
  id: 'EVENT_LABEL_DEFINE',
  groups: ['EVENT_GROUP_MISC'],
  name: l10n('EVENT_LABEL_DEFINE'),
  description: l10n('EVENT_LABEL_DEFINE_DESC'),
  fields: [
    {
      key: 'label',
      label: l10n('FIELD_LABEL'),
      description: l10n('FIELD_LABEL_DESC'),
      type: 'text',
      defaultValue: '',
      placeholder: 'label_name',
    },
  ],
  compile: (input, { sgdk }) => {
    const label = (input.label || 'label').replace(/[^a-zA-Z0-9_]/g, '_');
    sgdk.emitLine(`${label}:`);
    sgdk.emitLine(`;`) // C requer statement apos label
  },
};

const labelGotoEvent = {
  id: 'EVENT_LABEL_GOTO',
  groups: ['EVENT_GROUP_MISC'],
  name: l10n('EVENT_LABEL_GOTO'),
  description: l10n('EVENT_LABEL_GOTO_DESC'),
  fields: [
    {
      key: 'label',
      label: l10n('FIELD_LABEL'),
      description: l10n('FIELD_LABEL_DESC'),
      type: 'text',
      defaultValue: '',
      placeholder: 'label_name',
    },
  ],
  compile: (input, { sgdk }) => {
    const label = (input.label || 'label').replace(/[^a-zA-Z0-9_]/g, '_');
    sgdk.emitComment('Saltar para Label');
    sgdk.emitLine(`goto ${label};`);
  },
};

module.exports = {
  commentEvent,
  eventGroupEvent,
  scriptLockEvent,
  scriptUnlockEvent,
  labelDefineEvent,
  labelGotoEvent,
};
