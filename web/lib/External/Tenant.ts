
import { External } from "@/packing/external"
import { Session } from "../session"

export const Tenant = async () => {

    

    const Interaction = External({ url: "http://localhost:5000/tenants", "headers": { "Content-Type": "application/json" } })

    const Token = await Session()

    const token = await Token.get()


    return {

        create: Interaction((tenant: { name: string }) => {

            return { body: tenant }

        }, {
            method: "POST", headers: { "Authorization": `Bearer ${token}`,  }
        }) <{ tenant: { identity: string } }>,

        add: { 

            member: Interaction((member: { email: string, role: string }) => {

                return { body: member }

            }, {
                endpoint: "/subjects", method: "POST", headers: { "Authorization": `Bearer ${token}`,  }
            })<{ belonging: { identity: string } }>

        },

        switch: Interaction((target: { tenant: { identity: string } }) => {

            return { body: target }

        }, {
            endpoint: "/switch", method: "POST", headers: { "Authorization": `Bearer ${token}`,  }
        })<{ token: string }>,


       

    }


}
