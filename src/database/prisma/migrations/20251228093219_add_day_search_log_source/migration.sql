/*
  Warnings:

  - Added the required column `day` to the `SearchLogSource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SearchLogSource" DROP CONSTRAINT "SearchLogSource_sourceId_fkey";

-- AlterTable
ALTER TABLE "SearchLogSource" ADD COLUMN     "day" DATE NOT NULL;

-- AddForeignKey
ALTER TABLE "SearchLogSource" ADD CONSTRAINT "SearchLogSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
