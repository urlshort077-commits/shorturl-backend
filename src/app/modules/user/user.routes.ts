import { Router } from 'express';
import { userController } from './user.controller';
import { userValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router()

router.get(
    '/me',
    authenticate,
    userController.getProfile
)

router.patch(
    '/me',
    authenticate,
    validateRequest(userValidation.updateProfileValidation),
    userController.updateProfile
)

router.delete(
    '/me',
    authenticate,
    userController.deleteAccount
)

export const userRoutes = router