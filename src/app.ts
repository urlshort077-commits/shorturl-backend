import express, { Application, json, Request, Response, urlencoded, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { IndexRoutes } from './app/routes'
import { urlController } from './app/modules/urls/urls.controller'
import { globalErrorHandler } from './app/middlewares/globalErrorHandler'
import { notFound } from './app/middlewares/notFound'
import { envVars } from './config/envVars'

const app: Application = express()

app.set('trust proxy', true)
app.use(helmet())

app.use('/api/v1', cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            envVars.FRONTEND_URL,
        ]
        if (!origin && envVars.NODE_ENV === 'development') {
            return callback(null, true)
        }
        if (allowedOrigins.includes(origin!)) {
            return callback(null, true)
        }
        callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
}))

app.use(compression())

if (envVars.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      10,
    message:  'Too many login attempts, please try again later'
})

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      100,
    message:  'Too many requests, please try again later'
})

const redirectLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max:      30,
    message:  'Too many redirects, please try again later'
})

app.use('/api/v1/auth', authLimiter)
app.use('/api/v1',      apiLimiter)

app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }))

app.use(json())
app.use(urlencoded({ extended: true }))

app.use('/api/v1', IndexRoutes)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'API is working',
    })
})

const excluded = ['favicon.ico', 'robots.txt', 'sitemap.xml']

app.get('/:shortId', redirectLimiter, (req: Request, res: Response, next: NextFunction) => {
    if (excluded.includes(req.params.shortId as string)) return next()
    urlController.redirectUrl(req, res, next)
})

app.use(notFound)
app.use(globalErrorHandler)

export default app