/**
 * eventActorExtended.js
 * MD Studio - Eventos estendidos de Atores (Projectiles, Emotes, Conditionals, etc)
 * 
 * Implementação de eventos avançados de atores para o MD Studio (SGDK/Mega Drive).
 */

const l10n = require('../helpers/l10n');

// --- Launch Projectile ---
const launchProjectile = {
  id: 'EVENT_LAUNCH_PROJECTILE',
  name: l10n('EVENT_LAUNCH_PROJECTILE'),
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    { key: 'spriteSheetId', type: 'sprite', label: l10n('FIELD_SPRITE_SHEET'), defaultValue: 'LAST_SPRITE' },
    { key: 'spriteAnimationId', type: 'animation', label: l10n('FIELD_ANIMATION_STATE'), defaultValue: 'Default' },
    { key: 'actorId', type: 'actor', label: l10n('FIELD_SOURCE'), defaultValue: 'player' },
    { key: 'direction', type: 'direction', label: l10n('FIELD_DIRECTION'), defaultValue: 'up' },
    { key: 'speed', type: 'number', label: l10n('FIELD_SPEED'), defaultValue: 2, min: 1, max: 10 },
    { key: 'lifeTime', type: 'number', label: l10n('FIELD_LIFE_TIME'), defaultValue: 1.0, min: 0.1, max: 10.0, step: 0.1 }
  ],
  compile: (params, helpers) => {
    const { actorId, spriteSheetId, direction, speed, lifeTime } = params;
    // No Mega Drive, projéteis são sprites gerenciados pelo SPR_init/SPR_addSprite
    helpers.writeRaw(`// Launch Projectile de ${actorId} dir ${direction}`);
    helpers.writeRaw(`SPR_addSprite(&${spriteSheetId}, x, y, TILE_ATTR(PAL1, TRUE, FALSE, FALSE));`);
  }
};

// --- Show Emote Bubble ---
const showEmoteBubble = {
  id: 'EVENT_SHOW_EMOTE',
  name: l10n('EVENT_SHOW_EMOTE'),
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    { key: 'actorId', type: 'actor', label: l10n('FIELD_ACTOR'), defaultValue: 'player' },
    { key: 'emoteId', type: 'emote', label: l10n('FIELD_EMOTE'), defaultValue: 'love' }
  ],
  compile: (params, helpers) => {
    // Emotes costumam ser sprites temporários acima do ator
    helpers.writeRaw(`// Show Emote ${params.emoteId} above ${params.actorId}`);
    helpers.writeRaw(`SPR_addSprite(&emote_${params.emoteId}, actor_x, actor_y - 16, TILE_ATTR(PAL0, TRUE, FALSE, FALSE));`);
  }
};

// --- Conditionals: If Actor At Position ---
const ifActorAtPosition = {
  id: 'EVENT_IF_ACTOR_AT_POSITION',
  name: l10n('EVENT_IF_ACTOR_AT_POSITION'),
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_CONTROL_FLOW'],
  fields: [
    { key: 'actorId', type: 'actor', label: l10n('FIELD_ACTOR'), defaultValue: 'player' },
    { key: 'x', type: 'number', label: 'X', defaultValue: 0 },
    { key: 'y', type: 'number', label: 'Y', defaultValue: 0 },
    { key: 'true', type: 'events', label: l10n('FIELD_TRUE') },
    { key: 'false', type: 'events', label: l10n('FIELD_FALSE') }
  ],
  compile: (params, helpers) => {
    helpers.writeRaw(`if (actor_pos_x == ${params.x} && actor_pos_y == ${params.y}) {`);
    helpers.compileEvents(params.true);
    helpers.writeRaw(`} else {`);
    helpers.compileEvents(params.false);
    helpers.writeRaw(`}`);
  }
};

// --- Push Actor Away From Player ---
const pushActorAway = {
  id: 'EVENT_PUSH_ACTOR_AWAY',
  name: l10n('EVENT_PUSH_ACTOR_AWAY'),
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    { key: 'actorId', type: 'actor', label: l10n('FIELD_ACTOR'), defaultValue: '$self$' },
    { key: 'slide', type: 'checkbox', label: l10n('FIELD_SLIDE_UNTIL_COLLISION'), defaultValue: false }
  ],
  compile: (params, helpers) => {
    helpers.writeRaw(`// Push actor ${params.actorId} away from player`);
    helpers.writeRaw(`actor_push(${params.actorId}, player_dir, ${params.slide});`);
  }
};

// --- Player Bounce (Platformer) ---
const playerBounce = {
  id: 'EVENT_PLAYER_BOUNCE',
  name: l10n('EVENT_PLAYER_BOUNCE'),
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    { key: 'height', type: 'select', options: [['low', 'Low'], ['medium', 'Medium'], ['high', 'High']], defaultValue: 'medium' }
  ],
  compile: (params, helpers) => {
    helpers.writeRaw(`// Player Bounce speed Y`);
    helpers.writeRaw(`player_vel_y = -bounce_force_${params.height};`);
  }
};

// --- Actor Effects (Flicker) ---
const actorEffects = {
  id: 'EVENT_ACTOR_EFFECTS',
  name: l10n('EVENT_ACTOR_EFFECTS'),
  groups: ['EVENT_GROUP_ACTOR'],
  fields: [
    { key: 'actorId', type: 'actor', label: l10n('FIELD_ACTOR'), defaultValue: 'player' },
    { key: 'effect', type: 'select', options: [['flicker', 'Flicker'], ['shake', 'Shake']], defaultValue: 'flicker' },
    { key: 'duration', type: 'number', label: l10n('FIELD_DURATION'), defaultValue: 0.5, step: 0.1 }
  ],
  compile: (params, helpers) => {
    helpers.writeRaw(`// Actor Effect ${params.effect} for ${params.duration}s`);
    helpers.writeRaw(`actor_play_effect(${params.actorId}, EFFECT_${params.effect.toUpperCase()}, ${params.duration * 60});`);
  }
};

// --- Hide/Show All Sprites ---
const hideAllSprites = {
  id: 'EVENT_HIDE_ALL_SPRITES',
  name: l10n('EVENT_HIDE_ALL_SPRITES'),
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_VISIBILITY'],
  compile: (params, helpers) => {
    helpers.writeRaw(`VDP_setEnable(FALSE); // Mega Drive VDP off or sprites off`);
  }
};

const showAllSprites = {
  id: 'EVENT_SHOW_ALL_SPRITES',
  name: l10n('EVENT_SHOW_ALL_SPRITES'),
  groups: ['EVENT_GROUP_ACTOR', 'EVENT_GROUP_VISIBILITY'],
  compile: (params, helpers) => {
    helpers.writeRaw(`VDP_setEnable(TRUE);`);
  }
};

module.exports = {
  launchProjectile,
  showEmoteBubble,
  ifActorAtPosition,
  pushActorAway,
  playerBounce,
  actorEffects,
  hideAllSprites,
  showAllSprites
};
