import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/user/user.routes';
import { urlRoutes } from '../modules/urls/urls.routes';

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/urls', urlRoutes)


export const IndexRoutes = router