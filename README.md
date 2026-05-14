# Clean Nest

A NestJS API built with a Clean Architecture approach for a forum domain with questions, answers, comments, attachments, and notifications.

## Stack

- Node.js + TypeScript
- NestJS
- Prisma + PostgreSQL
- Redis for caching
- MinIO/S3 for attachment uploads
- JWT with Passport
- Zod for environment validation
- Vitest for unit and E2E tests
- ESLint + Prettier

## Structure

- `src/core`: shared application building blocks, such as base entities, events, errors, and repository types.
- `src/domain`: business rules, entities, use cases, and repository contracts.
- `src/infra`: NestJS modules, HTTP, database, cache, storage, authentication, and events.
- `src/generated/prisma`: generated Prisma Client.
- `test`: factories, in-memory repositories, and E2E test setup.
- `prisma`: database schema and migrations.

## Requirements

- Node.js 20+
- `pnpm`
- Docker and Docker Compose

## Local Services

Use Docker to start the local infrastructure dependencies:

```bash
docker compose up -d
```

Available services:

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MinIO API: `localhost:9000`
- MinIO console: `localhost:9001`

## Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Main variables:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:docker@localhost:5432/clean-nest?schema=public"

JWT_PRIVATE_KEY=""
JWT_PUBLIC_KEY=""

AWS_BUCKET_NAME="uploads"
AWS_ACCESS_KEY_ID="admin"
AWS_SECRET_ACCESS_KEY_ID="password123"
AWS_ENDPOINT="http://localhost:9000"
AWS_REGION="us-east-1"

REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_DB=0
```

For E2E tests, keep a `.env.test` file with test-specific overrides:

```env
AWS_BUCKET_NAME="test"
REDIS_DB=1
```

## Installation

Install dependencies:

```bash
pnpm install
```

Generate the Prisma Client:

```bash
pnpm exec prisma generate
```

Apply migrations:

```bash
pnpm exec prisma migrate deploy
```

During development, when creating a new migration:

```bash
pnpm exec prisma migrate dev
```

## Running the Application

```bash
pnpm start:dev
```

Build and production:

```bash
pnpm build
pnpm start:prod
```

## Quality and Tests

TypeScript check:

```bash
pnpm exec tsc --noEmit
```

Build:

```bash
pnpm build
```

Lint with auto-fix:

```bash
pnpm lint
```

Unit tests:

```bash
pnpm test
```

E2E tests:

```bash
pnpm test:e2e
```

Recommended full check before opening a PR:

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

## Main Routes

- `POST /accounts`
- `POST /sessions`
- `POST /questions`
- `GET /questions`
- `GET /questions/:slug`
- `PUT /questions/:id`
- `DELETE /questions/:id`
- `POST /questions/:questionId/answers`
- `GET /questions/:questionId/answers`
- `PUT /answers/:id`
- `DELETE /answers/:id`
- `PATCH /answers/:answerId/choose-as-best`
- `POST /questions/:questionId/comments`
- `GET /questions/:questionId/comments`
- `DELETE /questions/comments/:id`
- `POST /answers/:answerId/comments`
- `GET /answers/:answerId/comments`
- `DELETE /answers/comments/:id`
- `POST /attachments`
- `PATCH /notification/:notificationId/read`

## Cache and E2E Tests

E2E tests create an isolated PostgreSQL schema for each test run and drop it at the end. Redis uses the database configured through `REDIS_DB` and is cleaned before each test with `flushdb()`, preventing cached data from leaking between scenarios.

## Scripts

- `pnpm build`: compiles the application.
- `pnpm start`: starts the application.
- `pnpm start:dev`: starts the application in watch mode.
- `pnpm start:debug`: starts the application in debug mode.
- `pnpm start:prod`: runs the production build.
- `pnpm lint`: runs ESLint with auto-fix.
- `pnpm format`: formats files with Prettier.
- `pnpm test`: runs unit tests.
- `pnpm test:watch`: runs unit tests in watch mode.
- `pnpm test:cov`: runs tests with coverage.
- `pnpm test:e2e`: runs E2E tests.
- `pnpm test:e2e:watch`: runs E2E tests in watch mode.

## License

Private project, not published to npm.
