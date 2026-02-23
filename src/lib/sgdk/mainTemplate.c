/**
 * mainTemplate.c
 * MD Studio - Template base para projetos Mega Drive (SGDK)
 *
 * Este arquivo e o ponto de entrada de todo jogo gerado pelo MD Studio.
 * A IA completa as funcoes scene_X_init() e scene_X_update()
 * com base no projeto criado no editor visual.
 *
 * Para compilar:
 *   make -f $SGDK/makefile.gen
 *
 * Output: out/rom.bin
 */

#include <genesis.h>
#include "game_data.h"

/* ==================================================
 * CONSTANTES DO HARDWARE MEGA DRIVE
 * ==================================================
 * Mega Drive / Genesis:
 * - Resolucao: 320x224 pixels (modo H40)
 * - VDP: 2 planos de fundo (A e B) + 1 plano de janela (W)
 * - Sprites: ate 80 simultaneos, tamanho de 8x8 a 32x32
 * - Paletas: 4 paletas de 16 cores cada (64 cores simultaneas)
 * - CPU: Motorola 68000 a 7.67 MHz
 * - Som: YM2612 (FM 6 canais) + SN76489 PSG (4 canais)
 * ================================================== */

#define MD_SCREEN_W     320
#define MD_SCREEN_H     224
#define MD_TILE_SIZE    8
#define MD_MAX_SPRITES  80
#define MD_PALETTE_COUNT 4
#define MD_COLORS_PER_PAL 16

/* ==================================================
 * VARIAVEIS GLOBAIS
 * Declaradas aqui, definidas em game_data.h
 * ================================================== */

/* Array de sprites (atores, inimigos, objetos) */
Sprite* sprites[MD_MAX_SPRITES];

/* Indice da cena atual */
u8 currentScene = 0;

/* Variaveis do jogo (geradas pela IA com base no projeto) */
/* [MD_STUDIO: VARIABLES_PLACEHOLDER] */

/* ==================================================
 * DECLARACOES DAS FUNCOES DE CENA
 * Cada cena do editor gera um par init/update
 * ================================================== */

/* [MD_STUDIO: SCENE_DECLARATIONS_PLACEHOLDER] */
/* Exemplo:
 *   void scene_fase1_init(void);
 *   void scene_fase1_update(void);
 */

/* ==================================================
 * CALLBACK DE INPUT
 * JOY_init registra esta funcao para ser chamada
 * automaticamente quando um botao e pressionado
 * ================================================== */
void inputHandler(u16 joy, u16 changed, u16 state) {
    /* Botoes disponiveis no Mega Drive:
     * BUTTON_A, BUTTON_B, BUTTON_C  (botoes principais)
     * BUTTON_X, BUTTON_Y, BUTTON_Z  (botoes do controle de 6 botoes)
     * BUTTON_START, BUTTON_MODE
     * BUTTON_UP, BUTTON_DOWN, BUTTON_LEFT, BUTTON_RIGHT
     */

    /* [MD_STUDIO: INPUT_HANDLER_PLACEHOLDER] */
    /* Exemplo:
     * if (joy == JOY_1) {
     *     if (state & BUTTON_RIGHT)
     *         SPR_setPosition(sprites[0], sprites[0]->x + 2, sprites[0]->y);
     * }
     */
}

/* ==================================================
 * FUNCAO PRINCIPAL
 * Ponto de entrada do jogo no Mega Drive
 * ================================================== */
int main(bool hardReset) {

    /* --- Inicializacao do sistema --- */

    /* Inicializa o VDP (Video Display Processor)
     * Define resolucao 320x224 (H40) */
    VDP_setScreenWidth320();

    /* Inicializa o sistema de sprites */
    SPR_init();

    /* Inicializa o sistema de som XGM2
     * XGM2 gerencia o YM2612 (FM) e o PSG simultaneamente */
    XGM2_init();

    /* Registra o handler de input */
    JOY_init();
    JOY_setEventHandler(inputHandler);

    /* --- Carrega a primeira cena --- */
    /* [MD_STUDIO: FIRST_SCENE_INIT_PLACEHOLDER] */
    /* Exemplo: scene_fase1_init(); */

    /* ==================================================
     * GAME LOOP PRINCIPAL
     * Roda indefinidamente a ~60fps (NTSC) ou ~50fps (PAL)
     * SYS_doVBlankProcess() sincroniza com o VBlank do hardware
     * ================================================== */
    while (TRUE) {

        /* Atualiza a cena atual */
        /* [MD_STUDIO: SCENE_UPDATE_PLACEHOLDER] */
        /* Exemplo:
         * if (currentScene == 0) scene_fase1_update();
         */

        /* Atualiza todos os sprites na VRAM */
        SPR_update();

        /* Aguarda o VBlank e processa callbacks
         * Isso garante 60fps estavel e sincronizacao com o hardware */
        SYS_doVBlankProcess();
    }

    return 0;
}
