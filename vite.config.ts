import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import topLevelAwait from 'vite-plugin-top-level-await';
// import wasm from 'vite-plugin-wasm';
import { visualizer } from 'rollup-plugin-visualizer';
// import VitePluginOptimizeDeps from 'vite-plugin-optimize-deps';
// import VitePluginCompression from 'vite-plugin-compression';
import { terser } from 'rollup-plugin-terser';
import viteCompression from 'vite-plugin-compression';
// import reactRefresh from '@vitejs/plugin-react-refresh';



import { getFileList } from './tools/get_file_list';

const publicDir = path.resolve(__dirname, './public');
const getPublicFileList = async (targetPath: string) => {
  const filePaths = await getFileList(targetPath);
  const publicFiles = filePaths
    .map((filePath) => path.relative(publicDir, filePath))
    .map((filePath) => path.join('/', filePath));

  return publicFiles;
};

export default defineConfig(async () => {
  const videos = await getPublicFileList(path.resolve(publicDir, 'videos'));

  return {
    build: {
      // assetsInlineLimit: 20480,
      cssCodeSplit: true,
      // cssTarget: 'es6',
      // minify: false,
      rollupOptions: {
        output: {
          // experimentalMinChunkSize: 40960,
        },
        plugins: [
          terser(),
        ],
      },
      target: 'es2015',
      chunkSizeWarningLimit: 500,
    },
    plugins: [
      react(),
      // wasm(),
      topLevelAwait(),
      ViteEjsPlugin({
        module: '/src/client/index.tsx',
        title: '買えるオーガニック',
        videos,
      }),
      viteCompression(),
      // reactRefresh(),

      // visualizer({
      //   emitFile: true,
      //   filename: "stats.html",
      // }),
      // VitePluginCompression({
      //   filter: /\.(mp4)$/i,
      //   threshold: 1024,
      //   algorithm: 'gzip',
      //   deleteOriginFile: false,
      //   // compressionOptions: { level: 9 },
      // }),
    ],
    // resolve: {
    //   alias: {
    //     react: 'preact/compat',
    //     'react-dom': 'preact/compat',
    //   }
    // }
  };
});
