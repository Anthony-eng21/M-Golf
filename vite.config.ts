import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  publicDir: '../public',
  root: 'src/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});