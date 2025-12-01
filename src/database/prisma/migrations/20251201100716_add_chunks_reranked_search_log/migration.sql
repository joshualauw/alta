-- AlterTable
ALTER TABLE "SearchLog" ADD COLUMN     "chunksReranked" JSONB[] DEFAULT ARRAY[]::JSONB[];
