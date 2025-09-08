# Retro Game Plays Viewer

A minimal Vue 3 + Vite app that fetches game play data from the provided AWS Lambda endpoint and renders it in an advanced table with filtering, sorting, and client-side pagination. It also follows pagination using `last_key` to load all pages.

## Tech Stack
- WebStorm
- Junie Pro
- Vue 3 (Composition API)
- TypeScript
- Vite (build tool and dev server)
- @vitejs/plugin-vue

## Development Tools
- Node.js 18+ (recommended)
- npm scripts:
  - dev: vite
  - build: vite build
  - preview: vite preview

## Getting started

1. Install Node.js (v18+ recommended).
2. Install dependencies:
   
   npm install

3. Run the dev server:
   
   npm run dev

4. Build for production:
   
   npm run build

5. Preview the production build:
   
   npm run preview

## Notes
- The app fetches all pages from the API by repeatedly calling the endpoint until `last_key` is null.
- The table supports:
  - Text search across all columns
  - Column sorting (click headers)
  - Filters for action and emulator
  - Adjustable page size and paging controls
