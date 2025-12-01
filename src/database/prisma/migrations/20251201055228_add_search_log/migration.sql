-- CreateTable
CREATE TABLE "SearchLog" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "responseTimeMs" DOUBLE PRECISION NOT NULL,
    "searchOptions" JSONB NOT NULL,
    "isRerank" BOOLEAN NOT NULL,
    "tone" TEXT NOT NULL,
    "metadataFilters" JSONB,
    "tokenCost" INTEGER NOT NULL,
    "chunksRetrieved" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);
