import { GetAllSearchLogQuery, GetAllSearchLogResponse } from "@/modules/analytics/dtos/getAllSearchLogDto";
import { prisma } from "@/lib/prisma";

export async function getAllSearchLog(query: GetAllSearchLogQuery): Promise<GetAllSearchLogResponse[]> {
    const searchLogs = await prisma.searchLog.findMany({
        where: {
            createdAt: {
                gte: new Date(query.startDate),
                lte: new Date(query.endDate)
            }
        }
    });

    return searchLogs;
}
