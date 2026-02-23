const l10n = require('../helpers/l10n').default;

// Trocar Cena
const changeSceneEvent = {
  id: 'EVENT_SWITCH_SCENE',
  groups: ['EVENT_GROUP_SCENE'],
  name: l10n('EVENT_SWITCH_SCENE'),
  description: l10n('EVENT_SWITCH_SCENE_DESC'),
  fields: [
    {
      key: 'sceneId',
      label: l10n('FIELD_SCENE'),
      description: l10n('FIELD_SCENE_DESC'),
      type: 'scene',
      defaultValue: '',
    },
    {
      key: 'x',
      label: l10n('FIELD_X'),
      description: l10n('FIELD_X_DESC'),
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'y',
      label: l10n('FIELD_Y'),
      description: l10n('FIELD_Y_DESC'),
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'direction',
      label: l10n('FIELD_DIRECTION'),
      description: l10n('FIELD_DIRECTION_DESC'),
      type: 'direction',
      defaultValue: 'none',
    },
    {
      key: 'fadeSpeed',
      label: l10n('FIELD_FADE_SPEED'),
      description: l10n('FIELD_FADE_SPEED_DESC'),
      type: 'fadeSpeed',
      defaultValue: 2,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Trocar Cena');
    const fadeSpeed = input.fadeSpeed || 2;
    sgdk.emitLine(`// Fade out`);
    sgdk.emitLine(`for (int f = 7; f >= 0; f--) {`);
    sgdk.emitLine(`  PAL_setContrast(f * ${fadeSpeed});`);
    sgdk.emitLine(`  SYS_doVBlankProcess();`);
    sgdk.emitLine(`}`);
    sgdk.emitLine(`VDP_clearPlane(BG_A, TRUE);`);
    sgdk.emitLine(`VDP_clearPlane(BG_B, TRUE);`);
    sgdk.emitLine(`// Carregar cena: ${input.sceneId || 'scene_0'}`);
    sgdk.emitLine(`current_scene = ${input.sceneId || 0};`);
    sgdk.emitLine(`player_x = ${(input.x || 0) * 8};`);
    sgdk.emitLine(`player_y = ${(input.y || 0) * 8};`);
    sgdk.emitLine(`scene_init(current_scene);`);
    sgdk.emitLine(`// Fade in`);
    sgdk.emitLine(`for (int f = 0; f <= 7; f++) {`);
    sgdk.emitLine(`  PAL_setContrast(f * ${fadeSpeed});`);
    sgdk.emitLine(`  SYS_doVBlankProcess();`);
    sgdk.emitLine(`}`);
  },
};

// Empilhar Cena (Push to Scene Stack)
const pushSceneEvent = {
  id: 'EVENT_PUSH_SCENE',
  groups: ['EVENT_GROUP_SCENE'],
  name: l10n('EVENT_PUSH_SCENE'),
  description: l10n('EVENT_PUSH_SCENE_DESC'),
  fields: [
    {
      key: 'sceneId',
      label: l10n('FIELD_SCENE'),
      type: 'scene',
      defaultValue: '',
    },
    {
      key: 'x',
      label: l10n('FIELD_X'),
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'y',
      label: l10n('FIELD_Y'),
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'fadeSpeed',
      label: l10n('FIELD_FADE_SPEED'),
      type: 'fadeSpeed',
      defaultValue: 2,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Empilhar Cena');
    sgdk.emitLine(`scene_stack_push(current_scene, player_x, player_y);`);
    sgdk.emitLine(`current_scene = ${input.sceneId || 0};`);
    sgdk.emitLine(`player_x = ${(input.x || 0) * 8};`);
    sgdk.emitLine(`player_y = ${(input.y || 0) * 8};`);
    sgdk.emitLine(`scene_init(current_scene);`);
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

// Desempilhar Cena (Pop from Scene Stack)
const popSceneEvent = {
  id: 'EVENT_POP_SCENE',
  groups: ['EVENT_GROUP_SCENE'],
  name: l10n('EVENT_POP_SCENE'),
  description: l10n('EVENT_POP_SCENE_DESC'),
  fields: [
    {
      key: 'fadeSpeed',
      label: l10n('FIELD_FADE_SPEED'),
      type: 'fadeSpeed',
      defaultValue: 2,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Restaurar Cena da Pilha');
    sgdk.emitLine(`scene_stack_pop(&current_scene, &player_x, &player_y);`);
    sgdk.emitLine(`scene_init(current_scene);`);
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

// Limpar pilha de cenas
const popAllScenesEvent = {
  id: 'EVENT_POP_ALL_SCENES',
  groups: ['EVENT_GROUP_SCENE'],
  name: l10n('EVENT_POP_ALL_SCENES'),
  description: l10n('EVENT_POP_ALL_SCENES_DESC'),
  fields: [
    {
      key: 'fadeSpeed',
      label: l10n('FIELD_FADE_SPEED'),
      type: 'fadeSpeed',
      defaultValue: 2,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment('Limpar Pilha e Restaurar Primeira Cena');
    sgdk.emitLine(`scene_stack_pop_first(&current_scene, &player_x, &player_y);`);
    sgdk.emitLine(`scene_stack_clear();`);
    sgdk.emitLine(`scene_init(current_scene);`);
    sgdk.emitLine(`SYS_doVBlankProcess();`);
  },
};

module.exports = {
  changeSceneEvent,
  pushSceneEvent,
  popSceneEvent,
  popAllScenesEvent,
};
