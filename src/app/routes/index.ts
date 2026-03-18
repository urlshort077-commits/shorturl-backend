import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { userRoutes } from '../modules/user/user.routes.js';
import { urlRoutes } from '../modules/urls/urls.routes.js';
import { adminRoutes } from '../modules/admin/admin.routes.js';
import { analyticsRoutes } from '../modules/analytics/analytics.routes.js';


const router = Router()

router.use('/auth',      authRoutes)
router.use('/users',     userRoutes)
router.use('/urls',      urlRoutes)
router.use('/admin',     adminRoutes)
router.use('/analytics', analyticsRoutes)
// router.use('/payments',  paymentRoutes)

export const IndexRoutes = router