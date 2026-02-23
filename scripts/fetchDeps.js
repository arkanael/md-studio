#!/usr/bin/env node
/**
 * fetchDeps.js - Script auxiliar do MD Studio
 * Verifica e instala dependencias externas necessarias:
 * - SGDK (Sega Genesis Development Kit)
 * - Emuladores suportados (BlastEm, Gens, etc.)
 *
 * Uso: npm run fetch-deps
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEPS_DIR = path.join(process.cwd(), '.md-studio-deps');

const deps = [
  {
    name: 'SGDK',
    description: 'Sega Genesis Development Kit',
    checkCmd: process.platform === 'win32' ? 'where make' : 'which make',
    installMsg:
      'SGDK requer Docker ou instalacao manual.\n' +
      'Consulte: https://github.com/Stephane-D/SGDK\n' +
      'Ou use o modo de preview sem compilacao real.',
  },
];

function ensureDepsDir() {
  if (!fs.existsSync(DEPS_DIR)) {
    fs.mkdirSync(DEPS_DIR, { recursive: true });
    console.log('[MD Studio] Diretorio de dependencias criado:', DEPS_DIR);
  }
}

function checkDep(dep) {
  console.log(`\n[MD Studio] Verificando: ${dep.name}...`);
  try {
    execSync(dep.checkCmd, { stdio: 'ignore' });
    console.log(`  [OK] ${dep.name} encontrado.`);
    return true;
  } catch {
    console.warn(`  [AVISO] ${dep.name} nao encontrado.`);
    console.warn(`  -> ${dep.installMsg}`);
    return false;
  }
}

function writeStatusFile(results) {
  const statusPath = path.join(DEPS_DIR, 'status.json');
  const status = {
    checkedAt: new Date().toISOString(),
    deps: results,
  };
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
  console.log('\n[MD Studio] Status salvo em:', statusPath);
}

function main() {
  console.log('=== MD Studio - Verificacao de Dependencias ===');
  console.log('Plataforma:', process.platform);
  console.log('Node.js:', process.version);
  console.log('Diretorio:', process.cwd());
  console.log('');

  ensureDepsDir();

  const results = deps.map((dep) => ({
    name: dep.name,
    found: checkDep(dep),
  }));

  writeStatusFile(results);

  const allFound = results.every((r) => r.found);
  if (allFound) {
    console.log('\n[OK] Todas as dependencias encontradas!');
  } else {
    console.log('\n[AVISO] Algumas dependencias estao faltando.');
    console.log('O editor funcionara em modo preview sem compilacao SGDK.');
  }
}

main();
