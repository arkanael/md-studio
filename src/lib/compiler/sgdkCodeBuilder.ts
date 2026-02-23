/**
 * sgdkCodeBuilder.ts
 * MD Studio — Gerador de codigo C para SGDK (Sega Mega Drive)
 *
 * Este modulo substitui o scriptBuilder do GB Studio.
 * Em vez de emitir bytecode GBVM, emite codigo C valido para o SGDK.
 *
 * Cada evento visual do editor chama metodos desta classe,
 * que acumula as linhas de codigo e exporta o arquivo .c final.
 */

export interface SGDKActor {
  id: string;
  name: string;
  spriteIndex: number;
  x: number;
  y: number;
  paletteIndex: number;
}

export interface SGDKScene {
  id: string;
  name: string;
  width: number;
  height: number;
  actors: SGDKActor[];
  collisions: number[];
}

export class SGDKCodeBuilder {
  private lines: string[] = [];
  private indentLevel: number = 0;
  private includes: Set<string> = new Set();
  private scene: SGDKScene | null = null;

  constructor(scene?: SGDKScene) {
    this.scene = scene || null;
    // Include padrao do SGDK
    this.includes.add('#include <genesis.h>');
  }

  // -----------------------------------------------
  // CONTROLE DE INDENTACAO
  // -----------------------------------------------

  indent(): void {
    this.indentLevel++;
  }

  dedent(): void {
    if (this.indentLevel > 0) this.indentLevel--;
  }

  private pad(): string {
    return '    '.repeat(this.indentLevel);
  }

  // -----------------------------------------------
  // EMISSAO DE LINHAS
  // -----------------------------------------------

  emitLine(line: string): void {
    this.lines.push(`${this.pad()}${line}`);
  }

  emitBlankLine(): void {
    this.lines.push('');
  }

  emitComment(comment: string): void {
    this.lines.push(`${this.pad()}// ${comment}`);
  }

  emitBlockComment(comment: string): void {
    this.lines.push(`${this.pad()}/* ${comment} */`);
  }

  // -----------------------------------------------
  // ATORES / SPRITES
  // -----------------------------------------------

  /**
   * Move um ator para a posicao (x, y) em tiles
   * Equivalente ao EVENT_ACTOR_MOVE_TO do GB Studio
   */
  actorMoveTo(actorId: string, x: number, y: number): void {
    this.emitComment(`Mover ator '${actorId}' para (${x}, ${y})`);
    this.emitLine(`SPR_setPosition(sprites[${actorId}], ${x} * 8, ${y} * 8);`);
    this.emitLine(`SPR_update();`);
  }

  /**
   * Define a posicao de um ator instantaneamente (sem animacao)
   * Equivalente ao EVENT_ACTOR_SET_POSITION do GB Studio
   */
  actorSetPosition(actorId: string, x: number, y: number): void {
    this.emitComment(`Definir posicao do ator '${actorId}' para (${x}, ${y})`);
    this.emitLine(`SPR_setPosition(sprites[${actorId}], ${x} * 8, ${y} * 8);`);
  }

  /**
   * Mostra um ator na tela
   * Equivalente ao EVENT_ACTOR_SHOW do GB Studio
   */
  actorShow(actorId: string): void {
    this.emitComment(`Mostrar ator '${actorId}'`);
    this.emitLine(`SPR_setVisibility(sprites[${actorId}], VISIBLE);`);
  }

  /**
   * Oculta um ator da tela
   * Equivalente ao EVENT_ACTOR_HIDE do GB Studio
   */
  actorHide(actorId: string): void {
    this.emitComment(`Ocultar ator '${actorId}'`);
    this.emitLine(`SPR_setVisibility(sprites[${actorId}], HIDDEN);`);
  }

  /**
   * Define a animacao de um ator
   * Equivalente ao EVENT_ACTOR_SET_FRAME do GB Studio
   */
  actorSetAnim(actorId: string, animIndex: number): void {
    this.emitComment(`Definir animacao ${animIndex} para o ator '${actorId}'`);
    this.emitLine(`SPR_setAnim(sprites[${actorId}], ${animIndex});`);
  }

  // -----------------------------------------------
  // INPUT DO JOGADOR (Mega Drive: A,B,C,X,Y,Z,Start,Mode)
  // -----------------------------------------------

  /**
   * Verifica se um botao esta pressionado e executa um bloco
   * Equivalente ao EVENT_IF_INPUT do GB Studio
   */
  ifInput(button: string, thenCallback: () => void): void {
    const buttonMap: Record<string, string> = {
      a: 'BUTTON_A',
      b: 'BUTTON_B',
      c: 'BUTTON_C',
      x: 'BUTTON_X',
      y: 'BUTTON_Y',
      z: 'BUTTON_Z',
      start: 'BUTTON_START',
      mode: 'BUTTON_MODE',
      up: 'BUTTON_UP',
      down: 'BUTTON_DOWN',
      left: 'BUTTON_LEFT',
      right: 'BUTTON_RIGHT',
    };
    const sgdkButton = buttonMap[button.toLowerCase()] || 'BUTTON_A';
    this.emitLine(`if (joy & ${sgdkButton}) {`);
    this.indent();
    thenCallback();
    this.dedent();
    this.emitLine(`}`);
  }

