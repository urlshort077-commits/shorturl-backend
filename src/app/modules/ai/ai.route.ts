import { Router } from 'express'
import { chatWithAI } from './ai.controller'

const router = Router()

router.post('/chat', chatWithAI)

export const aiRoutes = router