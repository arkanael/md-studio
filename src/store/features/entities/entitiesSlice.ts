import { createSlice, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';
import { Actor, Trigger, Background, Tileset } from '../entities/entitiesTypes';
import type { RootState } from '../../index';

// -------------------------------------------------
// EntitiesSlice - Gerencia atores, triggers,
// backgrounds e tilesets do projeto MD Studio
// -------------------------------------------------

const actorsAdapter = createEntityAdapter<Actor>();
const triggersAdapter = createEntityAdapter<Trigger>();
const backgroundsAdapter = createEntityAdapter<Background>();
const tilesetsAdapter = createEntityAdapter<Tileset>();

interface EntitiesState {
  actors: ReturnType<typeof actorsAdapter.getInitialState>;
  triggers: ReturnType<typeof triggersAdapter.getInitialState>;
  backgrounds: ReturnType<typeof backgroundsAdapter.getInitialState>;
  tilesets: ReturnType<typeof tilesetsAdapter.getInitialState>;
}

const initialState: EntitiesState = {
  actors: actorsAdapter.getInitialState(),
  triggers: triggersAdapter.getInitialState(),
  backgrounds: backgroundsAdapter.getInitialState(),
  tilesets: tilesetsAdapter.getInitialState(),
};

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    // --- Atores ---
    addActor(state, action: PayloadAction<Actor>) {
      actorsAdapter.addOne(state.actors, action.payload);
    },
    updateActor(state, action: PayloadAction<{ id: string; changes: Partial<Actor> }>) {
      actorsAdapter.updateOne(state.actors, action.payload);
    },
    removeActor(state, action: PayloadAction<string>) {
      actorsAdapter.removeOne(state.actors, action.payload);
    },

    // --- Triggers ---
    addTrigger(state, action: PayloadAction<Trigger>) {
      triggersAdapter.addOne(state.triggers, action.payload);
    },
    updateTrigger(state, action: PayloadAction<{ id: string; changes: Partial<Trigger> }>) {
      triggersAdapter.updateOne(state.triggers, action.payload);
    },
    removeTrigger(state, action: PayloadAction<string>) {
      triggersAdapter.removeOne(state.triggers, action.payload);
    },

    // --- Backgrounds ---
    addBackground(state, action: PayloadAction<Background>) {
      backgroundsAdapter.addOne(state.backgrounds, action.payload);
    },
    updateBackground(state, action: PayloadAction<{ id: string; changes: Partial<Background> }>) {
      backgroundsAdapter.updateOne(state.backgrounds, action.payload);
    },
    removeBackground(state, action: PayloadAction<string>) {
      backgroundsAdapter.removeOne(state.backgrounds, action.payload);
    },

    // --- Tilesets ---
    addTileset(state, action: PayloadAction<Tileset>) {
      tilesetsAdapter.addOne(state.tilesets, action.payload);
    },
    updateTileset(state, action: PayloadAction<{ id: string; changes: Partial<Tileset> }>) {
      tilesetsAdapter.updateOne(state.tilesets, action.payload);
    },
    removeTileset(state, action: PayloadAction<string>) {
      tilesetsAdapter.removeOne(state.tilesets, action.payload);
    },

    // --- Reset tudo ---
    resetEntities() {
      return initialState;
    },
  },
});

export const {
  addActor, updateActor, removeActor,
  addTrigger, updateTrigger, removeTrigger,
  addBackground, updateBackground, removeBackground,
  addTileset, updateTileset, removeTileset,
  resetEntities,
} = entitiesSlice.actions;

// Selectors
export const actorSelectors = actorsAdapter.getSelectors((state: RootState) => state.entities.actors);
export const triggerSelectors = triggersAdapter.getSelectors((state: RootState) => state.entities.triggers);
export const backgroundSelectors = backgroundsAdapter.getSelectors((state: RootState) => state.entities.backgrounds);
export const tilesetSelectors = tilesetsAdapter.getSelectors((state: RootState) => state.entities.tilesets);

export default entitiesSlice.reducer;
