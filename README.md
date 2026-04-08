# Calc App Monorepo

This project is organized as an npm workspaces monorepo with separate frontend, backend, and shared logic packages.

## Workspace Layout

- `apps/web`: React + Vite frontend
- `apps/api`: Express API backend
- `packages/calculator`: Shared expression parser/evaluator used by the API

## Install

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

This starts:

- Vite app at `http://localhost:5173`
- API at `http://localhost:3001`

The web app calls `/api/calculate`, and Vite proxies that route to the API during development.

## Other Commands

```bash
npm run build
npm run lint
npm run preview
npm run start
```

## Package-Specific Commands

```bash
npm run dev -w @calc-app/web
npm run dev -w @calc-app/api
```
