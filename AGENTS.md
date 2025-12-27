# Agent Guidelines for Alta

This document provides guidelines for AI agents working on the Alta codebase. It covers build commands, code style, testing, and conventions.

## Project Overview

Alta is a TypeScript Node.js backend with Express, Prisma, Pinecone, BullMQ, R2 (S3-compatible storage), and OpenAI integration. It provides API endpoints for managing sources (documents), groups, presets, and users, with RAG (Retrieval Augmented Generation) capabilities.

## Build, Lint, and Test Commands

### Development

- `npm run dev` – Start the main API server in development mode with hot reload.
- `npm run source-worker:dev` – Start the source processing worker.
- `npm run dev:all` – Start both the API server and the worker concurrently.

### Production

- `npm run build` – Clean `dist/` and compile TypeScript with path aliases.
- `npm run start` – Start the compiled API server.
- `npm run source-worker:start` – Start the compiled worker.
- `npm run start:all` – Start both in production concurrently.

### Linting and Formatting

- `npm run lint` – Run ESLint (configured via `eslint.config.mts`).
- `npm run lint -- --fix` – Automatically fix linting issues.
- **Pre‑commit hook** (Husky) runs ESLint on staged `.ts`/`.js` files.
- **Prettier** is configured (`.prettierrc`). Use editor integration or run `npx prettier --write .`.

### Testing

- `npm run test` – Run all Vitest tests (integration tests in `src/tests/integration/`).
- `npm run test -- --run src/tests/integration/source.test.ts` – Run a single test file.
- `npm run test -- --run --grep "should create a new source"` – Run tests matching a pattern.
- **Global setup** (`src/tests/setup.ts`, `src/tests/prisma.ts`) and **mock setup** (`src/tests/mock.ts`) are executed before tests.
- Tests use `supertest` for HTTP assertions and `vi.mock()` for external services.

### Documentation

- `npm run generate:docs` – Generate OpenAPI specification (outputs `openapi.yml`).

### Database

- `npx prisma generate` – Generate Prisma client after schema changes.
- `npx prisma migrate dev` – Create and apply migrations.
- `npx prisma db seed` – Run seed script (`src/database/prisma/seed.ts`).

## Code Style Guidelines

### TypeScript Configuration

- **Target**: ES2023, CommonJS modules.
- **Strict**: `true` (strict type‑checking enabled).
- **Path alias**: `@/*` maps to `src/*` (e.g., `@/modules/source`).
- **Base directory**: `src`; output directory: `dist`.

### Imports

- Use path aliases for internal modules: `import { prisma } from "@/lib/prisma";`.
- Group imports: external packages first, then internal modules.
- Avoid relative paths that go beyond one level up; prefer aliases.
- Example:
    ```typescript
    import { Request, Response } from "express";
    import { StatusCodes } from "http-status-codes";
    import { prisma } from "@/lib/prisma";
    import { apiResponse } from "@/utils/apiResponse";
    ```

### Naming Conventions

- **Variables and functions**: `camelCase`.
- **Classes and types**: `PascalCase`.
- **Constants**: `UPPER_SNAKE_CASE`.
- **Files**: `kebab-case` for non‑TypeScript files; `camelCase` for `.ts` files (e.g., `sourceController.ts`).
- **DTOs**: Suffix with `Request`, `Query`, `Response` (e.g., `CreateSourceRequest`).
- **Interfaces/types**: No `I` prefix; use descriptive names (`ApiResponse`, `PagingQuery`).

### Formatting

- **Indentation**: 4 spaces (no tabs).
- **Print width**: 140 characters.
- **Trailing commas**: none (see `.prettierrc`).
- **Semicolons**: required (TypeScript default).
- Let Prettier handle formatting; do not disable prettier rules.

### Error Handling

- Throw custom errors from `src/lib/internal/errors.ts` (`NotFoundError`, `BadRequestError`, etc.).
- Services should throw these errors; controllers catch and convert to API error responses.
- Use `try/catch` only where recovery is possible; otherwise let the error propagate to the global error handler (`src/middlewares/errorHandler.ts`).
- API responses follow the `ApiResponse<T>` shape (success, data, message, errors).

### API Responses

- Controllers call `apiResponse.success(res, data, message)` or `apiResponse.error(res, message, code, errors)`.
- For paged results, use `pagingResponse(items, totalItems, page, size)` from `src/utils/apiResponse.ts`.
- Response shape:
    ```typescript
    {
      success: boolean,
      data: T | null,
      message: string,
      errors: string[]
    }
    ```

### Validation

- Use Zod schemas for request/query validation (see DTO files in `src/modules/*/dtos/`).
- Validation middleware (`src/middlewares/zodValidator.ts`) automatically validates based on route definitions.
- Define separate schemas for request body, query parameters, and response.

### Database (Prisma)

- Use the generated `PrismaClient` instance from `@/lib/prisma`.
- Prefer `findFirstOrThrow` over `findFirst` when existence is required.
- For transactions, use `prisma.$transaction([...])`.
- Select only needed fields to reduce data transfer.
- JSON fields (e.g., `metadata`) are typed as `JsonObject` from `@prisma/client/runtime/client`.

### External Services

- Services for Pinecone, OpenAI, R2, and BullMQ are in `src/lib/`.
- Each service exports functions with typed parameters and returns.
- Mock these services in tests using `vi.mock()`.

### Testing Patterns

- Integration tests are in `src/tests/integration/` grouped by module.
- Use `describe` blocks for API endpoints, `it` blocks for specific scenarios.
- Mock external services (Pinecone, OpenAI, R2, BullMQ) to avoid real network calls.
- Use `createSourceFactory` and other factories from `@/tests/prisma` to generate test data.
- Clean up mocks with `vi.clearAllMocks()` in `afterAll` hooks.

## Git & Commit Conventions

- **Commitlint** enforces conventional commits (`@commitlint/config‑conventional`).
- Commit message format: `<type>(<scope>): <subject>`.
- Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- Scope examples: `source`, `user`, `preset`, `group`, `deps`, `ci`.
- Example: `feat(source): add bulk create endpoint`.
- **Pre‑commit hook** runs ESLint; ensure staged files pass linting before committing.

## Environment Variables

- Copy `.env.example` to `.env` and fill in required values.
- Required services: PostgreSQL, Redis, Pinecone, R2 (or S3‑compatible), OpenAI.
- Use `src/config/index.ts` to access configuration; do not read `process.env` directly in modules.

## Path Aliases Quick Reference

- `@/` → `src/`
- `@/config` → `src/config`
- `@/database` → `src/database`
- `@/lib/*` → `src/lib/*`
- `@/modules/*` → `src/modules/*`
- `@/middlewares` → `src/middlewares`
- `@/utils` → `src/utils`
- `@/tests` → `src/tests`

## Additional Notes

- No Cursor rules (`.cursorrules`) or Copilot instructions (`.github/copilot‑instructions.md`) are present.
- The project uses `docker‑compose.yml` for local PostgreSQL and Redis.
- The OpenAPI specification is auto‑generated; update `src/docs/` when adding/removing endpoints.
- Always run `npm run lint` and `npm run test` after making changes to ensure code quality.
- When adding new dependencies, update `package.json` and run `npm install`.

---

_Last updated: December 2025_
