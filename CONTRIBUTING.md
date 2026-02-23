# Contribuindo com o MD Studio

Obrigado por querer contribuir com o MD Studio! Este documento explica como voce pode participar do projeto.

## O que e o MD Studio?

MD Studio e um editor visual de jogos para o Sega Mega Drive, inspirado no GB Studio, adaptado para gerar codigo C compativel com o SGDK (Sega Genesis Development Kit). O objetivo e permitir que desenvolvedores criem jogos para Mega Drive de forma visual, com geracao automatica de codigo C via IA.

## Como Contribuir

### 1. Reportar Bugs

Abra uma Issue descrevendo:
- O comportamento esperado
- O comportamento atual
- Passos para reproduzir o bug
- Versao do MD Studio e sistema operacional

### 2. Sugerir Funcionalidades

Abra uma Issue com o prefixo `[FEATURE]` descrevendo:
- O problema que a funcionalidade resolve
- Como ela deveria funcionar
- Exemplos de uso

### 3. Contribuir com Codigo

#### Configuracao do Ambiente

```bash
# Clonar o repositorio
git clone https://github.com/arkanael/md-studio.git
cd md-studio

# Instalar dependencias
npm install

# Rodar em modo de desenvolvimento
npm run dev
```

#### Estrutura de Pastas

```
md-studio/
  src/
    lib/
      events/       # Eventos do editor (eventActorMoveTo.js, etc)
      compiler/     # Compilador SGDK (sgdkCodeBuilder.ts)
      ai/           # Gerador de codigo IA (aiCodeGenerator.ts)
      sgdk/         # Templates C para SGDK
  package.json
  tsconfig.json
```

#### Criando um Novo Evento

Todo evento deve seguir o padrao:

```javascript
const id = 'EVENT_MEU_EVENTO';

const fields = [
  {
    key: 'meuCampo',
    label: 'Meu Campo',
    type: 'text', // text, number, select, checkbox, actor, scene, variable, events
    defaultValue: '',
  },
];

const compile = (input, helpers) => {
  const { sgdk, compileEvents } = helpers;
  sgdk.emitLine(`// Codigo C gerado aqui`);
};

module.exports = {
  id,
  description: 'Descricao do evento',
  autoLabel: (fetchArg) => `Label automatico`,
  groups: ['Grupo'],
  weight: 1,
  fields,
  compile,
};
```

#### Convencao de Commits

Usamos Conventional Commits:

- `feat:` - nova funcionalidade
- `fix:` - correcao de bug
- `chore:` - atualizacao de build/config
- `docs:` - documentacao
- `refactor:` - refatoracao sem nova funcionalidade
- `test:` - adicionar ou corrigir testes

Exemplos:
```
feat: eventPlayerHeal - recuperar HP do jogador via SGDK
fix: eventActorMoveTo - corrigir calculo de colisao diagonal
docs: adicionar exemplos de uso no README
```

#### Pull Request

1. Crie um fork do repositorio
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Faca seus commits seguindo a convencao acima
4. Abra um Pull Request para a branch `main`
5. Descreva claramente o que foi feito e por que

## Codigo de Conduta

- Seja respeitoso e inclusivo
- Aceite criticas construtivas
- Foque no que e melhor para o projeto e a comunidade
- Projetos como este nascem da colaboracao - toda contribuicao conta!

## Duvidas?

Abra uma Issue ou entre em contato atraves do repositorio.

---

Feito com amor para a comunidade de desenvolvimento Mega Drive!
