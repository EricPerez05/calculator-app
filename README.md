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

## Deploy Backend on Lambda (Part One)

This repo includes a Lambda-ready backend in `deploy/lambda-calculate`.

### Files

- `deploy/lambda-calculate/index.mjs`: Lambda handler
- `deploy/lambda-calculate/calculator.mjs`: calculation logic connected to the handler

### Create the zip for Lambda upload

From repo root on PowerShell:

```powershell
Compress-Archive -Path .\deploy\lambda-calculate\* -DestinationPath .\deploy\lambda-calculate.zip -Force
```

### Create Lambda function in AWS Console

1. Open AWS Lambda and choose Create function.
2. Author from scratch:
	- Function name: `calculate`
	- Runtime: `Node.js 20.x`
3. After function is created, open Code Source and Upload from `.zip file`.
4. Upload `deploy/lambda-calculate.zip`.
5. Confirm handler is `index.handler`.
6. Deploy and test with this payload:

```json
{
  "body": "{\"expression\":\"2+3*4\"}"
}
```

Expected response body includes `{"result":"14"}`.

## Wire Backend with API Gateway (Part Two)

1. Open API Gateway and create an HTTP API.
2. Add integration: your `calculate` Lambda function.
3. Add routes:
	- `POST /calculate`
	- `OPTIONS /calculate` (for CORS preflight)
4. Enable CORS for your Amplify domain:
	- Allowed origin: your Amplify app URL
	- Allowed methods: `POST,OPTIONS`
	- Allowed headers: `Content-Type`
5. Create stage (for example `prod`) and deploy.
6. Copy API invoke URL, for example:
	- `https://abc123.execute-api.us-east-1.amazonaws.com/prod`

## Connect Amplify Frontend to API Gateway

Frontend uses `VITE_API_BASE_URL` in production and `/api` proxy in local dev.

1. In Amplify, open App settings > Environment variables.
2. Add:
	- Key: `VITE_API_BASE_URL`
	- Value: your API Gateway stage URL (no trailing slash)
3. Redeploy the frontend.

Local example is in `apps/web/.env.example`.
