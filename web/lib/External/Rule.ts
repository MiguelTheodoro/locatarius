
import { External } from "@/packing/external"
import { Session } from "../session"

export const Rule = async () => {

    

    const Interaction = External({ url: "http://localhost:5000/rules", "headers": { "Content-Type": "application/json" } })

    const Token = await Session()

    const token = await Token.get()


    return {

        

        get: { 
            
            every: Interaction(() => {

                return {}

            }, {
                method: "GET", headers: { "Authorization": `Bearer ${token}`,  }
            }) <{ rule: { action: string, resource: string }[] }>,

            groupByResource: Interaction(() => {

                return {}

            }, {
                endpoint: "/groupbyresource", method: "GET", headers: { "Authorization": `Bearer ${token}`,  }
            }) <{ resource: string, permissions: { identity: string, action: string }[] }[]>,

            groupByAction: Interaction(() => {

                return {}

            }, {
                endpoint: "/groupbyaction", method: "GET", headers: { "Authorization": `Bearer ${token}`,  }
            }) <Record<"create" | "get" | "delete" | "update", { identity: string, resource: string }>>,

    
        },


    }


}
