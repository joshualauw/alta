import { getAllSourceResponse } from "@/modules/source/dtos/getAllSourceDto";
import { filterSchema } from "@/modules/source/dtos/searchSourceDto";
import z from "zod";

export const filterSourceRequest = filterSchema;

export type FilterSourceRequest = z.infer<typeof filterSourceRequest>;

export const filterSourceResponse = z.array(getAllSourceResponse);

export type FilterSourceResponse = z.infer<typeof filterSourceResponse>;
