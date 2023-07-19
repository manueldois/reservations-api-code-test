## Functionalities


## Dev notes


## Tech stack

- Docker
- NodeJS (Typescript)
- SQLite
- Jest
- OpenAPI docs

## Usage

`docker-compose -f docker-compose.yml up`

## Endpoints

Default port `3000`

Swagger ui at http://localhost:3000/api-docs/

## Dev workflow

`cp server/.env.example server/.env`

`docker-compose -f docker-compose.dev.yml up`

`cd server && npm i && npm run dev:debug`

## Tests

`cd server && npm i && npm run dev:test`

(or use vscode debug console to launch and attach to server)
