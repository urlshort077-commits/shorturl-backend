import { Request, Response } from 'express';

import { authService } from './auth.service';
import status from 'http-status';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';

const register = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body)
    sendResponse(res, {
        httpStatuscode: status.CREATED,
        success:    true,
        message:    'Registered successfully',
        data:       result,
    })
})

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:    true,
        message:    'Login successful',
        data:       result,
    })
})

export const authController = {
    register,
    login,
}