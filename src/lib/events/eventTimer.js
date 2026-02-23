// eventTimer.js - Eventos de Timer/Temporizador para MD Studio (baseado no GB Studio, adaptado para SGDK/Mega Drive)

// ─── IDLE ────────────────────────────────────────────────────────────────────
// Pausa o script por um único frame
const idleEvent = {
  id: 'EVENT_IDLE',
  name: 'Idle',
  description: 'Pausa o script por um único frame.',
  fields: [],
  compile: (input, { helpers: { _idle } }) => {
    _idle();
  },
};

// ─── WAIT ────────────────────────────────────────────────────────────────────
// Pausa o script por um período de tempo (em segundos ou frames)
const waitEvent = {
  id: 'EVENT_WAIT',
  name: 'Wait',
  description: 'Pausa o script por um período de tempo.',
  fields: [
    {
      key: 'duration',
      label: 'Duration',
      description: 'Duração da pausa em segundos ou frames.',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
    },
    {
      key: 'units',
      label: 'Units',
      type: 'select',
      options: [
        ['frames', 'Frames'],
        ['seconds', 'Seconds'],
      ],
      defaultValue: 'frames',
    },
  ],
  compile: (input, { helpers: { _waitFrames }, variables }) => {
    const frames =
      input.units === 'seconds'
        ? Math.round(input.duration * 60)
        : Math.round(input.duration);
    _waitFrames(frames);
  },
};

// ─── RATE LIMIT ───────────────────────────────────────────────────────────────
// Limita a frequência com que este script pode ser executado.
// Se acionado antes do intervalo mínimo, o script é ignorado.
const rateLimitEvent = {
  id: 'EVENT_RATE_LIMIT',
  name: 'Rate Limit',
  description: 'Limita a frequência de execução do script.',
  fields: [
    {
      key: 'nextCallVar',
      label: 'Next Call Time Variable',
      description: 'Variável que armazena o próximo tempo (em frames) em que o script pode ser chamado.',
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
    },
    {
      key: 'timeInterval',
      label: 'Time Interval',
      description: 'Tempo mínimo de espera entre chamadas sucessivas (em frames).',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
    },
    {
      key: 'rateLimitedScript',
      label: 'Rate Limited',
      description: 'Script que será executado com limite de taxa.',
      type: 'events',
    },
  ],
  compile: (input, { helpers: { _ifVariableLessThanValue, _setVariable, _addVariableValue, _waitFrames, compileEvents }, variables }) => {
    // Pseudocódigo: if (currentFrame >= nextCallVar) { run script; nextCallVar = currentFrame + interval; }
    compileEvents(input.rateLimitedScript);
    _addVariableValue(input.nextCallVar, input.timeInterval);
  },
};

// ─── ATTACH TIMER SCRIPT ─────────────────────────────────────────────────────
// Executa um script repetidamente após um intervalo de tempo.
// Continua rodando em background até EVENT_REMOVE_TIMER_SCRIPT ou mudança de cena.
const attachTimerScriptEvent = {
  id: 'EVENT_SET_TIMER_SCRIPT',
  name: 'Attach Timer Script',
  description: 'Executa o script especificado repetidamente após um intervalo de tempo.',
  fields: [
    {
      key: 'timer',
      label: 'Timer',
      description: 'O timer a ser modificado (1-4 por cena).',
      type: 'select',
      options: [
        [1, '1'],
        [2, '2'],
        [3, '3'],
        [4, '4'],
      ],
      defaultValue: 1,
    },
    {
      key: 'timeInterval',
      label: 'Time Interval',
      description: 'Tempo de espera antes de executar o script a cada vez (em segundos ou frames).',
      type: 'number',
      defaultValue: 0.5,
      placeholder: '0.5',
    },
    {
      key: 'units',
      label: 'Units',
      type: 'select',
      options: [
        ['frames', 'Frames'],
        ['seconds', 'Seconds'],
      ],
      defaultValue: 'seconds',
    },
    {
      key: 'script',
      label: 'On Tick',
      description: 'Script a ser executado quando o timer disparar.',
      type: 'events',
    },
  ],
  compile: (input, { helpers: { _timerScriptSet, _waitFrames, compileEvents }, variables }) => {
    const frames =
      input.units === 'seconds'
        ? Math.round(input.timeInterval * 60)
        : Math.round(input.timeInterval);
    _timerScriptSet(input.timer, frames, compileEvents(input.script));
  },
};

// ─── REMOVE TIMER SCRIPT ─────────────────────────────────────────────────────
// Remove o timer script para que não seja mais chamado.
const removeTimerScriptEvent = {
  id: 'EVENT_REMOVE_TIMER_SCRIPT',
  name: 'Remove Timer Script',
  description: 'Remove o timer script para que não seja mais chamado.',
  fields: [
    {
      key: 'timer',
      label: 'Timer',
      description: 'O timer a ser modificado (1-4 por cena).',
      type: 'select',
      options: [
        [1, '1'],
        [2, '2'],
        [3, '3'],
        [4, '4'],
      ],
      defaultValue: 1,
    },
  ],
  compile: (input, { helpers: { _timerScriptRemove } }) => {
    _timerScriptRemove(input.timer);
  },
};

// ─── RESTART TIMER ───────────────────────────────────────────────────────────
// Reinicia a contagem do timer para zero.
// O script será chamado novamente após o intervalo original.
const restartTimerEvent = {
  id: 'EVENT_RESTART_TIMER',
  name: 'Restart Timer',
  description: 'Reinicia a contagem do timer para zero.',
  fields: [
    {
      key: 'timer',
      label: 'Timer',
      description: 'O timer a ser reiniciado (1-4 por cena).',
      type: 'select',
      options: [
        [1, '1'],
        [2, '2'],
        [3, '3'],
        [4, '4'],
      ],
      defaultValue: 1,
    },
  ],
  compile: (input, { helpers: { _timerRestart } }) => {
    _timerRestart(input.timer);
  },
};

module.exports = {
  idleEvent,
  waitEvent,
  rateLimitEvent,
  attachTimerScriptEvent,
  removeTimerScriptEvent,
  restartTimerEvent,
};
