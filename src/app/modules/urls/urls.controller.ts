import { Request, Response } from 'express';
import { urlService } from './urls.service';
import status from 'http-status';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';

const getParam = (param: string | string[]): string => {
    return Array.isArray(param) ? param[0] : param
}

const createUrl = catchAsync(async (req: Request, res: Response) => {
    const result = await urlService.createUrl(req.user.id, req.body)
    sendResponse(res, {
        httpStatuscode: status.CREATED,
        success:        true,
        message:        'URL created successfully',
        data:           result,
    })
})

const getMyUrls = catchAsync(async (req: Request, res: Response) => {
    const page  = Number(req.query.page)  || 1
    const limit = Number(req.query.limit) || 10
    const result = await urlService.getMyUrls(req.user.id, page, limit)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URLs fetched successfully',
        data:           result,
    })
})

const getUrlById = catchAsync(async (req: Request, res: Response) => {
    const result = await urlService.getUrlById(req.user.id, getParam(req.params.id))
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URL fetched successfully',
        data:           result,
    })
})

const updateUrl = catchAsync(async (req: Request, res: Response) => {
    const result = await urlService.updateUrl(req.user.id, getParam(req.params.id), req.body)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URL updated successfully',
        data:           result,
    })
})

const deleteUrl = catchAsync(async (req: Request, res: Response) => {
    await urlService.deleteUrl(req.user.id, getParam(req.params.id))
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URL deleted successfully',
        data:           null,
    })
})

const redirectUrl = catchAsync(async (req: Request, res: Response) => {
    const originalUrl = await urlService.redirectUrl(req, getParam(req.params.shortId))
    res.redirect(originalUrl)
})

export const urlController = {
    createUrl,
    getMyUrls,
    getUrlById,
    updateUrl,
    deleteUrl,
    redirectUrl,
}