/*
  Warnings:

  - You are about to drop the column `sourceIds` on the `SearchLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SearchLog" DROP COLUMN "sourceIds";

-- CreateTable
CREATE TABLE "SearchLogSource" (
    "id" SERIAL NOT NULL,
    "searchLogId" INTEGER NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLogSource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SearchLogSource" ADD CONSTRAINT "SearchLogSource_searchLogId_fkey" FOREIGN KEY ("searchLogId") REFERENCES "SearchLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLogSource" ADD CONSTRAINT "SearchLogSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
