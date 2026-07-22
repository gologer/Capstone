// Post-processing for the GitHub Pages build.
//
// vite-plugin-cesium copies the Cesium runtime to `outDir/<base>/cesium`
// (it prepends the Vite `base` to the copy destination), which nests the
// assets one level too deep for a project-page base like `/Capstone/`.
// The HTML still references `/<base>/cesium/...`, so on Pages those files
// must live at the dist root. This moves them back up.
//
// It also writes 404.html (a copy of index.html) so client-side routes
// (/leaflet, /report, …) resolve on hard refresh / deep links.
//
// Usage: node scripts/fix-pages-cesium.mjs <baseSegment>   e.g. "Capstone"
import fs from 'node:fs'
import path from 'node:path'

const baseSegment = process.argv[2]
const dist = path.resolve('dist')

if (baseSegment) {
  const nested = path.join(dist, baseSegment)
  if (fs.existsSync(nested) && fs.statSync(nested).isDirectory()) {
    for (const entry of fs.readdirSync(nested)) {
      const from = path.join(nested, entry)
      const to = path.join(dist, entry)
      fs.rmSync(to, { recursive: true, force: true })
      fs.renameSync(from, to)
      console.log(`moved ${baseSegment}/${entry} -> ${entry}`)
    }
    fs.rmSync(nested, { recursive: true, force: true })
  }
}

// SPA fallback for GitHub Pages deep links.
const index = path.join(dist, 'index.html')
if (fs.existsSync(index)) {
  fs.copyFileSync(index, path.join(dist, '404.html'))
  console.log('wrote 404.html')
}
