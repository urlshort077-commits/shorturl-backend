import app from "./app"
import 'dotenv/config'

const bootstrap = () => {
    try {
        app.listen(process.env.PORT, () => {
            console.log('Server is running on ')
        })
    } catch (err) {
        console.error('Failed to start the server', err)
    }
}

bootstrap()