  /**
   * Emite a leitura do joystick no inicio do update
   */
  readJoypad(player: number = 1): void {
    this.emitComment(`Leitura do controle do jogador ${player}`);
    this.emitLine(`u16 joy = JOY_readJoypad(JOY_${player});`);
  }

  // -----------------------------------------------
  // VARIAVEIS
  // -----------------------------------------------

  /**
   * Declara e define o valor de uma variavel
   * Equivalente ao EVENT_VARIABLE_SET_TO_VALUE do GB Studio
   */
  variableSetValue(varName: string, value: number): void {
    this.emitComment(`Definir variavel '${varName}' = ${value}`);
    this.emitLine(`${varName} = ${value};`);
  }

  /**
   * Incrementa uma variavel
   * Equivalente ao EVENT_VARIABLE_INC do GB Studio
   */
  variableInc(varName: string): void {
    this.emitLine(`${varName}++;  // Incrementar '${varName}'`);
  }

  /**
   * Decrementa uma variavel
   * Equivalente ao EVENT_VARIABLE_DEC do GB Studio
   */
  variableDec(varName: string): void {
    this.emitLine(`${varName}--;  // Decrementar '${varName}'`);
  }

  /**
   * Condicional: se variavel == valor
   * Equivalente ao EVENT_IF_VARIABLE_VALUE do GB Studio
   */
  ifVariableEquals(
    varName: string,
    value: number,
    thenCallback: () => void,
    elseCallback?: () => void
  ): void {
    this.emitLine(`if (${varName} == ${value}) {`);
    this.indent();
    thenCallback();
    this.dedent();
    if (elseCallback) {
      this.emitLine(`} else {`);
      this.indent();
      elseCallback();
      this.dedent();
    }
    this.emitLine(`}`);
  }

  // -----------------------------------------------
  // CONTROLE DE FLUXO
  // -----------------------------------------------

  /**
   * Aguarda um numero de frames
   * Equivalente ao EVENT_WAIT do GB Studio
   */
  wait(frames: number): void {
    this.emitComment(`Aguardar ${frames} frame(s)`);
    this.emitLine(`{`);
    this.indent();
    this.emitLine(`u16 _waitFrames = ${frames};`);
    this.emitLine(`while (_waitFrames--) SYS_doVBlankProcess();`);
    this.dedent();
    this.emitLine(`}`);
  }

  /**
   * Loop infinito (game loop)
   * Equivalente ao EVENT_LOOP do GB Studio
   */
  loopStart(): void {
    this.emitLine(`while (TRUE) {`);
    this.indent();
  }

  loopEnd(): void {
    this.dedent();
    this.emitLine(`}`);
  }

  // -----------------------------------------------
  // CENAS
  // -----------------------------------------------

  /**
   * Troca de cena
   * Equivalente ao EVENT_SCENE_SWITCH do GB Studio
   */
  sceneSwitch(sceneId: string): void {
    this.emitComment(`Trocar para cena '${sceneId}'`);
    this.emitLine(`scene_${sceneId}_init();`);
  }

  // -----------------------------------------------
  // SOM
  // -----------------------------------------------

  /**
   * Toca um efeito sonoro
   * Equivalente ao EVENT_SOUND_PLAY_EFFECT do GB Studio
   */
  soundPlay(soundId: string): void {
    this.emitComment(`Tocar som '${soundId}'`);
    this.emitLine(`XGM_setPCM(${soundId.toUpperCase()}_PCM_ID, ${soundId}_pcm, sizeof(${soundId}_pcm));`);
    this.emitLine(`XGM_startPlayPCM(${soundId.toUpperCase()}_PCM_ID, 1, SOUND_PCM_CH2);`);
  }

  /**
   * Toca uma musica de fundo
   * Equivalente ao EVENT_MUSIC_PLAY do GB Studio
   */
  musicPlay(musicId: string): void {
    this.emitComment(`Tocar musica '${musicId}'`);
    this.emitLine(`XGM_startPlay(${musicId}_xgm);`);
  }

  musicStop(): void {
    this.emitLine(`XGM_stopPlay();  // Parar musica`);
  }

  // -----------------------------------------------
  // GERACAO DO ARQUIVO FINAL
  // -----------------------------------------------

  /**
   * Gera o codigo C completo do arquivo
   * Retorna uma string pronta para ser salva como .c
   */
  build(): string {
    const header = [
      `/**`,
      ` * Gerado pelo MD Studio`,
      ` * https://github.com/arkanael/md-studio`,
      ` *`,
      ` * ATENCAO: Este arquivo foi gerado automaticamente.`,
      ` * Voce pode editar livremente — as alteracoes serao preservadas`,
      ` * enquanto voce nao regenerar o projeto no editor.`,
      ` */`,
      ``,
      ...[...this.includes],
      ``,
    ];

    return [...header, ...this.lines].join('\n');
  }

  /**
   * Limpa o builder para reutilizacao
   */
  reset(): void {
    this.lines = [];
    this.indentLevel = 0;
  }
}

export default SGDKCodeBuilder;
