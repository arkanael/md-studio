# MD Studio

> Editor visual drag-and-drop para criação de jogos do **Sega Mega Drive** — inspirado no GB Studio, adaptado para o SGDK com geração de código C.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Mega%20Drive-orange.svg)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow.svg)
![Stack](https://img.shields.io/badge/stack-Electron%20%2B%20React%20%2B%20Redux-61DAFB.svg)

---

## O que é o MD Studio?

O **MD Studio** é um editor visual para criação de jogos para o **Sega Mega Drive / Genesis**, desenvolvido pela [FuturoOn](https://futuroon.com.br). Ele permite:

- **Montar cenas visualmente** com drag-and-drop (sprites, tiles, atores, triggers)
- **Gerar código C automaticamente** compatível com o [SGDK](https://github.com/Stephane-D/SGDK)
- **Editar o código gerado** com Monaco Editor (o mesmo do VS Code) integrado
- **Compilar e testar** diretamente via emulador
- **Criar jogos de plataforma, top-down e shoot'em up** sem escrever código manualmente

## Funcionalidades

| Funcionalidade | Status |
|---|---|
| Editor visual de cenas (WorldEditor) | Implementado |
| Painel de navegação de cenas | Implementado |
| Painel de propriedades | Implementado |
| Barra de ferramentas | Implementado |
| Gerador de código C para SGDK | Implementado |
| Editor de código Monaco integrado | Implementado |
| Editor de atores/sprites | Implementado |
| Editor de colisões | Implementado |
| Editor de tilesets | Implementado |
| Store Redux (estado global) | Implementado |
| IPC Electron (menu, dialogo, FS) | Implementado |
| Compilador SGDK via Docker/CLI | Planejado |
| Preview em emulador | Planejado |

## Stack Tecnológica

```
Electron 28     — shell nativo multiplataforma
React 18        — UI reativa com JSX
Redux Toolkit   — gerenciamento de estado global
styled-components — estilização CSS-in-JS
Monaco Editor   — editor de código embutido
TypeScript 5    — tipagem estática
Webpack 5       — bundler (via Electron Forge)
SGDK            — kit de desenvolvimento Mega Drive
```

## Estrutura do Projeto

```
md-studio/
├── src/
│   ├── main/               # Processo main do Electron
│   │   ├── main.ts         # Janela, menus, IPC handlers
│   │   └── preload.ts      # Bridge segura renderer <-> main
│   ├── app/
│   │   └── App.tsx         # Roteador: NewProjectScreen | WorldEditor
│   ├── index.tsx           # Ponto de entrada React
│   ├── components/
│   │   ├── world/          # Editor principal de cenas
│   │   │   ├── WorldEditor.tsx   # Layout com sidebar + canvas
│   │   │   └── SceneView.tsx     # Canvas visual da cena
│   │   ├── toolbar/
│   │   │   └── Toolbar.tsx       # Ferramentas + gerador C
│   │   ├── navigator/
│   │   │   └── NavigatorPanel.tsx # Lista de cenas
│   │   ├── properties/
│   │   │   └── PropertiesPanel.tsx # Propriedades do objeto selecionado
│   │   ├── editors/
│   │   │   ├── ActorEditor.tsx    # Editor de atores
│   │   │   ├── CollisionEditor.tsx # Editor de colisões
│   │   │   └── TilesetEditor.tsx  # Editor de tilesets
│   │   └── start/
│   │       └── NewProjectScreen.tsx # Tela inicial
│   ├── store/
│   │   ├── index.ts        # Store Redux configurado
│   │   ├── store.ts        # Re-export para compatibilidade
│   │   ├── projectSlice.ts # Estado do projeto atual
│   │   └── features/
│   │       ├── editor/
│   │       │   └── editorSlice.ts  # Estado do editor (tool, zoom, seleção)
│   │       └── entities/
│   │           ├── entitiesSlice.ts # Cenas, atores, triggers, backgrounds
│   │           └── entitiesTypes.ts # Tipos TypeScript das entidades
│   └── lib/
│       ├── compiler/
│       │   └── SGDKCodeBuilder.ts  # Gerador de código C para SGDK
│       ├── events/         # Handlers de eventos do editor
│       ├── ai/             # Integração com IA para sugestões de código
│       └── sgdk/
│           └── mainTemplate.c  # Template base do main.c SGDK
├── scripts/
│   └── fetchDeps.js        # Verificador de dependências externas
├── public/
│   └── index.html          # Template HTML
├── forge.config.ts         # Configuração do Electron Forge
├── webpack.main.config.ts  # Webpack processo main
├── webpack.renderer.config.ts # Webpack processo renderer
├── tsconfig.json           # Configuração TypeScript
└── package.json
```

## Instalação e Execução

### Pré-requisitos

- Node.js >= 18.0.0
- npm ou yarn
- Git

### Clonar e instalar

```bash
git clone https://github.com/arkanael/md-studio.git
cd md-studio
npm install
```

### Verificar dependências opcionais (SGDK)

```bash
npm run fetch-deps
```

### Iniciar em modo desenvolvimento

```bash
npm start
```

### Build para distribuição

```bash
npm run build
```

## Como Usar

1. **Criar Projeto** — Na tela inicial, escolha um template (plataforma, top-down, shooter)
2. **Adicionar Cenas** — Clique em `+ Cena` no painel esquerdo
3. **Editar Cenas** — Arraste sprites e tiles para a área central
4. **Configurar Atores** — Clique em um ator para editar propriedades
5. **Gerar Código C** — Clique em `Gerar Código C` na toolbar
6. **Editar o Código** — Monaco Editor abrirá com o código gerado
7. **Compilar** — Use `Compilar SGDK` para gerar a ROM (requer SGDK instalado)

## Código C Gerado

O MD Studio gera código C estruturado compatível com o SGDK:

```c
/* Gerado pelo MD Studio */
#include <genesis.h>
#include "resources.h"

#define SCREEN_WIDTH 320
#define SCREEN_HEIGHT 224

void init_cena_01() {
    VDP_clearPlane(BG_A, TRUE);
    SPR_init();
    /* ... */
}

void update_cena_01() {
    u16 joy = JOY_readJoypad(JOY_1);
    if (joy & BUTTON_RIGHT) playerX += 2;
    /* ... */
}

int main() {
    JOY_init();
    VDP_setScreenWidth320();
    init_cena_01();
    while(TRUE) {
        SYS_doVBlankProcess();
        update_cena_01();
        SPR_update();
    }
    return 0;
}
```

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para guia completo de contribuição.

## Sobre

Projeto desenvolvido pela **FuturoOn** — ONG de tecnologia e educação baseada em São Gonçalo, RJ.

- Site: [futuroon.com.br](https://futuroon.com.br)
- GitHub: [@arkanael](https://github.com/arkanael)

## Licença

[MIT](LICENSE) © FuturoOn
