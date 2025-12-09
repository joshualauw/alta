-- CreateTable
CREATE TABLE "Preset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "chunkSplitSize" INTEGER NOT NULL,
    "chunkSplitOverlap" INTEGER NOT NULL,
    "topK" INTEGER NOT NULL,
    "topN" INTEGER NOT NULL,
    "minSimilarityScore" DOUBLE PRECISION NOT NULL,
    "maxResponseTokens" INTEGER NOT NULL,
    "rerankModel" TEXT NOT NULL,
    "responsesModel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Preset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preset_code_key" ON "Preset"("code");
