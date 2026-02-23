import { createSlice, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';
import type {
  MDScene,
  MDActor,
  MDTrigger,
  CollisionTile,
  MDScriptEvent,
  EntityId,
  ActorDirection,
} from '../entities/entitiesTypes';
import type { RootState } from '../../index';
import { nanoid } from '@reduxjs/toolkit';

// -------------------------------------------------
// ScenesSlice - Gerencia as cenas do projeto
// Equivale ao scenesSlice do GB Studio
// adaptado para o Mega Drive / SGDK
// -------------------------------------------------

const scenesAdapter = createEntityAdapter<MDScene>();

const initialState = scenesAdapter.getInitialState();

export type ScenesState = typeof initialState;

const scenesSlice = createSlice({
  name: 'scenes',
  initialState,
  reducers: {

    // --- CRUD de cenas ---

    addScene: {
      reducer(state, action: PayloadAction<MDScene>) {
        scenesAdapter.addOne(state, action.payload);
      },
      prepare(partial: Partial<MDScene> & { name: string }) {
        const id = nanoid();
        const scene: MDScene = {
          id,
          name: partial.name,
          backgroundId: partial.backgroundId ?? '',
          width: partial.width ?? 40,
          height: partial.height ?? 28,
          paletteIds: partial.paletteIds ?? [],
          actors: partial.actors ?? [],
          triggers: partial.triggers ?? [],
          collisions: partial.collisions ?? [],
          playerStartX: partial.playerStartX ?? 4,
          playerStartY: partial.playerStartY ?? 4,
          playerStartDirection: partial.playerStartDirection ?? 'down',
          script: partial.script ?? [],
          playerHitScript: partial.playerHitScript ?? [],
          musicId: partial.musicId,
          scrollX: partial.scrollX ?? false,
          scrollY: partial.scrollY ?? false,
          planeAId: partial.planeAId,
          planeBId: partial.planeBId,
        };
        return { payload: scene };
      },
    },

    updateScene(
      state,
      action: PayloadAction<{ id: EntityId; changes: Partial<MDScene> }>
    ) {
      scenesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload.changes,
      });
    },

    removeScene(state, action: PayloadAction<EntityId>) {
      scenesAdapter.removeOne(state, action.payload);
    },

    duplicateScene(
      state,
      action: PayloadAction<EntityId>
    ) {
      const original = state.entities[action.payload];
      if (!original) return;
      const newScene: MDScene = {
        ...original,
        id: nanoid(),
        name: original.name + ' (copia)',
        // Copia profunda dos atores e triggers com novos IDs
        actors: original.actors.map((a) => ({ ...a, id: nanoid() })),
        triggers: original.triggers.map((t) => ({ ...t, id: nanoid() })),
        collisions: [...original.collisions],
      };
      scenesAdapter.addOne(state, newScene);
    },

    moveScene(
      state,
      action: PayloadAction<{ id: EntityId; dx: number; dy: number }>
    ) {
      // Mover cena no world editor (posicao visual, nao afeta logica)
      // Guardado no campo 'scrollX'/'scrollY' temporariamente
      // TODO: adicionar campos x/y na MDScene para posicao no world
      const scene = state.entities[action.payload.id];
      if (scene) {
        // Usando uma abordagem simples: manter posicao como metadata
        scenesAdapter.updateOne(state, {
          id: action.payload.id,
          changes: {} // placeholder - x/y serao adicionados depois
        });
      }
    },

    // --- Atores dentro de cenas ---

    addActorToScene(
      state,
      action: PayloadAction<{ sceneId: EntityId; actor: Partial<MDActor> & { spriteId: EntityId; x: number; y: number } }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      const actor: MDActor = {
        id: nanoid(),
        name: action.payload.actor.name ?? 'Ator',
        x: action.payload.actor.x,
        y: action.payload.actor.y,
        spriteId: action.payload.actor.spriteId,
        direction: action.payload.actor.direction ?? 'down',
        moveSpeed: action.payload.actor.moveSpeed ?? 1,
        animSpeed: action.payload.actor.animSpeed ?? 8,
        paletteId: action.payload.actor.paletteId ?? '',
        collisionGroup: action.payload.actor.collisionGroup ?? 'none',
        isPersistent: action.payload.actor.isPersistent ?? false,
        script: action.payload.actor.script ?? [],
        startScript: action.payload.actor.startScript ?? [],
        updateScript: action.payload.actor.updateScript ?? [],
        hitScript: action.payload.actor.hitScript ?? [],
      };
      scene.actors.push(actor);
    },

    updateActorInScene(
      state,
      action: PayloadAction<{
        sceneId: EntityId;
        actorId: EntityId;
        changes: Partial<MDActor>;
      }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      const actor = scene.actors.find((a) => a.id === action.payload.actorId);
      if (!actor) return;
      Object.assign(actor, action.payload.changes);
    },

    removeActorFromScene(
      state,
      action: PayloadAction<{ sceneId: EntityId; actorId: EntityId }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      scene.actors = scene.actors.filter((a) => a.id !== action.payload.actorId);
    },

    moveActorInScene(
      state,
      action: PayloadAction<{
        sceneId: EntityId;
        actorId: EntityId;
        x: number;
        y: number;
      }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      const actor = scene.actors.find((a) => a.id === action.payload.actorId);
      if (!actor) return;
      actor.x = action.payload.x;
      actor.y = action.payload.y;
    },

    // --- Triggers dentro de cenas ---

    addTriggerToScene(
      state,
      action: PayloadAction<{
        sceneId: EntityId;
        trigger: Partial<MDTrigger> & { x: number; y: number };
      }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      const trigger: MDTrigger = {
        id: nanoid(),
        name: action.payload.trigger.name ?? 'Trigger',
        x: action.payload.trigger.x,
        y: action.payload.trigger.y,
        width: action.payload.trigger.width ?? 2,
        height: action.payload.trigger.height ?? 2,
        script: action.payload.trigger.script ?? [],
      };
      scene.triggers.push(trigger);
    },

    updateTriggerInScene(
      state,
      action: PayloadAction<{
        sceneId: EntityId;
        triggerId: EntityId;
        changes: Partial<MDTrigger>;
      }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      const trigger = scene.triggers.find((t) => t.id === action.payload.triggerId);
      if (!trigger) return;
      Object.assign(trigger, action.payload.changes);
    },

    removeTriggerFromScene(
      state,
      action: PayloadAction<{ sceneId: EntityId; triggerId: EntityId }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      scene.triggers = scene.triggers.filter((t) => t.id !== action.payload.triggerId);
    },

    // --- Colisoes ---

    setCollisionTile(
      state,
      action: PayloadAction<{
        sceneId: EntityId;
        tile: CollisionTile;
      }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      const existing = scene.collisions.findIndex(
        (c) => c.x === action.payload.tile.x && c.y === action.payload.tile.y
      );
      if (action.payload.tile.type === 'none') {
        if (existing >= 0) scene.collisions.splice(existing, 1);
      } else {
        if (existing >= 0) {
          scene.collisions[existing] = action.payload.tile;
        } else {
          scene.collisions.push(action.payload.tile);
        }
      }
    },

    clearCollisions(
      state,
      action: PayloadAction<EntityId>
    ) {
      const scene = state.entities[action.payload];
      if (scene) scene.collisions = [];
    },

    // --- Script da cena ---

    setSceneScript(
      state,
      action: PayloadAction<{
        sceneId: EntityId;
        scriptKey: 'script' | 'playerHitScript';
        events: MDScriptEvent[];
      }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      scene[action.payload.scriptKey] = action.payload.events;
    },

    // --- Player start ---

    setPlayerStart(
      state,
      action: PayloadAction<{
        sceneId: EntityId;
        x: number;
        y: number;
        direction: ActorDirection;
      }>
    ) {
      const scene = state.entities[action.payload.sceneId];
      if (!scene) return;
      scene.playerStartX = action.payload.x;
      scene.playerStartY = action.payload.y;
      scene.playerStartDirection = action.payload.direction;
    },

    // --- Reset ---
    resetScenes() {
      return initialState;
    },
  },
});

export const {
  addScene,
  updateScene,
  removeScene,
  duplicateScene,
  moveScene,
  addActorToScene,
  updateActorInScene,
  removeActorFromScene,
  moveActorInScene,
  addTriggerToScene,
  updateTriggerInScene,
  removeTriggerFromScene,
  setCollisionTile,
  clearCollisions,
  setSceneScript,
  setPlayerStart,
  resetScenes,
} = scenesSlice.actions;

// Selectors
export const sceneSelectors = scenesAdapter.getSelectors(
  (state: RootState) => state.scenes
);

export const scenesReducer = scenesSlice.reducer;
export default scenesSlice.reducer;
