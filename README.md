# Alta

Alta provides a simple, production-ready API for Retrieval-Augmented Generation (RAG). Instead of managing complex pipelines, chunking strategies, vector databases, and queues, you can build a complete RAG workflow by calling a few HTTP endpoints.

Alta handles ingestion, embeddings, retrieval, and generation so you can focus on your application—not the infrastructure behind it.

## 🚀 Motivation

Building a reliable RAG pipeline requires significant effort: text ingestion, chunking, embeddings, vector indexing, retrieval tuning, reranking, and prompt handling.

Alta abstracts all of this.
Upload your sources → query them with natural language → get high-quality answers.
No need to assemble your own RAG stack.

## ✨ Features

- Source Management
Upload documents, URLs, or raw text to build your knowledge base.

- Grouping
Organize sources into groups for better structure and targeted querying.

- Bulk Upload
Create multiple sources at once. Ingestion is processed asynchronously.

- Automated Ingestion Pipeline
Automatic chunking, embedding, and vector storage.

- Preset Configurations
Customize chunk sizes, embedding models, and query sensitivity.

- Smart Search
Ask your sources using natural language with support for tone and reranking options.

## 🧱 Architecture

![Architecture](architecture.png)

Alta is built on a reliable and scalable stack:

- Express.js — Primary backend server and orchestrator.
- OpenAI — LLM for generating refined, human-readable answers from retrieved context.
- BullMQ — Queue processing system for background ingestion tasks.
- PostgreSQL — Stores raw sources, configurations, metadata, and analytics.
- Pinecone — High-performance vector database for embeddings and retrieval.

## 📦 Prequisites

- Docker
- Node.js ≥ v22
- Pinecone account
https://www.pinecone.io/
- OpenAI API key
https://openai.com/

## Project Setup

Clone the repository:
```
git clone https://github.com/joshualauw/alta.git
cd alta
```

Copy the environment template:
```
cp .env.example .env
```

Then populate the required values:
```
PORT=3001
NODE_ENV=development

RATE_LIMIT_WINDOW=300000
RATE_LIMIT_MAX_REQ=100

DATABASE_URL=postgresql://postgres:123456@localhost:5433/alta
REDIS_HOST=localhost
REDIS_PORT=6379

PINECONE_API_KEY=pcsk_
PINECONE_INDEX_NAME=alta-dev

OPENAI_API_KEY=sk_
ALTA_API_KEY=alta_

```

### Running local developmet

Start required services:
```
docker-compose -d up
```

Start the server and workers:
```
npm run dev
npm run source-worker:dev
npm run search-log-worker:dev
```

Then open API documentation at: http://localhost:3001/docs

## Project Structure

``` 
alta/
├─ src/                                      # Application source code
│  ├─ config/                                # App configuration (env, constants, settings)
│  ├─ database/
│  │  └─ prisma/
│  │     ├─ migrations/                      # Prisma migration history
│  │     ├─ schema.prisma                    # Prisma data model + datasource
│  │     └─ seed.ts                          # Database seeding script
│  ├─ lib/
│  │  ├─ bullmq/                             # BullMQ queues and job processors
│  │  ├─ internal/                           # Internal utilities (not exposed to modules)
│  │  ├─ openai/                             # OpenAI client + helper functions
│  │  ├─ openapi/                            # OpenAPI (Swagger) generation & configs
│  │  ├─ pinecone/                           # Pinecone client + vector DB helpers
│  │  ├─ pino/                               # Logger setup (Pino)
│  │  ├─ prisma/                             # Prisma client instance
│  │  └─ rate-limit/                         # Rate limiting utilities & middlewares
│  ├─ middlewares/                           # Express middlewares (auth, errors, etc.)
│  ├─ modules/                               # Feature-based module architecture
│  │  └─ <module_name>/
│  │     ├─ dtos/                            # DTO schemas (validation)
│  │     ├─ controller.ts                    # Controller layer (HTTP request handlers)
│  │     ├─ route.ts                         # API route definitions
│  │     └─ groupService.ts                  # Business logic for grouping functionality
│  ├─ tests/
│  │  ├─ dummy/                              # Dummy data for tests
│  │  ├─ integration/                        # Integration test suites
│  │  ├─ mock.ts                             # Shared mocks
│  │  ├─ prisma.ts                           # Prisma test setup
│  │  └─ setup.ts                            # Global test setup & config
│  ├─ types/                                 # Global TypeScript type definitions
│  ├─ utils/                                 # Reusable helper utilities
│  └─ index.ts                               # Main server entrypoint
├─ openapi.yml                               # OpenAPI specification file
├─ eslint.config.mts                         # ESLint configuration
├─ package.json                              # Dependencies & npm scripts
├─ tsconfig.json                             # TypeScript configuration
├─ vite.config.ts                            # Vite config (for docs/tools)
└─ prisma.config.ts                          # Prisma CLI config

```