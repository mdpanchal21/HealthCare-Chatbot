# Healthcare Hospital Discovery

Backend foundation for a rural healthcare discovery platform in India. The project is organized as a small workspace so the web chatbot and future WhatsApp integration can share the same healthcare API and business logic.

## Workspace

```text
server/     NestJS REST API, TypeORM entities, migrations, and tests
client/     Web chatbot frontend workspace
```

The server is the source of truth for hospitals, villages, procedures, pricing estimates, and government scheme availability. The platform does not diagnose patients or store medical records.

## Technology

- Node.js and TypeScript
- NestJS REST API
- PostgreSQL with TypeORM
- Zod validation

## Setup

From inside the `server/` directory:

```bash
npm install
copy .env.example .env
npm run migration:run
npm run seed
npm run start:dev
```

Configure PostgreSQL connection values in `.env` before running migrations. Swagger documentation is served at `http://localhost:3000/api/docs`.

## Commands

Run from inside the `server/` directory:

```bash
npm run build             # compile the server
npm run start:dev         # development server with watch mode
npm run start:prod        # run the compiled server
npm run lint              # lint check
npm run format            # format with prettier
npm run test              # unit tests
npm run test:e2e          # end-to-end tests
npm run migration:run     # apply database migrations
npm run migration:revert  # revert the latest migration
npm run seed              # load clearly marked demo data
```

## API convention

REST endpoints are versioned under `/api/v1`. Swagger documentation is served at `/api/docs` when enabled by the server.

## Scope

V1 intentionally excludes WhatsApp integration, maps/GPS, appointments, payments, medical records, diagnosis, insurance claims, and recommendation monetization. Those features can be added behind the server boundary later without placing healthcare logic in the client.