# Alta

Alta provides a simple, production-ready API for Retrieval-Augmented Generation (RAG). Instead of managing complex pipelines, chunking strategies, vector databases, and queues, you can build a complete RAG workflow by calling a few HTTP endpoints.

Alta handles ingestion, embeddings, retrieval, and generation so you can focus on your application—not the infrastructure behind it.

## 🚀 Motivation

Building a reliable RAG pipeline requires significant effort: text ingestion, chunking, embeddings, vector indexing, retrieval tuning, reranking, and prompt handling.

Alta abstracts all of this.
Upload your sources → query them with natural language → get high-quality answers.
No need to assemble your own RAG stack.

## ✨ Features

- **Source Management**: Upload documents, URLs, or raw text to build your knowledge base.
- **Grouping**: Organize sources into groups for better structure.
- **Bulk Upload**: Create multiple sources at once. Ingestion is processed asynchronously.
- **Ingestion Pipeline**: Automatic chunking, embedding, and vector storage.
- **Preset Configurations**: Customize chunk sizes, embedding models, and query sensitivity.
- **Smart Search**: Ask your sources using natural language with support for tone and reranking options.

## 🧱 Architecture

![Architecture](architecture.png)

Alta is built on a reliable and scalable stack:

- **Express** — Primary backend server and orchestrator.
- **OpenAI** — LLM for generating refined, human-readable answers from retrieved context.
- **BullMQ** — Queue processing system for background ingestion tasks.
- **PostgreSQL** — Stores raw sources, configurations, metadata, and analytics.
- **Pinecone** — High-performance vector database for embeddings and retrieval.
- **R2** - Scalable and secure object storage for storing user sources.

## 📦 Prequisites

- **Docker**
- **Node.js** ≥ v22
- **Pinecone account** https://www.pinecone.io/
- **OpenAI API key** https://openai.com/
- **Cloudflare account** https://developers.cloudflare.com/

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

Then populate the required values

### Running local developmet

Start required services:
```
docker compose up -d
```

Start the server and workers:
```
npm run dev:all
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
│  ├─ docs/                                  
│  │  ├─ paths/                              # OpenAPI (Swagger) list of paths using zod
│  │  ├─ schemas/                            # OpenAPI schema helpers
│  │  └─ generate.ts                         # Generate OpenAPI specs to file
│  ├─ lib/
│  │  ├─ bullmq/                             # BullMQ queue setup
│  │  ├─ internal/                           # Internal utilities (not exposed to modules)
│  │  ├─ openai/                             # OpenAI client + helper functions
│  │  ├─ pinecone/                           # Pinecone client + vector DB helpers
│  │  ├─ pino/                               # Logger setup (Pino)
│  │  ├─ prisma/                             # Prisma client instance
│  ├─ ├─ r2/                                 # R2 client + helper functions
│  ├─ middlewares/                           # Express middlewares (auth, errors, etc.)
│  ├─ modules/                               # Feature-based module architecture
│  │  └─ <module_name>/
│  │     ├─ dtos/                            # DTO schemas (validation)
│  │     ├─ workers/                         # BullMQ workers
│  │     ├─ controller.ts                    # Controller layer (HTTP request handlers)
│  │     ├─ route.ts                         # API route definitions
│  │     └─ service.ts                       # Business logic
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
├─ ecosystem.config.js                       # Scripts to run via PM2
└─ prisma.config.ts                          # Prisma CLI config
```