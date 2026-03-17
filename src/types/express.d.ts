import { Subscriptions, User } from "../../generated/prisma/client"

declare global {
    namespace Express {
        interface Request {
            firebaseUid: string
            user: User & {
                subscription: Subscriptions | null
            }
        }
    }
}

export { }