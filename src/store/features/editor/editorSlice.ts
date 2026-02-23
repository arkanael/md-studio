import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EntityId } from '../entities/entitiesTypes';

// ---------------------------
// Ferramentas do editor
// ---------------------------
export type EditorTool =
  | 'select'      // selecionar/mover entidades
  | 'eraser'      // apagar
  | 'collision'   // pintar colisoes
  | 'trigger'     // criar triggers
  | 'actor'       // adicionar atores
  | 'zoom_in'
  | 'zoom_out';

// ---------------------------
// Tipo de selecao
// ---------------------------
export type SelectionType =
  | 'scene'
  | 'actor'
  | 'trigger'
  | 'player'
  | null;

// ---------------------------
// Modo de visualizacao
// ---------------------------
export type EditorView =
  | 'world'     // mapa geral com todas as cenas
  | 'scene'     // cena aberta em foco
  | 'sprite'    // editor de sprites
  | 'music'     // editor de musica
  | 'settings'; // configuracoes do projeto

// ---------------------------
// Painel lateral
// ---------------------------
export type SidebarPanel =
  | 'scenes'
  | 'actors'
  | 'triggers'
  | 'sprites'
  | 'backgrounds'
  | 'palettes'
  | 'music'
  | 'variables'
  | 'settings';

// ---------------------------
// Estado do Editor
// Equivale ao editorSlice do GB Studio
// ---------------------------
export interface EditorState {
  // Visualizacao atual
  view: EditorView;
  sidebarPanel: SidebarPanel;

  // Cena aberta
  focusedSceneId: EntityId | null;
  previousSceneId: EntityId | null;

  // Selecao
  selectionType: SelectionType;
  selectedEntityId: EntityId | null;
  selectedSceneId: EntityId | null;

  // Ferramenta ativa
  tool: EditorTool;

  // Pintura de colisoes
  collisionTileType: string;
  showCollisions: boolean;

  // Zoom (1 = 100%, 2 = 200%, etc)
  zoom: number;
  minZoom: number;
  maxZoom: number;

  // Scroll do world editor
  worldScrollX: number;
  worldScrollY: number;

  // Painel de propriedades (script editor)
  scriptEditorOpen: boolean;
  scriptEditorSceneId: EntityId | null;
  scriptEditorEntityId: EntityId | null;
  scriptEditorType: 'actor' | 'trigger' | 'scene' | null;
  scriptEditorKey: string | null; // 'script' | 'startScript' | etc

  // Clipboard (copiar/colar entidades)
  clipboard: unknown | null;

  // Historico de undo/redo
  canUndo: boolean;
  canRedo: boolean;

  // Estado da UI
  previewPlaying: boolean;
  isModified: boolean;          // projeto foi modificado?
  showGrid: boolean;
  showGuides: boolean;          // guias de tela (320x224)
  showConnections: boolean;     // conexoes entre cenas

  // Layers visiveis
  layerActors: boolean;
  layerTriggers: boolean;
  layerCollisions: boolean;
  layerBackground: boolean;
}

// ---------------------------
// Estado inicial
// ---------------------------
const initialState: EditorState = {
  view: 'world',
  sidebarPanel: 'scenes',

  focusedSceneId: null,
  previousSceneId: null,

  selectionType: null,
  selectedEntityId: null,
  selectedSceneId: null,

  tool: 'select',

  collisionTileType: 'solid',
  showCollisions: false,

  zoom: 1,
  minZoom: 0.25,
  maxZoom: 4,

  worldScrollX: 0,
  worldScrollY: 0,

  scriptEditorOpen: false,
  scriptEditorSceneId: null,
  scriptEditorEntityId: null,
  scriptEditorType: null,
  scriptEditorKey: null,

  clipboard: null,

  canUndo: false,
  canRedo: false,

  previewPlaying: false,
  isModified: false,
  showGrid: true,
  showGuides: true,
  showConnections: true,

  layerActors: true,
  layerTriggers: true,
  layerCollisions: false,
  layerBackground: true,
};

