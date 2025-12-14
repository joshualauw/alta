import { getAllSourceResponse } from "@/modules/source/dtos/getAllSourceDto";
import z from "zod";

const filterOperators = z.object({
    $eq: z.any().optional(),
    $ne: z.any().optional(),
    $gt: z.number().optional(),
    $gte: z.number().optional(),
    $lt: z.number().optional(),
    $lte: z.number().optional(),
    $in: z.array(z.string()).optional(),
    $nin: z.array(z.string()).optional()
});

export type FilterOperators = z.infer<typeof filterOperators>;

export const filterSourceRequest = z.record(z.string(), filterOperators);

export type FilterSourceRequest = z.infer<typeof filterSourceRequest>;

export const filterSourceResponse = z.array(getAllSourceResponse);

export type FilterSourceResponse = z.infer<typeof filterSourceResponse>;
