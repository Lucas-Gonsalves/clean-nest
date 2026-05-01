# Clean Nest

A clean architecture NestJS application with PostgreSQL, Prisma, JWT authentication, and a forum-style question/answer domain.

## Overview

This repository demonstrates a scalable backend architecture using NestJS and Prisma. The application includes:

- PostgreSQL database access with Prisma ORM
- JWT-based authentication and authorization
- A domain model for users, questions, and answers
- User roles: `STUDENT` and `INSTRUCTOR`
- Environment validation with Zod
- Unit and end-to-end tests with Vitest

## Tech stack

- Node.js
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JWT
- Vitest
- ESLint
- Prettier

## Project structure

- `src/infra`: application bootstrap, NestJS modules, HTTP and auth layers
- `src/core`: domain entities, repositories, errors, and shared logic
- `src/generated/prisma`: generated Prisma client
- `prisma/schema.prisma`: database schema definition

## Requirements

- Node.js 20+ (recommended)
- `pnpm`
- PostgreSQL database

## Environment variables

Create a `.env` file in the project root with the following values:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
JWT_PRIVATE_KEY=your-private-key
JWT_PUBLIC_KEY=your-public-key
```

## Setup

Install dependencies:

```bash
pnpm install
```

Generate Prisma client and apply migrations:

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
```

If you want to use the existing migration history without creating a new migration, run:

```bash
pnpm exec prisma migrate deploy
```

## Running the application

Start the app in development:

```bash
pnpm run start:dev
```

Start the app in production mode:

```bash
pnpm run start:prod
```

## Scripts

- `pnpm run build` - compile TypeScript
- `pnpm run start` - start NestJS application
- `pnpm run start:dev` - start in watch mode
- `pnpm run lint` - run ESLint and auto-fix issues
- `pnpm run format` - format source files with Prettier
- `pnpm run test` - run unit tests
- `pnpm run test:e2e` - run end-to-end tests
- `pnpm run test:cov` - run tests with coverage

## Database models

The Prisma schema defines these core models:

- `User` with roles and relations to questions and answers
- `Question` with author, answers, and optional best answer
- `Answer` with author and relation to a question

## Notes

- The application uses Zod to validate runtime environment variables.
- The NestJS entry point is `src/infra/main.ts`.
- The main application module is `src/infra/app.module.ts`.

## License

This project is private and not published to npm.