// ---------------------------
// Slice
// ---------------------------
const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Mudar visualizacao
    setView(state, action: PayloadAction<EditorView>) {
      state.view = action.payload;
    },
    setSidebarPanel(state, action: PayloadAction<SidebarPanel>) {
      state.sidebarPanel = action.payload;
    },

    // Focar em uma cena
    focusScene(state, action: PayloadAction<EntityId | null>) {
      state.previousSceneId = state.focusedSceneId;
      state.focusedSceneId = action.payload;
      state.view = action.payload ? 'scene' : 'world';
    },
    goBackToWorld(state) {
      state.focusedSceneId = null;
      state.view = 'world';
      state.selectionType = null;
      state.selectedEntityId = null;
    },

    // Selecao
    selectScene(state, action: PayloadAction<EntityId>) {
      state.selectionType = 'scene';
      state.selectedSceneId = action.payload;
      state.selectedEntityId = action.payload;
    },
    selectActor(state, action: PayloadAction<{ sceneId: EntityId; actorId: EntityId }>) {
      state.selectionType = 'actor';
      state.selectedSceneId = action.payload.sceneId;
      state.selectedEntityId = action.payload.actorId;
    },
    selectTrigger(state, action: PayloadAction<{ sceneId: EntityId; triggerId: EntityId }>) {
      state.selectionType = 'trigger';
      state.selectedSceneId = action.payload.sceneId;
      state.selectedEntityId = action.payload.triggerId;
    },
    selectPlayer(state) {
      state.selectionType = 'player';
      state.selectedEntityId = 'player';
    },
    clearSelection(state) {
      state.selectionType = null;
      state.selectedEntityId = null;
    },

    // Ferramenta
    setTool(state, action: PayloadAction<EditorTool>) {
      state.tool = action.payload;
    },
    setCollisionTileType(state, action: PayloadAction<string>) {
      state.collisionTileType = action.payload;
    },

    // Zoom
    zoomIn(state) {
      state.zoom = Math.min(state.maxZoom, state.zoom * 1.25);
    },
    zoomOut(state) {
      state.zoom = Math.max(state.minZoom, state.zoom / 1.25);
    },
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = Math.max(state.minZoom, Math.min(state.maxZoom, action.payload));
    },
    resetZoom(state) {
      state.zoom = 1;
    },

    // Scroll
    setWorldScroll(state, action: PayloadAction<{ x: number; y: number }>) {
      state.worldScrollX = action.payload.x;
      state.worldScrollY = action.payload.y;
    },

    // Script editor
    openScriptEditor(
      state,
      action: PayloadAction<{
        sceneId: EntityId;
        entityId: EntityId;
        type: 'actor' | 'trigger' | 'scene';
        key: string;
      }>
    ) {
      state.scriptEditorOpen = true;
      state.scriptEditorSceneId = action.payload.sceneId;
      state.scriptEditorEntityId = action.payload.entityId;
      state.scriptEditorType = action.payload.type;
      state.scriptEditorKey = action.payload.key;
    },
    closeScriptEditor(state) {
      state.scriptEditorOpen = false;
      state.scriptEditorSceneId = null;
      state.scriptEditorEntityId = null;
      state.scriptEditorType = null;
      state.scriptEditorKey = null;
    },

    // UI
    toggleGrid(state) { state.showGrid = !state.showGrid; },
    toggleGuides(state) { state.showGuides = !state.showGuides; },
    toggleConnections(state) { state.showConnections = !state.showConnections; },
    toggleCollisions(state) { state.showCollisions = !state.showCollisions; },
    toggleLayerActors(state) { state.layerActors = !state.layerActors; },
    toggleLayerTriggers(state) { state.layerTriggers = !state.layerTriggers; },
    toggleLayerCollisions(state) { state.layerCollisions = !state.layerCollisions; },
    toggleLayerBackground(state) { state.layerBackground = !state.layerBackground; },

    setPreviewPlaying(state, action: PayloadAction<boolean>) {
      state.previewPlaying = action.payload;
    },
    setModified(state, action: PayloadAction<boolean>) {
      state.isModified = action.payload;
    },
    setClipboard(state, action: PayloadAction<unknown>) {
      state.clipboard = action.payload;
    },
    setCanUndo(state, action: PayloadAction<boolean>) {
      state.canUndo = action.payload;
    },
    setCanRedo(state, action: PayloadAction<boolean>) {
      state.canRedo = action.payload;
    },
  },
});

export const editorActions = editorSlice.actions;
export const editorReducer = editorSlice.reducer;
export default editorSlice;
