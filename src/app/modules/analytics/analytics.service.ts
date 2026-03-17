import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import status from 'http-status';

const getAllMyAnalytics = async (userId: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit
    const [analytics, total] = await Promise.all([
        prisma.analytics.findMany({
            where: { url: { userId } },
            skip,
            take:  limit,
            include: {
                url: {
                    select: {
                        shortUrl:    true,
                        customUrl:   true,
                        originalUrl: true,
                        totalClicks: true,
                    }
                }
            },
            orderBy: { clickedAt: 'desc' },
        }),
        prisma.analytics.count({
            where: { url: { userId } }
        })
    ])

    return {
        data: analytics,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    }
}

const getUrlAnalytics = async (userId: string, urlsId: string) => {
    const url = await prisma.urls.findFirst({
        where: { id: urlsId, userId }
    })
    if (!url) throw new AppError(status.NOT_FOUND, 'URL not found')

    const analytics = await prisma.analytics.findMany({
        where:   { urlsId },
        orderBy: { clickedAt: 'desc' },
    })

    return {
        url: {
            id:          url.id,
            shortUrl:    url.shortUrl,
            customUrl:   url.customUrl,
            originalUrl: url.originalUrl,
            totalClicks: url.totalClicks,
            urlStatus:   url.urlStatus,
        },
        totalClicks: url.totalClicks,
        analytics,
    }
}

export const analyticsService = {
    getAllMyAnalytics,
    getUrlAnalytics,
}