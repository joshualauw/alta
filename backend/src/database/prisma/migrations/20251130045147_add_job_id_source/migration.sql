/*
  Warnings:

  - A unique constraint covering the columns `[jobId]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "jobId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Source_jobId_key" ON "Source"("jobId");
