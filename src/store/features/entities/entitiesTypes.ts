// ============================================================
// MD Studio - entitiesTypes.ts
// Tipos das entidades do editor, adaptados do GB Studio
// para o hardware do Sega Mega Drive / SGDK
// ============================================================

// ---------------------------
// Constantes do Mega Drive
// ---------------------------
export const MD_SCREEN_WIDTH = 320;   // pixels (modo H40)
export const MD_SCREEN_HEIGHT = 224;  // pixels (modo V28)
export const MD_TILE_SIZE = 8;        // tiles de 8x8 px
export const MD_TILES_X = 40;         // 320 / 8
export const MD_TILES_Y = 28;         // 224 / 8
export const MD_MAX_SPRITES = 80;     // limite HW do VDP
export const MD_PALETTE_COLORS = 16;  // cores por paleta
export const MD_NUM_PALETTES = 4;     // PAL0..PAL3
export const MD_MAX_PLANES = 2;       // Plano A e Plano B

// ---------------------------
// IDs
// ---------------------------
export type EntityId = string;

// ---------------------------
// Posição
// ---------------------------
export interface Position {
  x: number; // em tiles
  y: number; // em tiles
}

export interface PixelPosition {
  x: number; // em pixels
  y: number; // em pixels
}

// ---------------------------
// Direção do ator
// ---------------------------
export type ActorDirection = 'down' | 'up' | 'left' | 'right';

// ---------------------------
// Paleta de cores Mega Drive
// Cada paleta tem 16 cores no formato #RRGGBB
// ---------------------------
export interface MDPalette {
  id: EntityId;
  name: string;
  colors: string[]; // 16 strings hex, ex: ["#000000", "#FF0000", ...]
}

// ---------------------------
// Tile de colisão
// Baseado nos flags do GB Studio, adaptado para MD
// ---------------------------
export type CollisionTileType =
  | 'none'
  | 'solid'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'ladder'
  | 'slope_up'
  | 'slope_down';

export interface CollisionTile {
  x: number;
  y: number;
  type: CollisionTileType;
}

// ---------------------------
// Sprite / Ator
// Representa um sprite do Mega Drive
// ---------------------------
export interface MDSprite {
  id: EntityId;
  name: string;
  filename: string;     // caminho relativo ao assets/sprites/
  width: number;        // em pixels (multiplo de 8)
  height: number;       // em pixels (multiplo de 8)
  paletteId: EntityId;  // qual paleta usa
  animationFrames: number;
  animations: MDAnimation[];
}

export interface MDAnimation {
  id: EntityId;
  name: string;         // ex: "idle_down", "walk_up"
  frames: number[];     // indices dos frames no sprite sheet
  speed: number;        // frames por segundo
  loop: boolean;
}

// ---------------------------
// Ator (instância de sprite na cena)
// Equivale ao Actor do GB Studio
// ---------------------------
export interface MDActor {
  id: EntityId;
  name: string;
  x: number;                   // posição em tiles
  y: number;                   // posição em tiles
  spriteId: EntityId;
  direction: ActorDirection;
  moveSpeed: number;           // pixels por frame
  animSpeed: number;           // velocidade de animação
  paletteId: EntityId;
  collisionGroup: string;      // ex: 'player', 'enemy', 'npc'
  isPersistent: boolean;       // persiste entre cenas?
  script: MDScriptEvent[];     // script de interação
  startScript: MDScriptEvent[];// script ao iniciar cena
  updateScript: MDScriptEvent[];// script a cada frame (UPDATE)
  hitScript: MDScriptEvent[];  // script ao receber dano
}

// ---------------------------
// Trigger (zona de gatilho)
// ---------------------------
export interface MDTrigger {
  id: EntityId;
  name: string;
  x: number;
  y: number;
  width: number;   // em tiles
  height: number;  // em tiles
  script: MDScriptEvent[];
}

// ---------------------------
// Background (fundo / tilemap)
// Equivale ao Background do GB Studio
// ---------------------------
export interface MDBackground {
  id: EntityId;
  name: string;
  filename: string;       // caminho relativo a assets/backgrounds/
  width: number;          // em tiles
  height: number;         // em tiles
  paletteIds: EntityId[]; // até 4 paletas usadas
  tileData: number[];     // dados do tilemap (indices)
  plane: 'A' | 'B';      // Plano A (foreground) ou B (background)
}

// ---------------------------
// Cena
// Equivale ao Scene do GB Studio, adaptado para MD
// ---------------------------
export interface MDScene {
  id: EntityId;
  name: string;
  backgroundId: EntityId;
  width: number;             // em tiles
  height: number;            // em tiles
  paletteIds: EntityId[];    // paletas da cena
  actors: MDActor[];
  triggers: MDTrigger[];
  collisions: CollisionTile[];
  playerStartX: number;
  playerStartY: number;
  playerStartDirection: ActorDirection;
  script: MDScriptEvent[];   // script ao entrar na cena
  playerHitScript: MDScriptEvent[];
  musicId?: EntityId;
  // Configurações específicas do MD
  scrollX: boolean;          // scroll horizontal?
  scrollY: boolean;          // scroll vertical?
  planeAId?: EntityId;       // background no Plano A
  planeBId?: EntityId;       // background no Plano B (parallax)
}

// ---------------------------
// Evento de script
// Equivale ao ScriptEvent do GB Studio
// ---------------------------
export interface MDScriptEvent {
  id: EntityId;
  command: string;           // ex: 'EVENT_ACTOR_MOVE_TO'
  args: Record<string, unknown>;
  children?: Record<string, MDScriptEvent[]>; // blocos true/false
}

// ---------------------------
// Variável do jogo
// ---------------------------
export interface MDVariable {
  id: EntityId;
  name: string;              // ex: 'pontuacao', 'vidas'
  defaultValue: number;      // valor inicial
  isGlobal: boolean;         // global ou local da cena?
}

// ---------------------------
// Musica (arquivo XGM para SGDK)
// ---------------------------
export interface MDMusic {
  id: EntityId;
  name: string;
  filename: string;          // caminho relativo a assets/music/
  type: 'xgm' | 'vgm';      // formato suportado pelo SGDK
}

// ---------------------------
// Efeito Sonoro (arquivo PCM/WAV)
// ---------------------------
export interface MDSoundEffect {
  id: EntityId;
  name: string;
  filename: string;
  type: 'pcm' | 'wav';
}

// ---------------------------
// Projeto completo
// Equivale ao ProjectData do GB Studio
// ---------------------------
export interface MDProject {
  name: string;
  version: string;           // versao do MD Studio
  targetSystem: 'megadrive'; // apenas Mega Drive por enquanto
  videoMode: 'NTSC' | 'PAL';
  startSceneId: EntityId;
  startX: number;
  startY: number;
  startDirection: ActorDirection;
  scenes: MDScene[];
  backgrounds: MDBackground[];
  sprites: MDSprite[];
  palettes: MDPalette[];
  variables: MDVariable[];
  music: MDMusic[];
  soundEffects: MDSoundEffect[];
  settings: MDProjectSettings;
}

// ---------------------------
// Configurações do projeto
// ---------------------------
export interface MDProjectSettings {
  customColors: boolean;      // usar paletas customizadas?
  windowPaletteId?: EntityId; // paleta para janelas de dialogo
  playerSpriteId: EntityId;   // sprite do jogador
  defaultPlayerPaletteId: EntityId;
  sgdkPath: string;           // caminho para o SGDK
  outputPath: string;         // pasta de saida do C gerado
  // Limites do hardware
  maxActorsPerScene: number;  // recomendado <= 20 para performance
  maxTriggersPerScene: number;
}
