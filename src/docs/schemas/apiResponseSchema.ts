import z from "zod";

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.literal(true),
        data: dataSchema.nullable(),
        message: z.string(),
        errors: z.array(z.string()).length(0)
    });

export const pagingResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        items: z.array(dataSchema),
        totalItems: z.number(),
        totalPages: z.number(),
        hasNextPage: z.boolean(),
        hasPrevPage: z.boolean()
    });

export const validationErrorResponseSchema = z.object({
    success: z.literal(false),
    data: z.null(),
    message: z.string(),
    errors: z.array(z.string())
});

export const errorResponseSchema = z.object({
    success: z.literal(false),
    data: z.null(),
    message: z.string(),
    errors: z.array(z.string()).length(0)
});
