/*
  Warnings:

  - You are about to drop the column `chunksReranked` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `chunksRetrieved` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `embeddingTokenCost` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `readUnitCost` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `rerankUnitCost` on the `SearchLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SearchLog" DROP COLUMN "chunksReranked",
DROP COLUMN "chunksRetrieved",
DROP COLUMN "embeddingTokenCost",
DROP COLUMN "readUnitCost",
DROP COLUMN "rerankUnitCost",
ADD COLUMN     "chunks" JSONB[] DEFAULT ARRAY[]::JSONB[];
