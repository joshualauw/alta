-- CreateEnum
CREATE TYPE "SourceStatus" AS ENUM ('PENDING', 'FAILED', 'DONE');

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "status" "SourceStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "statusReason" TEXT;
