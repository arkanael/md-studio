# MD Studio

> Editor visual drag-and-drop para criação de jogo# MD Studio
> Editor visual drag-and-drop para criação de jogos do **Sega Mega Drive** — inspirado no GB Studio, adaptado para o SGDK com geração de código C.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Platform](https://img.shields.io/badge/platform-Mega%20Drive-orange.svg) ![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow.svg) ![Stack](https://img.shields.io/badge/stack-Electron%20%2B%20React%20%2B%20Redux-61DAFB.svg)

---

## O que é o MD Studio?
O **MD Studio** é um editor visual para criação de jogos para o **Sega Mega Drive / Genesis**. Ele permite:
* **Montar cenas visualmente** com drag-and-drop (sprites, tiles, atores, triggers)
* **Gerar código C automaticamente** compatível com o [SGDK](https://github.com/Stephane-D/SGDK)
* **Editar o código gerado** com Monaco Editor integrado
* **Compilar e testar** diretamente via emulador

---

## Roadmap

### 🚀 Em Andamento
- [x] Estrutura base do projeto (Electron + React + Redux)
- [x] World Editor visual para montagem de cenas
- [x] Gerador de código C estruturado para SGDK (`SGDKCodeBuilder`)
- [ ] **Sincronização de Eventos:** Corrigir nomes de importação/exportação em `src/lib/events/index.js`.
- [ ] **Mini-jogo "Hello World":** Implementar movimentação básica e exibição de sprite no console.

### 📅 Planejado (Inspirado no MD Engine & Sugestões)
- [ ] **Scripts de Cena Avançados:** Adicionar suporte a `Setup`, `Update` (60fps) e `End` por cena.
- [ ] **Gestão de Planos VDP:** Implementar suporte visual para Planos A e B (Parallax).
- [ ] **Troca Dinâmica de Player:** Permitir que qualquer ator seja definido como jogador em tempo real.
- [ ] **Paletas de 9 bits:** Seletor de cores limitado ao CRAM do Mega Drive com extração automática de PNG.
- [ ] **Exportação QoL (Desktop):** Modo Widescreen, remoção de limite de sprites e filtros CRT via Electron.
- [ ] **Integração Áudio XGM:** Interface para importar e gerenciar `.vgm` e `.wav`.
- [ ] **Assistente IA (Exclusivo):** Sugestões de otimização de código C e geração de eventos customizados via linguagem natural.

---

## Funcionalidades Implementadas
| Funcionalidade | Status |
|---|---|
| Editor visual de cenas (WorldEditor) | Implementado |
| Painel de navegação de cenas | Implementado |
| Painel de propriedades | Implementado |
| Gerador de código C para SGDK | Implementado |
| Editor de código Monaco integrado | Implementado |
| Editor de atores/sprites | Implementado |
| Editor de colisões | Implementado |
| Editor de tilesets | Implementado |
| Compilador SGDK via Docker/CLI | Planejado |
| Preview em emulador | Planejado |

---

## Stack Tecnológica
`Electron 28` `React 18` `Redux Toolkit` `Monaco Editor` `TypeScript 5` `SGDK`

---

## Instalação
```bash
git clone https://github.com/arkanael/md-studio.git
cd md-studio
npm install
npm start
```ctrl+s do **Sega Mega Drive** — inspirado no GB Studio, adaptado para o SGDK com geração de código C.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Platform](https://img.shields.io/badge/platform-Mega%20Drive-orange.svg) ![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow.svg) ![Stack](https://img.shields.io/badge/stack-Electron%20%2B%20React%20%2B%20Redux-61DAFB.svg)

---

## O que é o MD Studio?

O **MD Studio** é um editor visual para criação de jogos para o **Sega Mega Drive / Genesis**. Ele permite:

* • **Montar cenas visualmente** com drag-and-drop (sprites, tiles, atores, triggers)
* • **Gerar código C automaticamente** compatível com o [SGDK](https://github.com/Stephane-D/SGDK)
* • **Editar o código gerado** com Monaco Editor (o mesmo do VS Code) integrado
* • **Compilar e testar** diretamente via emulador
* • **Criar jogos de plataforma, top-down e shoot'em up** sem escrever código manualmente

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

## Roadmap

[x] Estrutura base do projeto (Electron + React + Redux)
[x] World Editor visual para montagem de cenas
[x] Gerador de código C estruturado para SGDK
[ ] Finalizar registro de eventos: Sincronizar importações em index.js para Diálogos, Lógica e Input.
[ ] Suporte completo a Variáveis globais e locais no editor.
[ ] Implementar o \"Toggle\" entre Modo Simples (Visual) e Modo Avançado (Arquitetura).
[ ] Automatizar a compilação (Docker/CLI) e lançamento do emulador.
[ ] Sistema de exportação de projeto portátil (.sgproj).
[ ] Integração com IA para sugestões de otimização de código C.

## Stack Tecnológica

`Electron 28 — shell nativo multiplataforma`
`React 18 — UI reativa com JSX`
`Redux Toolkit — gerenciamento de estado global`
`styled-components — estilização CSS-in-JS`
`Monaco Editor — editor de código embutido`
`TypeScript 5 — tipagem estática`
`Webpack 5 — bundler (via Electron Forge)`
`SGDK — kit de desenvolvimento Mega Drive`

## Estrutura do Projeto

```
md-studio/
├── src/
│   ├── main/          # Processo main do Electron
│   │   ├── main.ts    # Janela, menus, IPC handlers
│   │   └── preload.ts # Bridge segura renderer <-> main
│   ├── app/
│   │   └── App.tsx    # Roteador: NewProjectScreen | WorldEditor
│   ├── index.tsx      # Ponto de entrada React
│   ├── components/
│   │   ├── world/     # Editor principal de cenas
│   │   ├── toolbar/   # Ferramentas + gerador C
│   │   ├── navigator/ # Lista de cenas
│   │   ├── properties/# Propriedades do objeto selecionado
│   │   ├── editors/   # Editores (Atores, Colisões, Tilesets)
│   │   └── start/     # Tela inicial
│   ├── store/         # Estado global Redux
│   └── lib/
│       ├── compiler/  # Gerador de código C para SGDK
│       ├── events/    # Handlers de eventos do editor
│       ├── ai/        # Integração com IA
│       └── sgdk/      # Templates C
└── package.json
```

## Instalação e Execução

### Pré-requisitos
* • Node.js >= 18.0.0
* • npm ou yarn
* • Git

### Clonar e instalar
```bash
git clone https://github.com/arkanael/md-studio.git
cd md-studio
npm install
```

### Iniciar em modo desenvolvimento
```bash
npm start
```

## Licença

[MIT](https://github.com/arkanael/md-studio/blob/main/LICENSE)
