import z from "zod";

export const getAllSearchLogQuery = z
    .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date()
    })
    .refine((data) => data.startDate <= data.endDate, {
        message: "Start date cannot be after the end date.",
        path: ["startDate"]
    });

export type GetAllSearchLogQuery = z.infer<typeof getAllSearchLogQuery>;

export const getAllSearchLogResponse = z.object({
    id: z.number(),
    question: z.string(),
    answer: z.string(),
    responseTimeMs: z.number(),
    searchOptions: z.any(),
    isRerank: z.boolean(),
    tone: z.string(),
    metadataFilters: z.any().nullable(),
    readUnitCost: z.number(),
    rerankUnitCost: z.number().nullable(),
    embeddingTokenCost: z.number().nullable(),
    chunkRetrieved: z.array(z.any()),
    chunkReranked: z.array(z.any()),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type GetAllSearchLogResponse = z.infer<typeof getAllSearchLogResponse>;
