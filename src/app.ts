import express, { Application, json, Request, Response, urlencoded } from 'express'

const app: Application = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.get('/', async(req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'API is working',
    })
})

export default app