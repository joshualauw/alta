import z from "zod";

export const getDashboardStatisticsResponse = z.object({
    statistics: z.object({
        totalSources: z.number(),
        totalSearches: z.number(),
        totalGroups: z.number()
    }),
    monthlyTopSources: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            count: z.number()
        })
    ),
    monthlySearches: z.array(
        z.object({
            date: z.string(),
            count: z.number()
        })
    )
});

export type GetDashboardStatisticsResponse = z.infer<typeof getDashboardStatisticsResponse>;
