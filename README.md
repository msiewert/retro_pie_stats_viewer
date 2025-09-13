# Retro Game Plays Viewer

A minimal Vue 3 + Vite app that fetches game play data from the provided AWS Lambda endpoint and renders it in an advanced table with filtering, sorting, and client-side pagination. It also follows pagination using `last_key` to load all pages.

## Tech Stack
- WebStorm
- Amazon Q
- Vue 3 (Composition API)
- TypeScript
- Vite (build tool and dev server)

## Development Tools
- Node.js 18+ (recommended)
- npm scripts:
  - dev: vite
  - build: vite build
  - preview: vite preview
- Amazon Q

## Getting started

1. Install Node.js (v18+ recommended).
2. Install dependencies:
   
   npm install

3. Configure API key (required):
   - Create a file named `.env.local` in the project root (this file is git-ignored).
   - Add the following line, replacing the placeholder with your key:
     
     VITE_API_KEY=your_api_key_here

4. Run the dev server:
   
`
   npm run dev
`

5. Build for production:
   
`
   npm run build
`

6. Preview the production build:
   
`
   npm run preview
`

## Notes
- The app fetches all pages from the API by repeatedly calling the endpoint until `last_key` is null.
- The table supports:
  - Text search across all columns
  - Column sorting (click headers)
  - Filters for action and emulator
  - Adjustable page size and paging controls

## Deploy to AWS (CDK)
This repo includes an AWS CDK (v2) stack to host the built SPA on S3 behind CloudFront.

Prerequisites:
- AWS account and credentials configured (e.g., with `aws configure`).
- Bootstrap your target environment once: `cd cdk && npm install && npx cdk bootstrap`.
- Node.js 18+.

Deploy steps:
1. Build the app from repo root:
   - `npm run build`
2. Deploy infra and upload artifacts:
   - `npm run deploy:aws`

Outputs include the CloudFront domain to access your site. 

To remove the stack: 

`cd cdk && npm run destroy`



