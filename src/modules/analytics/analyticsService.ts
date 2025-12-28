import { NotFoundError } from "@/lib/internal/errors";
import { prisma } from "@/lib/prisma";
import { GetDashboardStatisticsResponse } from "@/modules/analytics/dtos/getDashboardStatisticsDto";
import dayjs from "dayjs";

export async function getDashboardStatistics(): Promise<GetDashboardStatisticsResponse> {
    const [totalSources, totalSearches, totalGroups] = await prisma.$transaction([
        prisma.source.count(),
        prisma.searchLog.count(),
        prisma.group.count()
    ]);

    const monthlyTopSourcesAggregate = await prisma.searchLogSource.groupBy({
        by: ["sourceId"],
        where: {
            searchLog: {
                createdAt: {
                    gte: dayjs().startOf("month").toDate(),
                    lt: dayjs().startOf("month").add(1, "month").toDate()
                }
            }
        },
        _count: {
            sourceId: true
        },
        orderBy: {
            _count: {
                sourceId: "desc"
            }
        },
        take: 3
    });

    const monthlyTopSources = await Promise.all(
        monthlyTopSourcesAggregate.map(async (item) => ({
            count: item._count.sourceId,
            source: await prisma.source.findUnique({
                where: { id: item.sourceId },
                select: { name: true, id: true }
            })
        }))
    );

    if (monthlyTopSources.map((item) => item.source).includes(null)) {
        throw new NotFoundError("Source not found for top sources");
    }

    const monthlySearches = await prisma.searchLog.groupBy({
        by: ["day"],
        where: {
            createdAt: {
                gte: dayjs().startOf("month").toDate(),
                lt: dayjs().startOf("month").add(1, "month").toDate()
            }
        },
        _count: {
            id: true
        },
        orderBy: {
            day: "asc"
        }
    });

    return {
        statistics: {
            totalSources,
            totalSearches,
            totalGroups
        },
        monthlyTopSources: monthlyTopSources.map((item) => ({
            id: item.source!.id,
            name: item.source!.name,
            count: item.count
        })),
        monthlySearches: monthlySearches.map((item) => ({
            date: item.day.toISOString(),
            count: item._count.id
        }))
    };
}
