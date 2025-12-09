/*
  Warnings:

  - You are about to drop the column `tokenCost` on the `SearchLog` table. All the data in the column will be lost.
  - Added the required column `readUnitCost` to the `SearchLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SearchLog" DROP COLUMN "tokenCost",
ADD COLUMN     "embeddingTokenCost" INTEGER,
ADD COLUMN     "readUnitCost" INTEGER NOT NULL,
ADD COLUMN     "rerankUnitCost" INTEGER;
