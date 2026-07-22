import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import cesiumPlugin from 'vite-plugin-cesium'

// vite-plugin-cesium is a dual CJS/ESM package; depending on how the default
// export is interoped it may arrive as the factory itself or wrapped under
// `.default`. Unwrap defensively so it stays callable under nodenext +
// verbatimModuleSyntax.
const cesiumFactory = cesiumPlugin as unknown as {
  (options?: unknown): PluginOption
  default?: (options?: unknown) => PluginOption
}
const cesium = cesiumFactory.default ?? cesiumFactory

// https://vite.dev/config/
// base defaults to '/' (served at web root by the FastAPI backend and the dev
// server). For the GitHub Pages project site build with: vite build --base=/WebMapApp/
export default defineConfig({
  base: '/',
  plugins: [react(), cesium()],
})
