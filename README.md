## Functionalities


## Dev notes


## Tech stack

- Docker
- NodeJS (Typescript)
- SQLite
- Redis
- Vitest

## Usage

`docker-compose -f docker-compose.yml up`

## Endpoints

Default port `3000`


## Dev workflow

`cp server/.env.example server/.env`

`docker-compose -f docker-compose.dev.yml up`

`cd server && npm i && npm run dev:debug`

## Tests

`cd server && npm i && npm run dev:test`

(or use vscode debug console to launch and attach to server)
