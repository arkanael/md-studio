/**
 * eventActorStore.js
 * MD Studio - Eventos de Armazenamento de Propriedades do Ator em Variáveis
 *
 * Equivalente GB Studio:
 *   - EVENT_ACTOR_GET_DIRECTION  (Store Actor Direction In Variable)
 *   - EVENT_ACTOR_GET_POSITION   (Store Actor Position In Variables)
 */

'use strict';

// ─── Store Actor Direction In Variable ───────────────────────────────────────

/**
 * Armazena a direção atual do ator em uma variável.
 * Down: 0, Right: 1, Up: 2, Left: 3
 *
 * SGDK: usa SPR_getAnimAttr ou campo interno de direção do ator.
 */
const storeActorDirection = {
  id: 'EVENT_ACTOR_GET_DIRECTION',
  label: 'Store Actor Direction In Variable',
  description: 'Armazena a direção atual do ator em uma variável (Down=0, Right=1, Up=2, Left=3).',
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_VARIABLES'],
  fields: [
    {
      key: 'actorId',
      label: 'Actor',
      type: 'actor',
      defaultValue: '$self$',
      description: 'O ator cuja direção será lida.',
    },
    {
      key: 'variable',
      label: 'Variable',
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
      description: 'Variável onde a direção será armazenada.',
    },
  ],
  compile: (input, helpers) => {
    const { actorSetActive, getActorById, variableSetToScriptValue, appendRaw, _addComment } = helpers;
    const actor = getActorById(input.actorId);
    _addComment('Store Actor Direction In Variable');
    actorSetActive(input.actorId);
    // Lê a direção do ator e armazena na variável
    // SGDK: direção mapeada no campo actor->dir (0=down,1=right,2=up,3=left)
    appendRaw(`
  {\n    // Store actor direction in variable\n    u8 _dir = 0;\n    if (actor_${actor ? actor.id.replace(/-/g, '_') : 'self'}_dir == DIR_DOWN)  _dir = 0;\n    else if (actor_${actor ? actor.id.replace(/-/g, '_') : 'self'}_dir == DIR_RIGHT) _dir = 1;\n    else if (actor_${actor ? actor.id.replace(/-/g, '_') : 'self'}_dir == DIR_UP)    _dir = 2;\n    else if (actor_${actor ? actor.id.replace(/-/g, '_') : 'self'}_dir == DIR_LEFT)  _dir = 3;\n    script_var_${input.variable} = _dir;\n  }`);
  },
};

// ─── Store Actor Position In Variables ───────────────────────────────────────

/**
 * Armazena a posição atual (X e Y) do ator em duas variáveis.
 *
 * SGDK: usa SPR_getPositionX / SPR_getPositionY.
 */
const storeActorPosition = {
  id: 'EVENT_ACTOR_GET_POSITION',
  label: 'Store Actor Position In Variables',
  description: 'Armazena a posição atual do ator em duas variáveis (X e Y).',
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_VARIABLES'],
  fields: [
    {
      key: 'actorId',
      label: 'Actor',
      type: 'actor',
      defaultValue: '$self$',
      description: 'O ator cuja posição será lida.',
    },
    {
      key: 'vectorX',
      label: 'X',
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
      description: 'Variável para armazenar a posição horizontal.',
    },
    {
      key: 'vectorY',
      label: 'Y',
      type: 'variable',
      defaultValue: 'LAST_VARIABLE',
      description: 'Variável para armazenar a posição vertical.',
    },
  ],
  compile: (input, helpers) => {
    const { actorSetActive, getActorById, appendRaw, _addComment } = helpers;
    const actor = getActorById(input.actorId);
    _addComment('Store Actor Position In Variables');
    actorSetActive(input.actorId);
    // Lê posição via SPR_getPositionX/Y e armazena nas variáveis
    appendRaw(`
  {\n    // Store actor position in variables\n    Sprite* _spr = actor_getSprite(${actor ? `actor_${actor.id.replace(/-/g, '_')}` : 'active_actor'});\n    if (_spr) {\n      script_var_${input.vectorX} = SPR_getPositionX(_spr) >> 4;\n      script_var_${input.vectorY} = SPR_getPositionY(_spr) >> 4;\n    }\n  }`);
  },
};

// ─── Set Player Sprite Sheet ──────────────────────────────────────────────────

/**
 * Define o sprite sheet usado para renderizar o jogador.
 *
 * SGDK: usa SPR_setDefinition para o sprite do player.
 */
const setPlayerSprite = {
  id: 'EVENT_PLAYER_SET_SPRITE',
  label: 'Set Player Sprite Sheet',
  description: 'Define o sprite sheet usado para renderizar o jogador.',
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    {
      key: 'spriteSheetId',
      label: 'Sprite Sheet',
      type: 'sprite',
      defaultValue: '',
      description: 'O sprite a usar para renderizar o jogador.',
    },
  ],
  compile: (input, helpers) => {
    const { appendRaw, _addComment } = helpers;
    _addComment('Set Player Sprite Sheet');
    appendRaw(`
  {\n    // Set player sprite sheet\n    extern SpriteDefinition ${input.spriteSheetId}_sprite;\n    SPR_setDefinition(player_sprite, &${input.spriteSheetId}_sprite);\n  }`);
  },
};

module.exports = {
  storeActorDirection,
  storeActorPosition,
  setPlayerSprite,
};
