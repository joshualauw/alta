/*
  Warnings:

  - You are about to drop the column `day` on the `SearchLogSource` table. All the data in the column will be lost.
  - Added the required column `day` to the `SearchLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SearchLogSource" DROP CONSTRAINT "SearchLogSource_searchLogId_fkey";

-- AlterTable
ALTER TABLE "SearchLog" ADD COLUMN     "day" DATE NOT NULL;

-- AlterTable
ALTER TABLE "SearchLogSource" DROP COLUMN "day";

-- AddForeignKey
ALTER TABLE "SearchLogSource" ADD CONSTRAINT "SearchLogSource_searchLogId_fkey" FOREIGN KEY ("searchLogId") REFERENCES "SearchLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
