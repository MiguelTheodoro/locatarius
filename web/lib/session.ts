
import { cookies } from "next/headers"

export const Session = async () => {

    const cookie = await cookies()

    return {

        add: (session: string) => {

            cookie.set("session", session)

        },

        get: () => {

            return cookie.get("session")?.value

        }

    }


}