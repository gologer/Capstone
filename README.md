# WebMapApp

A web mapping application built with **Vite + React + TypeScript**. The goal of the
project is to explore and demonstrate popular web-map APIs — **Leaflet**, **MapLibre GL**,
and **CesiumJS** — from a single front end, including an interactive example that lets you
select a Thai province from a dropdown and zoom the map to it.

> **Status:** early scaffold. The front end is a working Vite + React + TypeScript app.
> The map-API integrations and province selector described in the [Roadmap](#roadmap)
> are planned (see `note.txt`). The `backend/` directory is reserved for future API work.

## Live demo

Once GitHub Pages is enabled, the built front end is served at:

**https://gologer.github.io/WebMapApp/**

## Tech stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Framework | React 19                            |
| Language  | TypeScript                          |
| Build     | Vite 8                              |
| Linting   | oxlint                              |
| Planned   | Leaflet, MapLibre GL, CesiumJS      |

## Project structure

```
WebMapApp/
├── frontend/            # Vite + React + TypeScript app
│   ├── public/          # Static assets (favicon, icons)
│   ├── src/             # Application source
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── backend/             # Reserved for future backend/API
├── note.txt             # Working notes / roadmap (Thai)
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm (bundled with Node.js)

## Getting started

All commands are run from the `frontend/` directory.

```bash
cd frontend
npm install       # install dependencies
npm run dev       # start the dev server (http://localhost:5173)
```

## Available scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR           |
| `npm run build`   | Type-check and build for production to `dist`|
| `npm run preview` | Preview the production build locally         |
| `npm run lint`    | Lint the source with oxlint                  |

## Build

```bash
cd frontend
npm run build     # outputs static files to frontend/dist
npm run preview   # serve the dist build locally to verify
```

## Deployment (GitHub Pages)

The app is deployed as a GitHub Pages **project site**, so Vite is configured with
`base: '/WebMapApp/'` in `frontend/vite.config.ts`. The production build in
`frontend/dist` is published to the `gh-pages` branch, and GitHub Pages is set to
serve from that branch.

```bash
cd frontend
npm run build
# publish frontend/dist to the gh-pages branch
```

In the repository **Settings → Pages**, set the source to the `gh-pages` branch
(root). The site is then available at the [live demo](#live-demo) URL above.

## Roadmap

Planned work (from `note.txt`):

- [ ] Integrate **Leaflet**, **MapLibre GL**, and **CesiumJS** into the front end.
- [ ] Make `index.html` link to an example page for each web-map API.
- [ ] Add a **province dropdown** on the Leaflet page that zooms to the selected
      Thai province, driven by example data with an appropriate key.
- [ ] Build a backend/API in `backend/`.

## License

No license has been specified for this project yet.
