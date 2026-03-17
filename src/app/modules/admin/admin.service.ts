import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import status from 'http-status';

const getAllUsers = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take:    limit,
            include: { subscription: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count()
    ])
    return {
        data:       users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    }
}

const updateUserStatus = async (userId: string, userStatus: 'ACTIVE' | 'SUSPENDED') => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new AppError(status.NOT_FOUND, 'User not found')

    return prisma.user.update({
        where:   { id: userId },
        data:    { status: userStatus },
        include: { subscription: true }
    })
}

const getAllUrls = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit
    const [urls, total] = await Promise.all([
        prisma.urls.findMany({
            skip,
            take:    limit,
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.urls.count()
    ])
    return {
        data:       urls,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    }
}

const updateUrlStatus = async (urlId: string, urlStatus: 'AVAILABLE' | 'RESTRICTED') => {
    const url = await prisma.urls.findUnique({ where: { id: urlId } })
    if (!url) throw new AppError(status.NOT_FOUND, 'URL not found')

    return prisma.urls.update({
        where: { id: urlId },
        data:  { urlStatus },
    })
}

const getAllAnalytics = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit
    const [analytics, total] = await Promise.all([
        prisma.analytics.findMany({
            skip,
            take:    limit,
            include: { url: true },
            orderBy: { clickedAt: 'desc' },
        }),
        prisma.analytics.count()
    ])
    return {
        data:       analytics,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    }
}

const getAllPayments = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit
    const [payments, total] = await Promise.all([
        prisma.payments.findMany({
            skip,
            take:    limit,
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.payments.count()
    ])
    return {
        data:       payments,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    }
}

const getStats = async () => {
    const [totalUsers, totalUrls, totalClicks, revenue] = await Promise.all([
        prisma.user.count(),
        prisma.urls.count(),
        prisma.analytics.count(),
        prisma.payments.aggregate({ _sum: { amount: true } })
    ])

    const planCounts = await prisma.subscriptions.groupBy({
        by:     ['plan'],
        _count: { plan: true }
    })

    return {
        totalUsers,
        totalUrls,
        totalClicks,
        totalRevenue: revenue._sum.amount ?? 0,
        planCounts:   planCounts.map(p => ({
            plan:  p.plan,
            count: p._count.plan
        }))
    }
}

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllUrls,
    updateUrlStatus,
    getAllAnalytics,
    getAllPayments,
    getStats,
}