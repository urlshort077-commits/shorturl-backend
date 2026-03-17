import { Router } from 'express';
import { urlController } from './urls.controller';
import { urlValidation } from './urls.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router()

router.post(
    '/',
    authenticate,
    validateRequest(urlValidation.createUrlValidation),
    urlController.createUrl
)

router.get(
    '/',
    authenticate,
    urlController.getMyUrls
)

router.get(
    '/:id',
    authenticate,
    urlController.getUrlById
)

router.patch(
    '/:id',
    authenticate,
    validateRequest(urlValidation.updateUrlValidation),
    urlController.updateUrl
)

router.delete(
    '/:id',
    authenticate,
    urlController.deleteUrl
)

export const urlRoutes = router