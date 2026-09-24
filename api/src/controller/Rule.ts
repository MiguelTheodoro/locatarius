import Elysia, { status } from "elysia";
import { Authentication } from "./Authentication";
import * as Database from "@/src/repository"



export const Rule = new Elysia()
    .use(
        Authentication
    )
    .get("/rules", async ({ token: { tenant, subject }}) => {

        
        if(!tenant)

            return status("Bad Request")


        const Tenant = Database.Tenant(tenant)

        const owner  = await Tenant.owner()


        if(!owner)

            return status("Internal Server Error")


        if(owner !== subject)

            return status("Forbidden")

        const Rule = Database.Rule()

        const rule = await Rule.get.every(["identity", "action", "resource"])

        if(!rule)

            return status("Internal Server Error")

        return status("OK", { rule })


    }, {
        auth: true
    })
    .get("/rules/groupbyresource", async ({ token: { tenant, subject }}) => {

        
        if(!tenant)

            return status("Bad Request")


        const Tenant = Database.Tenant(tenant)

        const owner  = await Tenant.owner()

        console.log("(Controller.Rule) from (/rules/groupbyresource) variable { owner }", owner)


        if(!owner)

            return status("Internal Server Error")


        if(owner !== subject)

            return status("Forbidden")

        const Rule = Database.Rule()

        const rule = await Rule.get.groupByResource()

        console.log("(Controller.Rule) from (/rules/groupbyresource) variable { rule }", rule)

        if(!rule)

            return status("Internal Server Error")

        return status("OK", rule)


    }, {
        auth: true
    })
    .get("/rules/groupbyaction", async ({ token: { tenant, subject }}) => {

        
        if(!tenant)

            return status("Bad Request")


        const Tenant = Database.Tenant(tenant)

        const owner  = await Tenant.owner()

        console.log("(Controller.Rule) from (/rules/groupbyresource) variable { owner }", owner)


        if(!owner)

            return status("Internal Server Error")


        if(owner !== subject)

            return status("Forbidden")

        const Rule = Database.Rule()

        const rule = await Rule.get.groupByAction()

        console.log("(Controller.Rule) from (/rules/groupbyaction) variable { rule }", rule)

        if(!rule)

            return status("Internal Server Error")

        return status("OK", rule)


    }, {
        auth: true
    })

