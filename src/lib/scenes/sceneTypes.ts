// ============================================================
// MD Studio - sceneTypes.ts
// Tipos de cena adaptados do GB Studio para o Sega Mega Drive
// Referencia: https://www.gbstudio.dev/docs/project-editor/scenes/types
// ============================================================

// ---------------------------
// Enum dos tipos de cena
// ---------------------------
export type MDSceneType =
  | 'topdown'       // Top Down 2D - RPG/overworld com grid de tiles
  | 'logo'          // Logo/Splash - tela de titulo com tiles extras
  | 'platformer'    // Plataforma side-scrolling com fisica SGDK
  | 'adventure'     // Top-down livre, sem grid (beat-em-up / action)
  | 'pointandclick' // Cursor-driven, aventura grafica
  | 'shmup';        // Shoot Em Up - shooter horizontal ou vertical

// ---------------------------
// Descricoes dos tipos
// ---------------------------
export interface MDSceneTypeInfo {
  id: MDSceneType;
  label: string;
  description: string;
  supportsPlayer: boolean;
  supportsActors: boolean;
  supportsTriggers: boolean;
  supportsScroll: boolean;
  defaultScrollMode: 'none' | 'horizontal' | 'vertical' | 'both';
  playerMoveType: 'grid' | 'free' | 'physics' | 'cursor' | 'shooter';
  sgdkNotes: string;
}

export const MD_SCENE_TYPES: Record<MDSceneType, MDSceneTypeInfo> = {
  topdown: {
    id: 'topdown',
    label: 'Top Down 2D',
    description: 'RPG e overworld com movimento em grid de tiles. O jogador move em passos de 8px (1 tile). Interacao com atores ao pressionar botao A. Triggers ativam ao entrar/sair da zona.',
    supportsPlayer: true,
    supportsActors: true,
    supportsTriggers: true,
    supportsScroll: true,
    defaultScrollMode: 'both',
    playerMoveType: 'grid',
    sgdkNotes: 'Usa SPR_update() por frame. Scroll via VDP_setHorizontalScroll / VDP_setVerticalScroll. Movimento em passos de MD_TILE_SIZE (8px).',
  },
  logo: {
    id: 'logo',
    label: 'Logo / Tela de Titulo',
    description: 'Tela de titulo, splash screen ou qualquer exibicao estatica. Sem jogador controlavel. Permite backgrounds mais complexos com mais tiles unicos, ideal para artes detalhadas.',
    supportsPlayer: false,
    supportsActors: false,
    supportsTriggers: false,
    supportsScroll: false,
    defaultScrollMode: 'none',
    playerMoveType: 'cursor',
    sgdkNotes: 'Usa VDP_drawImageEx() para exibir tiles sem limite de sprites. Sem loop de update de jogador. Ideal para intro e tela de game over.',
  },
  platformer: {
    id: 'platformer',
    label: 'Plataforma',
    description: 'Nivel de plataforma side-scrolling ou vertical. Controle detalhado de fisica: aceleracao, velocidade, gravidade. Suporta corrida, pulo duplo, wall jump, flutuacao, dash e escadas.',
    supportsPlayer: true,
    supportsActors: true,
    supportsTriggers: true,
    supportsScroll: true,
    defaultScrollMode: 'horizontal',
    playerMoveType: 'physics',
    sgdkNotes: 'Requer logica de gravidade manual no SGDK. Usa SPR_update() e deteccao de colisao por bitmask de tiles. Scroll horizontal via VDP_setHorizontalScroll().',
  },
  adventure: {
    id: 'adventure',
    label: 'Adventure (Top-Down Livre)',
    description: 'Top-down com movimento livre, sem grid. Semelhante ao Top Down 2D porem mais fluido. Suporta movimento diagonal, restricao a 4 direcoes, e modo beat-em-up (apenas horizontal).',
    supportsPlayer: true,
    supportsActors: true,
    supportsTriggers: true,
    supportsScroll: true,
    defaultScrollMode: 'both',
    playerMoveType: 'free',
    sgdkNotes: 'Movimento em pixels (nao grid). Colisao por deteccao de bitmask de tiles. Scroll sincronizado com posicao do jogador. Suporta restricao de direcao: 4-way ou horizontal only.',
  },
  pointandclick: {
    id: 'pointandclick',
    label: 'Point and Click',
    description: 'Aventura grafica com cursor. O personagem jogador funciona como cursor de selecao. Pressionar A interage com triggers na cena. Sem movimento direto do personagem.',
    supportsPlayer: true,
    supportsActors: true,
    supportsTriggers: true,
    supportsScroll: false,
    defaultScrollMode: 'none',
    playerMoveType: 'cursor',
    sgdkNotes: 'Jogador controlado como cursor via JOY_readJoypad(). Sem fisica. Deteccao de sobreposicao com triggers por coordenadas de cursor. Ideal para jogos de aventura/puzzle.',
  },
  shmup: {
    id: 'shmup',
    label: "Shoot 'Em Up",
    description: 'Shooter classico horizontal ou vertical. A direcao do scroll e definida pela direcao inicial do jogador ao entrar na cena. Suporta lock de movimento na borda da tela ou movimento livre.',
    supportsPlayer: true,
    supportsActors: true,
    supportsTriggers: false,
    supportsScroll: true,
    defaultScrollMode: 'horizontal',
    playerMoveType: 'shooter',
    sgdkNotes: 'Scroll automatico via VDP_setHorizontalScroll/setVerticalScroll por frame. Spawn de inimigos por lista de eventos. Colisao de projéteis via bounding box. Direcao determinada por playerStartDirection.',
  },
};

// ---------------------------
// Helpers
// ---------------------------

/** Retorna todas as informacoes de um tipo de cena */
export function getSceneTypeInfo(type: MDSceneType): MDSceneTypeInfo {
  return MD_SCENE_TYPES[type];
}

/** Retorna o label (nome amigavel) de um tipo de cena */
export function getSceneTypeLabel(type: MDSceneType): string {
  return MD_SCENE_TYPES[type].label;
}

/** Lista de todos os tipos de cena para uso em selects */
export const SCENE_TYPE_OPTIONS = Object.values(MD_SCENE_TYPES).map((t) => ({
  value: t.id,
  label: t.label,
  description: t.description,
}));

/** Verifica se o tipo de cena suporta o jogador */
export function sceneTypeSupportsPlayer(type: MDSceneType): boolean {
  return MD_SCENE_TYPES[type].supportsPlayer;
}

/** Verifica se o tipo de cena suporta atores */
export function sceneTypeSupportsActors(type: MDSceneType): boolean {
  return MD_SCENE_TYPES[type].supportsActors;
}

/** Retorna o modo de scroll padrao para o tipo de cena */
export function getDefaultScrollMode(
  type: MDSceneType
): 'none' | 'horizontal' | 'vertical' | 'both' {
  return MD_SCENE_TYPES[type].defaultScrollMode;
}
