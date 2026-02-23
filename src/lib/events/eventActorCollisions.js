/**
 * eventActorCollisions.js
 * MD Studio — Eventos: Colisoes do Ator
 * - Set Actor Collision Bounding Box
 * - Set Actor Collisions Disable
 * - Set Actor Collisions Enable
 *
 * Baseado no GB Studio (MIT License - Chris Maltby)
 * Adaptado para SGDK (Mega Drive)
 *
 * No Mega Drive nao existe bounding box nativa em sprites SGDK;
 * usamos flags de colisao proprias do MD Studio
 */
const l10n = require('../helpers/l10n').default;

// ============================================================
// EVENT: SET ACTOR COLLISION BOUNDING BOX
// Define a area de colisao do ator
// ============================================================
const setActorCollisionBoxEvent = {
  id: 'EVENT_ACTOR_SET_COLLISION_BOX',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_SET_COLLISION_BOX'),
  description: 'Define a bounding box de colisao do ator no Mega Drive',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
    {
      key: 'x',
      label: l10n('FIELD_X'),
      description: 'Offset X da bounding box (pixels)',
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'y',
      label: l10n('FIELD_Y'),
      description: 'Offset Y da bounding box (pixels)',
      type: 'number',
      min: 0,
      max: 255,
      defaultValue: 0,
    },
    {
      key: 'width',
      label: l10n('FIELD_WIDTH'),
      description: 'Largura da bounding box (pixels)',
      type: 'number',
      min: 1,
      max: 255,
      defaultValue: 16,
    },
    {
      key: 'height',
      label: l10n('FIELD_HEIGHT'),
      description: 'Altura da bounding box (pixels)',
      type: 'number',
      min: 1,
      max: 255,
      defaultValue: 16,
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Definir bounding box do ator '${input.actorId}': (${input.x},${input.y}) ${input.width}x${input.height}`);
    // No MD Studio: bounding box armazenada em array de colisao de atores
    sgdk.emitLine(`/* Bounding box do ator ${input.actorId}: offset=(${input.x},${input.y}) size=(${input.width}x${input.height}) */`);
    sgdk.emitLine(`actor_bbox[${input.actorId}].x = ${input.x};`);
    sgdk.emitLine(`actor_bbox[${input.actorId}].y = ${input.y};`);
    sgdk.emitLine(`actor_bbox[${input.actorId}].w = ${input.width};`);
    sgdk.emitLine(`actor_bbox[${input.actorId}].h = ${input.height};`);
  },
};

// ============================================================
// EVENT: SET ACTOR COLLISIONS DISABLE
// Desativa colisoes do ator
// ============================================================
const setActorCollisionsDisableEvent = {
  id: 'EVENT_ACTOR_COLLISIONS_DISABLE',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_COLLISIONS_DISABLE'),
  description: 'Desativa as colisoes do ator no Mega Drive',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Desativar colisoes do ator '${input.actorId}'`);
    sgdk.emitLine(`actor_collision_enabled[${input.actorId}] = FALSE;`);
  },
};

// ============================================================
// EVENT: SET ACTOR COLLISIONS ENABLE
// Reativa colisoes do ator
// ============================================================
const setActorCollisionsEnableEvent = {
  id: 'EVENT_ACTOR_COLLISIONS_ENABLE',
  groups: ['EVENT_GROUP_ACTOR'],
  subGroups: { EVENT_GROUP_ACTOR: 'EVENT_GROUP_PROPERTIES' },
  name: l10n('EVENT_ACTOR_COLLISIONS_ENABLE'),
  description: 'Reativa as colisoes do ator no Mega Drive',
  fields: [
    {
      key: 'actorId',
      label: l10n('ACTOR'),
      type: 'actor',
      defaultValue: '$self$',
    },
  ],
  compile: (input, { sgdk }) => {
    sgdk.emitComment(`Reativar colisoes do ator '${input.actorId}'`);
    sgdk.emitLine(`actor_collision_enabled[${input.actorId}] = TRUE;`);
  },
};

module.exports = {
  setActorCollisionBoxEvent,
  setActorCollisionsDisableEvent,
  setActorCollisionsEnableEvent,
};
