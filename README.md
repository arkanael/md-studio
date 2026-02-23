# MD Studio

> Editor visual drag-and-drop para criação de jogos do **Sega Mega Drive** — baseado no GB Studio, adaptado para o SGDK com geração de código C via Inteligência Artificial.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Mega%20Drive-orange.svg)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow.svg)

---

## O que é o MD Studio?

O MD Studio é uma ferramenta visual que permite criar jogos para o **Sega Mega Drive / Genesis** sem precisar escrever código C manualmente. Você monta tudo visualmente — cenas, atores, inimigos, colisões, eventos, objetos — e a IA gera o código C completo, pronto para compilar com o **SGDK**.

### Fluxo de trabalho

```
[Editor Visual] → [IA gera código C] → [Editor de código Monaco] → [SGDK compila] → [ROM .bin]
```

---

## Funcionalidades

### Editor Visual (fork do GB Studio)
- Criação de cenas com tilemap (320x224)
- Marcação visual de colisões tile a tile
- Adição de atores, inimigos, objetos e NPCs
- Sistema de eventos por blocos (drag & drop)
- Preview em tempo real da cena
- Gerenciamento de paletas de cores (Mega Drive: 4 paletas x 16 cores)
- Editor de sprites e animações

### Geração de Código com IA
- O projeto é serializado em JSON estruturado
- A IA (OpenAI GPT-4o ou Ollama local) recebe o JSON e gera código C para SGDK
- O código gerado é **comentado e educativo**
- Suporte a Ollama para uso **100% offline e gratuito**

### Editor de Código Embutido
- Monaco Editor (mesmo motor do VS Code) integrado
- O usuário pode visualizar, editar e ajustar o C gerado
- Highlight de sintaxe para C
- Integração com erros de compilação do SGDK

### Compilação via SGDK
- SGDK bundled no `buildTools/`
- Compilação com um clique
- Output: `out/rom.bin` para Mega Drive
- Log de erros mapeado de volta para os eventos visuais

---

## Comparativo: MD Studio vs GB Studio

| Feature | GB Studio | MD Studio |
|---|---|---|
| Plataforma alvo | Game Boy | **Sega Mega Drive** |
| Resolução | 160x144 | **320x224** |
| Sprites simultâneos | 40 | **80** |
| Cores por paleta | 4 | **16 (4 paletas)** |
| Output de código | Bytecode GBVM | **C legível e editável** |
| IA integrada | ❌ | **✅** |
| Editor de código | ❌ | **✅ Monaco Editor** |
| Som | 4ch chiptune | **YM2612 FM + PSG** |
| Botões | A,B,Start,Select | **A,B,C,X,Y,Z,Start,Mode** |

---

## Stack Tecnológica

- **Electron** — app desktop (Windows, Mac, Linux)
- **React + TypeScript** — interface do editor
- **Redux** — estado global do projeto
- **Monaco Editor** — editor de código C embutido
- **SGDK** — compilador/SDK para Mega Drive
- **OpenAI API / Ollama** — geração de código C via IA
- **Canvas API** — preview de tilemap e colisões

---

## Estrutura do Projeto

```
md-studio/
├── src/
│   ├── components/        # UI React (editor visual, canvas, painéis)
│   ├── store/             # Estado Redux do projeto
│   ├── shared/            # Tipos TypeScript compartilhados
│   ├── app/               # Wrapper Electron
│   └── lib/
│       ├── events/        # Eventos visuais (cada bloco = 1 arquivo)
│       ├── compiler/      # sgdkCodeBuilder — emite código C
│       ├── ai/            # Integração com OpenAI / Ollama
│       └── sgdk/          # Templates C, headers SGDK, main.c base
├── buildTools/
│   └── sgdk/              # SGDK instalado aqui
└── appData/               # Templates de projeto Mega Drive
```

---

## Roadmap

### Fase 1 — Estrutura base
- [ ] Fork e adaptação do GB Studio
- [ ] Substituir GBDK por SGDK no buildTools
- [ ] Ajustar constantes de hardware (resolução, paletas, limites MD)
- [ ] Renomear UI para Mega Drive

### Fase 2 — Gerador de código C
- [ ] Criar `sgdkCodeBuilder.ts`
- [ ] Adaptar 10 eventos principais (movimento, input, colisão, som, diálogo)
- [ ] Integrar Monaco Editor para exibir o código gerado

### Fase 3 — Integração com IA
- [ ] Prompt template que serializa o projeto JSON
- [ ] Integração com OpenAI GPT-4o
- [ ] Integração com Ollama (CodeLlama / Qwen2.5-Coder) para uso offline
- [ ] Modo educativo: IA explica cada bloco de código gerado

### Fase 4 — Pipeline de build
- [ ] Invocar SGDK via Node.js child_process
- [ ] Output de compilação em tempo real
- [ ] Mapeamento de erros C → eventos visuais
- [ ] Exportar ROM `.bin` final

---

## Sobre o Projeto

Desenvolvido pela **[FuturoOn](https://futuroon.com.br)** — ONG de tecnologia e educação de São Gonçalo, Rio de Janeiro.

O objetivo é usar o MD Studio como ferramenta educacional: alunos montam jogos visualmente, a IA gera e explica o código C, e quem quiser aprender mais pode editar diretamente no Monaco Editor.

---

## Baseado em

- [GB Studio](https://github.com/chrismaltby/gb-studio) — MIT License — Chris Maltby
- [SGDK](https://github.com/Stephane-D/SGDK) — Stéphane Dallongeville

---

## Licença

MIT License — veja [LICENSE](LICENSE) para detalhes.
