import { Request, Response } from 'express';
import { adminService } from './admin.service';
import status from 'http-status';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';

const getParam = (param: string | string[]): string => {
    return Array.isArray(param) ? param[0] : param
}

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const page  = Number(req.query.page)  || 1
    const limit = Number(req.query.limit) || 10
    const result = await adminService.getAllUsers(page, limit)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Users fetched successfully',
        data:           result,
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.updateUserStatus(
        getParam(req.params.id),
        req.body.status
    )
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'User status updated successfully',
        data:           result,
    })
})

const getAllUrls = catchAsync(async (req: Request, res: Response) => {
    const page  = Number(req.query.page)  || 1
    const limit = Number(req.query.limit) || 10
    const result = await adminService.getAllUrls(page, limit)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URLs fetched successfully',
        data:           result,
    })
})

const updateUrlStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.updateUrlStatus(
        getParam(req.params.id),
        req.body.urlStatus
    )
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URL status updated successfully',
        data:           result,
    })
})

const getAllAnalytics = catchAsync(async (req: Request, res: Response) => {
    const page  = Number(req.query.page)  || 1
    const limit = Number(req.query.limit) || 10
    const result = await adminService.getAllAnalytics(page, limit)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Analytics fetched successfully',
        data:           result,
    })
})

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const page  = Number(req.query.page)  || 1
    const limit = Number(req.query.limit) || 10
    const result = await adminService.getAllPayments(page, limit)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Payments fetched successfully',
        data:           result,
    })
})

const getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getStats()
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Stats fetched successfully',
        data:           result,
    })
})

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllUrls,
    updateUrlStatus,
    getAllAnalytics,
    getAllPayments,
    getStats,
}