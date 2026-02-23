import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

// -------------------------------------------------------
// forge.config.ts - Configuracao do Electron Forge
// MD Studio - Editor visual para Mega Drive (SGDK)
// -------------------------------------------------------
const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'MD Studio',
    executableName: 'md-studio',
    icon: './public/icon',
    appBundleId: 'com.futuroon.mdstudio',
    appCategoryType: 'public.app-category.developer-tools',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'md_studio',
      authors: 'FuturoOn',
      description: 'Visual drag-and-drop game creator for Sega Mega Drive',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerDeb({
      options: {
        name: 'md-studio',
        productName: 'MD Studio',
        genericName: 'Game Creator',
        description: 'Visual game creator for Sega Mega Drive',
        categories: ['Development', 'Game'],
        maintainer: 'FuturoOn <contato@futuroon.com.br>',
      },
    }),
    new MakerRpm({
      options: {
        name: 'md-studio',
        productName: 'MD Studio',
        description: 'Visual game creator for Sega Mega Drive',
      },
    }),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './public/index.html',
            js: './src/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/main/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
