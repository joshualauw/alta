import z from "zod";

export const getSourcePresignedUrlResponse = z.object({
    url: z.string(),
    objectKey: z.string()
});

export type GetSourcePresignedUrlResponse = z.infer<typeof getSourcePresignedUrlResponse>;
