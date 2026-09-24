
import { External } from "@/packing/external"
import { Session } from "../session"

export const Subject = async () => {

    

    const Interaction = External({ url: "http://localhost:5000/subjects", "headers": { "Content-Type": "application/json" } })

    const Token = await Session()

    const token = await Token.get()


    return {

        create: Interaction((subject: { name: string, email: string, password: string }) => {

            return { body: subject }

        }, { method: "POST" }) <{ token: string }>,


        entry: Interaction((subject: { email: string, password: string }) => {

            return { body: subject }

        }, {
            method: "POST" }
        ) <{ token: string }>,

        me: Interaction(() => {

            return {}

        }, {
            endpoint: "/subjects", method: "GET", headers: { "Authorization": `Bearer ${token}`,  }
        })<{ subject: { identity: string, name: string, email: string } }>


    }


}
