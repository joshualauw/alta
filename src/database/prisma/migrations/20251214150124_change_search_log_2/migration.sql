/*
  Warnings:

  - You are about to drop the column `isRerank` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `metadataFilters` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `responseTimeMs` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `searchOptions` on the `SearchLog` table. All the data in the column will be lost.
  - Added the required column `rerank` to the `SearchLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SearchLog" DROP COLUMN "isRerank",
DROP COLUMN "metadataFilters",
DROP COLUMN "responseTimeMs",
DROP COLUMN "searchOptions",
ADD COLUMN     "filters" JSONB,
ADD COLUMN     "rerank" BOOLEAN NOT NULL;
