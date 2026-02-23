/**
 * aiCodeGenerator.ts
 * MD Studio — Geracao de codigo C via Inteligencia Artificial
 *
 * Este modulo recebe o projeto JSON serializado do editor visual
 * e envia para um LLM (OpenAI GPT-4o ou Ollama local) que gera
 * o codigo C completo, comentado e pronto para o SGDK.
 *
 * Suporte a dois backends:
 * - OpenAI API (cloud, precisa de chave)
 * - Ollama (local, gratuito, offline)
 */

export interface MDProject {
  name: string;
  settings: {
    targetPlatform: 'megadrive';
    resolution: { width: 320; height: 224 };
    paletteCount: 4;
    colorsPerPalette: 16;
  };
  scenes: MDScene[];
  variables: MDVariable[];
}

export interface MDScene {
  id: string;
  name: string;
  width: number;
  height: number;
  tilemap: string;
  collisions: number[];
  actors: MDActor[];
  enemies: MDEnemy[];
  triggers: MDTrigger[];
}

export interface MDActor {
  id: string;
  name: string;
  x: number;
  y: number;
  sprite: string;
  paletteIndex: number;
  scripts: {
    onInit?: MDEvent[];
    onUpdate?: MDEvent[];
    onInteract?: MDEvent[];
  };
}

export interface MDEnemy {
  id: string;
  name: string;
  x: number;
  y: number;
  sprite: string;
  ai: 'patrol' | 'chase' | 'static';
  damage: number;
  health: number;
}

export interface MDTrigger {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scripts: { onEnter?: MDEvent[] };
}

export interface MDEvent {
  event: string;
  [key: string]: unknown;
}

export interface MDVariable {
  id: string;
  name: string;
  defaultValue: number;
}

export interface AIGeneratorConfig {
  backend: 'openai' | 'ollama';
  openaiApiKey?: string;
  openaiModel?: string;       // default: 'gpt-4o'
  ollamaUrl?: string;         // default: 'http://localhost:11434'
  ollamaModel?: string;       // default: 'qwen2.5-coder:7b'
  educationalMode?: boolean;  // se true, IA adiciona explicacoes didaticas no codigo
}

export interface AIGeneratorResult {
  success: boolean;
  files: {
    'src/main.c': string;
    'src/game_data.h': string;
    [filename: string]: string;
  };
  error?: string;
  tokensUsed?: number;
}

/**
 * Serializa o projeto para um prompt estruturado
 * que a IA consegue entender e gerar codigo correto
 */
function buildPrompt(project: MDProject, educationalMode: boolean): string {
  const projectJson = JSON.stringify(project, null, 2);

  return `Voce e um especialista em desenvolvimento de jogos para Sega Mega Drive usando o SGDK (Sega Genesis Development Kit).

Voce recebeu um projeto de jogo criado visualmente no MD Studio, serializado em JSON.
Sua tarefa e gerar o codigo C completo e funcional para compilar com o SGDK.

## Regras obrigatorias:
1. Use APENAS funcoes do SGDK (genesis.h)
2. Cada cena deve ter uma funcao scene_[nome]_init() e scene_[nome]_update()
3. Sprites devem ser inicializados com SPR_addSprite() e controlados via SPR_setPosition()
4. Colisoes devem verificar o array de tiles da cena
5. Input do jogador via JOY_readJoypad(JOY_1)
6. VBlank via SYS_doVBlankProcess() no final de cada frame
7. O codigo deve compilar sem erros com: make -f $SGDK/makefile.gen
${educationalMode ? '8. Adicione comentarios explicativos em PORTUGUES em cada bloco importante do codigo, explicando o que cada funcao do SGDK faz. Isso e para fins educacionais.' : ''}

## Estrutura de arquivos esperada:
- src/main.c (ponto de entrada, game loop principal)
- src/game_data.h (declaracoes de sprites, tilemaps, variaveis globais)

## Projeto JSON:
\`\`\`json
${projectJson}
\`\`\`

## Responda APENAS com os arquivos no formato:
### src/main.c
\`\`\`c
[codigo aqui]
\`\`\`

### src/game_data.h
\`\`\`c
[codigo aqui]
\`\`\``;
}

/**
 * Parseia a resposta da IA e extrai os arquivos gerados
 */
function parseAIResponse(response: string): Record<string, string> {
  const files: Record<string, string> = {};
  const fileRegex = /### (src\/[\w\/\.]+)\n```(?:c)?\n([\s\S]*?)```/g;
  let match;

  while ((match = fileRegex.exec(response)) !== null) {
    const filename = match[1].trim();
    const content = match[2].trim();
    files[filename] = content;
  }

  return files;
}

/**
 * Gera codigo C via OpenAI API
 */
async function generateWithOpenAI(
  prompt: string,
  config: AIGeneratorConfig
): Promise<string> {
  const model = config.openaiModel || 'gpt-4o';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openaiApiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Voce e um especialista em SGDK para Sega Mega Drive. Gere codigo C preciso e funcional.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,  // baixa temperatura para codigo mais deterministico
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Gera codigo C via Ollama (local, gratuito, offline)
 */
async function generateWithOllama(
  prompt: string,
  config: AIGeneratorConfig
): Promise<string> {
  const url = config.ollamaUrl || 'http://localhost:11434';
  const model = config.ollamaModel || 'qwen2.5-coder:7b';

  const response = await fetch(`${url}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.2,
        num_predict: 8000,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}. Certifique-se que o Ollama esta rodando em ${url}`);
  }

  const data = await response.json();
  return data.response;
}

/**
 * Funcao principal: recebe o projeto e retorna os arquivos C gerados
 *
 * Uso:
 *   const result = await generateCode(project, { backend: 'ollama', educationalMode: true });
 *   if (result.success) {
 *     console.log(result.files['src/main.c']);
 *   }
 */
export async function generateCode(
  project: MDProject,
  config: AIGeneratorConfig
): Promise<AIGeneratorResult> {
  try {
    const prompt = buildPrompt(project, config.educationalMode ?? false);
    let rawResponse: string;

    if (config.backend === 'openai') {
      if (!config.openaiApiKey) {
        throw new Error('OpenAI API key nao configurada. Va em Configuracoes > IA para adicionar sua chave.');
      }
      rawResponse = await generateWithOpenAI(prompt, config);
    } else {
      rawResponse = await generateWithOllama(prompt, config);
    }

    const files = parseAIResponse(rawResponse);

    if (Object.keys(files).length === 0) {
      throw new Error('A IA nao retornou arquivos validos. Tente novamente.');
    }

    return {
      success: true,
      files: files as AIGeneratorResult['files'],
    };
  } catch (error) {
    return {
      success: false,
      files: { 'src/main.c': '', 'src/game_data.h': '' },
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default generateCode;
