import express, { Application, json, Request, Response, urlencoded } from 'express'
import { IndexRoutes } from './app/routes';

const app: Application = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.use('/api/v1', IndexRoutes);

app.get('/', async(req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'API is working',
    })
})

export default app