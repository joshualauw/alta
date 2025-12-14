/*
  Warnings:

  - You are about to drop the column `filters` on the `SearchLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SearchLog" DROP COLUMN "filters",
ADD COLUMN     "sourceIds" INTEGER[];
