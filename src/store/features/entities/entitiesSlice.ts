import { createSlice, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';
import type {
  MDActor,
  MDTrigger,
  MDBackground,
  MDSprite,
  MDPalette,
  MDVariable,
  MDMusic,
  MDSoundEffect,
} from './entitiesTypes';
import type { RootState } from '../../index';

// -------------------------------------------------
// EntitiesSlice - Gerencia atores, triggers,
// backgrounds, sprites, paletas, variaveis e musicas
// do projeto MD Studio
// Usa createEntityAdapter do RTK para CRUD eficiente
// -------------------------------------------------

const actorsAdapter = createEntityAdapter<MDActor>();
const triggersAdapter = createEntityAdapter<MDTrigger>();
const backgroundsAdapter = createEntityAdapter<MDBackground>();
const spritesAdapter = createEntityAdapter<MDSprite>();
const palettesAdapter = createEntityAdapter<MDPalette>();
const variablesAdapter = createEntityAdapter<MDVariable>();
const musicAdapter = createEntityAdapter<MDMusic>();
const soundEffectsAdapter = createEntityAdapter<MDSoundEffect>();

interface EntitiesState {
  actors: ReturnType<typeof actorsAdapter.getInitialState>;
  triggers: ReturnType<typeof triggersAdapter.getInitialState>;
  backgrounds: ReturnType<typeof backgroundsAdapter.getInitialState>;
  sprites: ReturnType<typeof spritesAdapter.getInitialState>;
  palettes: ReturnType<typeof palettesAdapter.getInitialState>;
  variables: ReturnType<typeof variablesAdapter.getInitialState>;
  music: ReturnType<typeof musicAdapter.getInitialState>;
  soundEffects: ReturnType<typeof soundEffectsAdapter.getInitialState>;
}

const initialState: EntitiesState = {
  actors: actorsAdapter.getInitialState(),
  triggers: triggersAdapter.getInitialState(),
  backgrounds: backgroundsAdapter.getInitialState(),
  sprites: spritesAdapter.getInitialState(),
  palettes: palettesAdapter.getInitialState(),
  variables: variablesAdapter.getInitialState(),
  music: musicAdapter.getInitialState(),
  soundEffects: soundEffectsAdapter.getInitialState(),
};

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {

    // --- Atores ---
    addActor(state, action: PayloadAction<MDActor>) {
      actorsAdapter.addOne(state.actors, action.payload);
    },
    updateActor(state, action: PayloadAction<{ id: string; changes: Partial<MDActor> }>) {
      actorsAdapter.updateOne(state.actors, action.payload);
    },
    removeActor(state, action: PayloadAction<string>) {
      actorsAdapter.removeOne(state.actors, action.payload);
    },
    setActors(state, action: PayloadAction<MDActor[]>) {
      actorsAdapter.setAll(state.actors, action.payload);
    },

    // --- Triggers ---
    addTrigger(state, action: PayloadAction<MDTrigger>) {
      triggersAdapter.addOne(state.triggers, action.payload);
    },
    updateTrigger(state, action: PayloadAction<{ id: string; changes: Partial<MDTrigger> }>) {
      triggersAdapter.updateOne(state.triggers, action.payload);
    },
    removeTrigger(state, action: PayloadAction<string>) {
      triggersAdapter.removeOne(state.triggers, action.payload);
    },

    // --- Backgrounds ---
    addBackground(state, action: PayloadAction<MDBackground>) {
      backgroundsAdapter.addOne(state.backgrounds, action.payload);
    },
    updateBackground(state, action: PayloadAction<{ id: string; changes: Partial<MDBackground> }>) {
      backgroundsAdapter.updateOne(state.backgrounds, action.payload);
    },
    removeBackground(state, action: PayloadAction<string>) {
      backgroundsAdapter.removeOne(state.backgrounds, action.payload);
    },

    // --- Sprites ---
    addSprite(state, action: PayloadAction<MDSprite>) {
      spritesAdapter.addOne(state.sprites, action.payload);
    },
    updateSprite(state, action: PayloadAction<{ id: string; changes: Partial<MDSprite> }>) {
      spritesAdapter.updateOne(state.sprites, action.payload);
    },
    removeSprite(state, action: PayloadAction<string>) {
      spritesAdapter.removeOne(state.sprites, action.payload);
    },

    // --- Paletas ---
    addPalette(state, action: PayloadAction<MDPalette>) {
      palettesAdapter.addOne(state.palettes, action.payload);
    },
    updatePalette(state, action: PayloadAction<{ id: string; changes: Partial<MDPalette> }>) {
      palettesAdapter.updateOne(state.palettes, action.payload);
    },
    removePalette(state, action: PayloadAction<string>) {
      palettesAdapter.removeOne(state.palettes, action.payload);
    },

    // --- Variaveis ---
    addVariable(state, action: PayloadAction<MDVariable>) {
      variablesAdapter.addOne(state.variables, action.payload);
    },
    updateVariable(state, action: PayloadAction<{ id: string; changes: Partial<MDVariable> }>) {
      variablesAdapter.updateOne(state.variables, action.payload);
    },
    removeVariable(state, action: PayloadAction<string>) {
      variablesAdapter.removeOne(state.variables, action.payload);
    },

    // --- Musica ---
    addMusic(state, action: PayloadAction<MDMusic>) {
      musicAdapter.addOne(state.music, action.payload);
    },
    updateMusic(state, action: PayloadAction<{ id: string; changes: Partial<MDMusic> }>) {
      musicAdapter.updateOne(state.music, action.payload);
    },
    removeMusic(state, action: PayloadAction<string>) {
      musicAdapter.removeOne(state.music, action.payload);
    },

    // --- Efeitos Sonoros ---
    addSoundEffect(state, action: PayloadAction<MDSoundEffect>) {
      soundEffectsAdapter.addOne(state.soundEffects, action.payload);
    },
    removeSoundEffect(state, action: PayloadAction<string>) {
      soundEffectsAdapter.removeOne(state.soundEffects, action.payload);
    },

    // --- Reset tudo ---
    resetEntities() {
      return initialState;
    },
  },
});

export const {
  addActor, updateActor, removeActor, setActors,
  addTrigger, updateTrigger, removeTrigger,
  addBackground, updateBackground, removeBackground,
  addSprite, updateSprite, removeSprite,
  addPalette, updatePalette, removePalette,
  addVariable, updateVariable, removeVariable,
  addMusic, updateMusic, removeMusic,
  addSoundEffect, removeSoundEffect,
  resetEntities,
} = entitiesSlice.actions;

// Selectors
export const actorSelectors = actorsAdapter.getSelectors(
  (state: RootState) => state.entities.actors
);
export const triggerSelectors = triggersAdapter.getSelectors(
  (state: RootState) => state.entities.triggers
);
export const backgroundSelectors = backgroundsAdapter.getSelectors(
  (state: RootState) => state.entities.backgrounds
);
export const spriteSelectors = spritesAdapter.getSelectors(
  (state: RootState) => state.entities.sprites
);
export const paletteSelectors = palettesAdapter.getSelectors(
  (state: RootState) => state.entities.palettes
);
export const variableSelectors = variablesAdapter.getSelectors(
  (state: RootState) => state.entities.variables
);
export const musicSelectors = musicAdapter.getSelectors(
  (state: RootState) => state.entities.music
);
export const soundEffectSelectors = soundEffectsAdapter.getSelectors(
  (state: RootState) => state.entities.soundEffects
);

export const entitiesReducer = entitiesSlice.reducer;
export default entitiesSlice.reducer;
