
import { External } from "@/packing/external"
import { Session } from "../session"

export const Role = async () => {

    

    const Interaction = External({ url: "http://localhost:5000/roles", "headers": { "Content-Type": "application/json" } })

    const Token = await Session()

    const token = await Token.get()


    return {

        create: Interaction((role: { name: string, rule: string[] }) => {

            return { body: role }

        }, {
            method: "POST", headers: { "Authorization": `Bearer ${token}`,  }
        }) <{ role: { identity: string } }>,


        update: Interaction((role: { role: string, rule: string[] }) => {

            return { body: role}

        }, {
            method: "PUT", headers: { "Authorization": `Bearer ${token}`}
        }) <{ role: { identity: string } }>,


        delete: Interaction((role: { role: string }) => {

            return { body: role}

        }, {
            method: "DELETE", headers: { "Authorization": `Bearer ${token}`}
        }) <undefined>,


        get: { 
            
            rules: Interaction(() => {

                return {}

            }, {
                endpoint: "/rules", method: "GET", headers: { "Authorization": `Bearer ${token}`,  }
            }) <{ rule: { action: string, resource: string }[] }>,

        

            roles: Interaction(() => {

                return {}

            }, {
                method: "GET", headers: { "Authorization": `Bearer ${token}`,  }
            })<{ role: { identity: string, name: string, tenant: string }[] }>,


            every: Interaction(() => {

                return {}

            }, {
                method: "GET", headers: { "Authorization": `Bearer ${token}`,  }
            })<{ identity: string, name: string, tenant: string, rule: string[] }[]>
    
        },


    }


}
