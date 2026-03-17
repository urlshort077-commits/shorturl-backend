import { Request, Response } from 'express';
import { userService } from './user.service';
import status from 'http-status';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';

const getProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getMyProfile(req.user.id)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:    true,
        message:    'Profile fetched successfully',
        data:       user,
    })
})

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updateMyProfile(req.user.id, req.body)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:    true,
        message:    'Profile updated successfully',
        data:       user,
    })
})

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
    await userService.deleteMyAccount(req.user.id)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:    true,
        message:    'Account deleted successfully',
        data:       null,
    })
})

export const userController = {
    getProfile,
    updateProfile,
    deleteAccount,
}