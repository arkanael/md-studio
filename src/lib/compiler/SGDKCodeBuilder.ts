// -------------------------------------------------
// SGDKCodeBuilder.ts - Gerador de codigo C para SGDK
// Converte os dados visuais do editor MD Studio
// em codigo C compilavel com o SGDK do Mega Drive
// -------------------------------------------------

import { Scene } from '../../../store/features/entities/entitiesTypes';

/**
 * Gera o codigo C principal do jogo para SGDK.
 * Cada cena gera funcoes de inicializacao, update e eventos.
 */
export function generateSGDKCode(scenes: Scene[], projectName: string): string {
  const sanitized = projectName.replace(/[^a-zA-Z0-9_]/g, '_');

  let code = '';
  code += `/* =================================================\n`;
  code += ` * ${projectName} - Gerado automaticamente pelo MD Studio\n`;
  code += ` * Editor visual para Mega Drive / SGDK\n`;
  code += ` * Nao edite este arquivo diretamente!\n`;
  code += ` * Data: ${new Date().toLocaleString('pt-BR')}\n`;
  code += ` * ================================================= */\n\n`;

  // Includes SGDK
  code += `#include <genesis.h>\n`;
  code += `#include "resources.h"\n\n`;

  // Defines de resolucao
  code += `/* Resolucao padrao Sega Mega Drive */\n`;
  code += `#define SCREEN_WIDTH   320\n`;
  code += `#define SCREEN_HEIGHT  224\n`;
  code += `#define TILE_SIZE      8\n\n`;

  // Variavel de cena atual
  code += `/* Indice da cena atual */\n`;
  code += `static u8 currentScene = 0;\n\n`;

  // Variaveis do projeto
  code += `/* Variaveis do jogo */\n`;
  code += `static s16 playerX = 0;\n`;
  code += `static s16 playerY = 0;\n`;
  code += `static u8 score = 0;\n`;
  code += `static u8 lives = 3;\n\n`;

  // Gera funcoes para cada cena
  scenes.forEach((scene, index) => {
    const sceneName = scene.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    const sceneEnum = `SCENE_${sceneName.toUpperCase()}`;

    code += `/* ----- Cena ${index}: ${scene.name} ----- */\n`;
    code += `/* Dimensoes: ${scene.width} x ${scene.height} tiles */\n`;
    code += `/* Tipo: ${scene.type} */\n\n`;

    // Mapa de colisao
    if (scene.collisions && scene.collisions.length > 0) {
      code += `/* Mapa de colisao da cena ${index} */\n`;
      code += `static const u8 ${sceneName}_collisions[${scene.width * scene.height}] = {\n    `;
      const rows: string[] = [];
      for (let y = 0; y < scene.height; y++) {
        const row: string[] = [];
        for (let x = 0; x < scene.width; x++) {
          const idx = y * scene.width + x;
          row.push(String(scene.collisions[idx] || 0));
        }
        rows.push(row.join(', '));
      }
      code += rows.join(',\n    ');
      code += `\n};\n\n`;
    }

    // Funcao de inicializacao da cena
    code += `void init_${sceneName}() {\n`;
    code += `    /* Limpa os planos */\n`;
    code += `    VDP_clearPlane(BG_A, TRUE);\n`;
    code += `    VDP_clearPlane(BG_B, TRUE);\n\n`;

    // Configura o plano com background
    if (scene.backgroundId) {
      code += `    /* Carrega o background */\n`;
      code += `    VDP_loadTileSet(&bg_${sceneName}, TILE_USERINDEX, DMA);\n`;
      code += `    VDP_setTileMapExByIndex(BG_A, &map_${sceneName}, 0, 0, ${scene.width}, ${scene.height}, 0, CPU);\n\n`;
    }

    // Posicao inicial do jogador
    code += `    /* Posicao inicial */\n`;
    code += `    playerX = ${Math.floor(scene.width / 2) * 8};\n`;
    code += `    playerY = ${Math.floor(scene.height / 2) * 8};\n\n`;

    // Configura SPR_init se houver atores
    if (scene.actors.length > 0) {
      code += `    /* Inicializa sprites */\n`;
      code += `    SPR_init();\n`;
      code += `    /* ${scene.actors.length} ator(es) nesta cena */\n`;
      scene.actors.forEach((actorId, ai) => {
        code += `    /* Ator ${ai}: ${actorId} */\n`;
        code += `    // SPR_addSprite(&spr_${actorId}, 0, 0, TILE_ATTR(PAL1, FALSE, FALSE, FALSE));\n`;
      });
      code += `\n`;
    }

    code += `}\n\n`;

    // Funcao de update da cena
    code += `void update_${sceneName}() {\n`;
    code += `    u16 joy = JOY_readJoypad(JOY_1);\n\n`;

    if (scene.type === 'platformer') {
      code += `    /* Controles de plataforma */\n`;
      code += `    if (joy & BUTTON_RIGHT) playerX += 2;\n`;
      code += `    if (joy & BUTTON_LEFT)  playerX -= 2;\n`;
      code += `    if (joy & BUTTON_A)     playerY -= 4; /* pulo */\n\n`;
      code += `    /* Gravidade simples */\n`;
      code += `    playerY += 2;\n\n`;
    } else if (scene.type === 'topdown') {
      code += `    /* Controles top-down */\n`;
      code += `    if (joy & BUTTON_RIGHT) playerX += 2;\n`;
      code += `    if (joy & BUTTON_LEFT)  playerX -= 2;\n`;
      code += `    if (joy & BUTTON_UP)    playerY -= 2;\n`;
      code += `    if (joy & BUTTON_DOWN)  playerY += 2;\n\n`;
    } else if (scene.type === 'shooter') {
      code += `    /* Controles shoot em up */\n`;
      code += `    if (joy & BUTTON_RIGHT) playerX += 3;\n`;
      code += `    if (joy & BUTTON_LEFT)  playerX -= 3;\n`;
      code += `    if (joy & BUTTON_UP)    playerY -= 3;\n`;
      code += `    if (joy & BUTTON_DOWN)  playerY += 3;\n`;
      code += `    if (joy & BUTTON_A)     /* Disparar */;\n\n`;
    }

    code += `    /* Limites da tela */\n`;
    code += `    if (playerX < 0)  playerX = 0;\n`;
    code += `    if (playerX > ${scene.width * 8 - 16}) playerX = ${scene.width * 8 - 16};\n`;
    code += `    if (playerY < 0)  playerY = 0;\n`;
    code += `    if (playerY > ${scene.height * 8 - 16}) playerY = ${scene.height * 8 - 16};\n\n`;

    // Triggers
    if (scene.triggers && scene.triggers.length > 0) {
      code += `    /* Triggers da cena */\n`;
      scene.triggers.forEach((triggerId, ti) => {
        code += `    /* Trigger ${ti}: ${triggerId} */\n`;
      });
      code += `\n`;
    }

    code += `}\n\n`;
  });

  // Funcao principal main()
  code += `/* ===== Funcao principal ===== */\n`;
  code += `int main() {\n`;
  code += `    /* Inicializacao do sistema */\n`;
  code += `    JOY_init();\n`;
  code += `    VDP_setScreenWidth320();\n`;
  code += `    VDP_setPlaneSize(64, 32, TRUE);\n\n`;

  if (scenes.length > 0) {
    const firstScene = scenes[0].name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    code += `    /* Inicializa primeira cena */\n`;
    code += `    init_${firstScene}();\n\n`;
  }

  code += `    /* Loop principal do jogo */\n`;
  code += `    while(TRUE) {\n`;
  code += `        /* Sincroniza com VBlank */\n`;
  code += `        SYS_doVBlankProcess();\n\n`;

  if (scenes.length > 0) {
    code += `        /* Atualiza cena atual */\n`;
    code += `        switch(currentScene) {\n`;
    scenes.forEach((scene, index) => {
      const sceneName = scene.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      code += `            case ${index}: update_${sceneName}(); break;\n`;
    });
    code += `        }\n\n`;
  }

  code += `        /* Atualiza sprites */\n`;
  code += `        SPR_update();\n`;
  code += `    }\n\n`;
  code += `    return 0;\n`;
  code += `}\n`;

  return code;
}

/**
 * Gera o arquivo resources.h com as declaracoes dos recursos.
 */
export function generateResourcesHeader(scenes: Scene[], projectName: string): string {
  let code = `#ifndef RESOURCES_H\n#define RESOURCES_H\n\n`;
  code += `/* Recursos gerados para ${projectName} */\n\n`;

  scenes.forEach((scene) => {
    const sceneName = scene.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    if (scene.backgroundId) {
      code += `extern const TileSet bg_${sceneName};\n`;
      code += `extern const TileMap map_${sceneName};\n`;
    }
    scene.actors.forEach((actorId) => {
      code += `extern const SpriteDefinition spr_${actorId};\n`;
    });
  });

  code += `\n#endif /* RESOURCES_H */\n`;
  return code;
}
