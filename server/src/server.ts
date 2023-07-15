import 'dotenv/config'
import { createApp } from "./app";

export async function createServer() {
    const app = await createApp()

    const port = parseInt(process.env.PORT, 10) || 3000

    return app.listen(
        port,
        () => {
            console.log(`Server listening on port ${port}`)
        }
    )
}

createServer()