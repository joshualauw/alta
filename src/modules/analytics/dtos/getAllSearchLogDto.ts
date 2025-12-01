import { SearchLog } from "@/database/generated/prisma/client";
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

export type GetAllSearchLogResponse = SearchLog;
