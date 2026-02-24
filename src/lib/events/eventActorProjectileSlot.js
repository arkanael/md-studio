/**
 * eventActorProjectileSlot.js
 * MD Studio - Eventos de Projétil em Slot
 *
 * Equivalente GB Studio:
 *   - EVENT_LAUNCH_PROJECTILE_IN_SLOT   (Launch Projectile In Slot)
 *   - EVENT_LOAD_PROJECTILE_INTO_SLOT   (Load Projectile Into Slot)
 */

'use strict';

// ─── Launch Projectile In Slot ───────────────────────────────────────────────

/**
 * Lança o projétil de um slot a partir de um ator em uma direção especificada.
 * Quando o projétil colide com outros atores, ativa seus scripts OnHit.
 *
 * SGDK: usa sistema de projéteis pré-carregados em slots (projectile_slots[]).
 */
const launchProjectileInSlot = {
  id: 'EVENT_LAUNCH_PROJECTILE_IN_SLOT',
  label: 'Launch Projectile In Slot',
  description: 'Lança o projétil de um slot a partir de um ator em uma direção especificada.',
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    {
      key: 'actorId',
      label: 'Source',
      type: 'actor',
      defaultValue: '$self$',
      description: 'O ator de onde o projétil será lançado.',
    },
    {
      key: 'offsetX',
      label: 'Offset X',
      type: 'number',
      min: -16,
      max: 16,
      defaultValue: 0,
      description: 'Deslocamento horizontal da posição do ator.',
    },
    {
      key: 'offsetY',
      label: 'Offset Y',
      type: 'number',
      min: -16,
      max: 16,
      defaultValue: 0,
      description: 'Deslocamento vertical da posição do ator.',
    },
    {
      key: 'direction',
      label: 'Direction',
      type: 'union',
      types: ['direction', 'variable', 'property'],
      defaultType: 'direction',
      defaultValue: {
        direction: 'right',
        variable: 'LAST_VARIABLE',
        property: '$self$:direction',
      },
      description: 'A direção para lançar o projétil.',
    },
    {
      key: 'projectileSlot',
      label: 'Projectile Slot',
      type: 'select',
      options: [
        [0, 'Slot 1'],
        [1, 'Slot 2'],
        [2, 'Slot 3'],
        [3, 'Slot 4'],
        [4, 'Slot 5'],
      ],
      defaultValue: 0,
      description: 'O slot que contém o projétil a ser lançado.',
    },
  ],
  compile: (input, helpers) => {
    const { actorSetActive, appendRaw, _addComment } = helpers;
    _addComment('Launch Projectile In Slot');
    actorSetActive(input.actorId);
    appendRaw(`
  {\n    // Launch projectile from slot ${input.projectileSlot}\n    projectile_launch_slot(active_actor, ${input.projectileSlot}, ${input.offsetX}, ${input.offsetY}, ${input.direction && input.direction.value !== undefined ? input.direction.value : input.direction});\n  }`);
  },
};

// ─── Load Projectile Into Slot ───────────────────────────────────────────────

/**
 * Carrega dados de projétil em um slot especificado.
 *
 * SGDK: pré-carrega definição de projétil em slot para uso posterior.
 */
const loadProjectileIntoSlot = {
  id: 'EVENT_LOAD_PROJECTILE_INTO_SLOT',
  label: 'Load Projectile Into Slot',
  description: 'Carrega dados de projétil em um slot especificado.',
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    {
      key: 'projectileSlot',
      label: 'Projectile Slot',
      type: 'select',
      options: [
        [0, 'Slot 1'],
        [1, 'Slot 2'],
        [2, 'Slot 3'],
        [3, 'Slot 4'],
        [4, 'Slot 5'],
      ],
      defaultValue: 0,
      description: 'O slot onde os dados do projétil serão armazenados.',
    },
    {
      key: 'spriteSheetId',
      label: 'Sprite Sheet',
      type: 'sprite',
      defaultValue: '',
      description: 'O sprite a usar para renderizar o projétil.',
    },
    {
      key: 'animationState',
      label: 'Animation State',
      type: 'animationstate',
      defaultValue: '',
      description: 'O estado de animação do sprite a usar.',
    },
    {
      key: 'speed',
      label: 'Speed',
      type: 'moveSpeed',
      defaultValue: 2,
      description: 'A velocidade de movimento do projétil.',
    },
    {
      key: 'animSpeed',
      label: 'Animation Speed',
      type: 'animSpeed',
      defaultValue: 4,
      description: 'A velocidade de animação do projétil.',
    },
    {
      key: 'lifeTime',
      label: 'Life Time',
      type: 'number',
      min: 0,
      max: 10,
      defaultValue: 1,
      description: 'Tempo de vida em segundos.',
    },
    {
      key: 'initialOffset',
      label: 'Initial Offset',
      type: 'number',
      min: 0,
      max: 16,
      defaultValue: 0,
      description: 'Distância inicial antes de se tornar visível.',
    },
    {
      key: 'loopAnim',
      label: 'Loop Animation',
      type: 'checkbox',
      defaultValue: false,
      description: 'Define se a animação deve repetir em loop.',
    },
    {
      key: 'destroyOnHit',
      label: 'Destroy On Hit',
      type: 'checkbox',
      defaultValue: true,
      description: 'Define se o projétil deve ser destruído após a primeira colisão.',
    },
    {
      key: 'collisionGroup',
      label: 'Collision Group',
      type: 'collisionMask',
      defaultValue: '1',
      description: 'O grupo de colisão para o projétil.',
    },
    {
      key: 'collideWith',
      label: 'Collide With',
      type: 'collisionMask',
      defaultValue: 'player',
      description: 'Grupos de atores verificados para colisões.',
    },
  ],
  compile: (input, helpers) => {
    const { appendRaw, _addComment } = helpers;
    _addComment('Load Projectile Into Slot');
    appendRaw(`
  {\n    // Load projectile into slot ${input.projectileSlot}\n    projectile_load_slot(${input.projectileSlot}, &${input.spriteSheetId || 'default'}_sprite, ${input.speed || 2}, ${input.lifeTime || 1}, ${input.destroyOnHit ? 1 : 0});\n  }`);
  },
};

module.exports = {
  launchProjectileInSlot,
  loadProjectileIntoSlot,
};
