import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import admin from '../../../config/firebase';
import status from 'http-status';

const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where:   { id: userId },
        include: { subscription: true }
    })
    if (!user) throw new AppError(status.NOT_FOUND, 'User not found')
    return user
}

const updateMyProfile = async (userId: string, data: {
    name?:      string
    avatarUrl?: string
}) => {
    const user = await prisma.user.update({
        where:   { id: userId },
        data,
        include: { subscription: true }
    })
    return user
}

const deleteMyAccount = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user) throw new AppError(status.NOT_FOUND, 'User not found')

    await admin.auth().deleteUser(user.firebaseUid)
    await prisma.user.delete({ where: { id: userId } })
}

export const userService = {
    getMyProfile,
    updateMyProfile,
    deleteMyAccount,
}