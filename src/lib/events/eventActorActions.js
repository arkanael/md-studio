// eventActorActions.js - Eventos de Acoes de Atores para MD Studio (SGDK/Mega Drive)
// Inclui: Lancar Projetil, Emotes, Ativar/Desativar e Colisoes

const actorLaunchProjectileEvent = {
  id: 'EVENT_LAUNCH_PROJECTILE',
  name: 'Launch Projectile',
  description: 'Lanca um projetil de um ator em uma direcao especificada.',
  fields: [
    { key: 'spriteSheetId', label: 'Sprite Sheet', type: 'sprite', defaultValue: '' },
    { key: 'actorId', label: 'Source Actor', type: 'actor', defaultValue: '$self$' },
    { key: 'x', label: 'Offset X', type: 'number', defaultValue: 0 },
    { key: 'y', label: 'Offset Y', type: 'number', defaultValue: 0 },
    { key: 'direction', label: 'Direction', type: 'direction', defaultValue: 'right' },
    { key: 'speed', label: 'Speed', type: 'moveSpeed', defaultValue: 2 },
  ],
  compile: (input, { helpers: { _projectileLaunch } }) => {
    _projectileLaunch(input.spriteSheetId, input.actorId, input.x, input.y, input.direction, input.speed);
  },
};

const actorShowEmoteEvent = {
  id: 'EVENT_SHOW_EMOTE',
  name: 'Show Emote Bubble',
  description: 'Exibe um balao de emote sobre um ator.',
  fields: [
    { key: 'actorId', label: 'Actor', type: 'actor', defaultValue: '$self$' },
    { key: 'emoteId', label: 'Emote', type: 'emote', defaultValue: 'love' },
  ],
  compile: (input, { helpers: { _actorShowEmote } }) => {
    _actorShowEmote(input.actorId, input.emoteId);
  },
};

const actorActivateEvent = {
  id: 'EVENT_ACTIVATE_ACTOR',
  name: 'Activate Actor',
  description: 'Ativa um ator, tornando-o visivel e iniciando seu script OnUpdate.',
  fields: [
    { key: 'actorId', label: 'Actor', type: 'actor', defaultValue: '$self$' },
  ],
  compile: (input, { helpers: { _actorSetActive } }) => {
    _actorSetActive(input.actorId, true);
  },
};

const actorDeactivateEvent = {
  id: 'EVENT_DEACTIVATE_ACTOR',
  name: 'Deactivate Actor',
  description: 'Desativa um ator, tornando-o invisivel e parando seu script OnUpdate.',
  fields: [
    { key: 'actorId', label: 'Actor', type: 'actor', defaultValue: '$self$' },
  ],
  compile: (input, { helpers: { _actorSetActive } }) => {
    _actorSetActive(input.actorId, false);
  },
};

const actorSetCollisionsEvent = {
  id: 'EVENT_SET_ACTOR_COLLISIONS',
  name: 'Set Actor Collisions',
  description: 'Habilita ou desabilita colisoes para um ator.',
  fields: [
    { key: 'actorId', label: 'Actor', type: 'actor', defaultValue: '$self$' },
    { key: 'enabled', label: 'Enable Collisions', type: 'boolean', defaultValue: true },
  ],
  compile: (input, { helpers: { _actorSetCollisions } }) => {
    _actorSetCollisions(input.actorId, input.enabled);
  },
};

module.exports = {
  actorLaunchProjectileEvent,
  actorShowEmoteEvent,
  actorActivateEvent,
  actorDeactivateEvent,
  actorSetCollisionsEvent,
};
