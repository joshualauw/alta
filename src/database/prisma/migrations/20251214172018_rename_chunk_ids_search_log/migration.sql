/*
  Warnings:

  - You are about to drop the column `chunks` on the `SearchLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SearchLog" DROP COLUMN "chunks",
ADD COLUMN     "chunkIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
