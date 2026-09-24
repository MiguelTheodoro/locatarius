import Elysia, { status, t } from "elysia";
import * as Database from "@/src/repository/index"
import { Authentication } from "./Authentication";













export const Role = new Elysia()
    .use(
        Authentication
    )
    .post("/roles", async ({ body, token: { subject, tenant }}) => {

        console.log("(Role.Controller) from ('/roles') variable { tenant }", tenant)

        if(!tenant)

            return status("Bad Request", { message: "The Tenant not exist"})


        const Tenant = Database.Tenant(tenant)

        const owner  = await Tenant.owner()


        if(!owner)

            return status("Internal Server Error")


        if(owner !== subject)

            return status("Forbidden")



        const Role = Database.Role(tenant)


        if(await Role.exist(body.name))

            return status('Conflict')


        const role = await Role.add(body.name)


        if(!role)
            
            return status("Internal Server Error")


        const Regulation = Database.Regulation(tenant)


        for(let index = 0; index < body.rule.length; index++)

            if(!await Regulation.add({ role, rule: body.rule[index] as string }))

                return status("Internal Server Error", { rest: body.rule.slice(index) })

        return status('OK', { role: { identity: role } })

    }, {
        body: t.Object({
            name: t.String(),
            rule: t.Array(t.String())
        }),
        auth: true
        
    })
    .get("/roles/rules", async ({ token: { role }}) => {


        const Regulation = Database.Regulation()

        const rule = await Regulation.get(role)

        if(!rule)

            return status("Internal Server Error")


        return status('OK', { rule })


    }, {
        auth: true
    })
    .get("/roles", async ({ token: { tenant }}) => {

        
        
        const Role = Database.Role()
        
        const roles = await Role.getEvery(tenant)
        
        console.log("(Role.Controller) method (get) from ('/roles') variable { roles }", roles)

        if(!roles)

            return status("Internal Server Error")


        const Regulation = Database.Regulation()


        const rolesWithRules = []

        for(const role of roles){

            const regulation = await Regulation.getOnlyRuleIdentity(role.identity)

            if(!regulation) return status("Internal Server Error")


            rolesWithRules.push({ ...role, rule: regulation.map(({ identity }) => identity) }) 

        }

        console.log("(Role.Controller) method (get) from ('/roles') variable { rolesWithRules }", rolesWithRules)


        return status('OK', rolesWithRules )


    }, {
        auth: true
    })
    .put("/roles", async ({ body, token: { subject, tenant }}) => {

        console.log("(Controller.Role) '/roles' (target) put (interaction) tenant (variable) -> ", tenant)

        if(!tenant)

            return status("Bad Request", { message: "The Tenant not exist"})


        const Tenant = Database.Tenant(tenant)

        const owner  = await Tenant.owner()


        if(!owner)

            return status("Internal Server Error")


        if(owner !== subject)

            return status("Forbidden")



        const Role = Database.Role(tenant)


        if(!await Role.existWithIdentity(body.role))

            return status('Bad Request')


        const Regulation = Database.Regulation(tenant)


        const regulation = await Regulation.delete.role(body.role)


        if(!regulation)

            return status("Internal Server Error")

        

        for(let index = 0; index < body.rule.length; index++)

            if(!await Regulation.add({ role: body.role, rule: body.rule[index] as string }))

                return status("Internal Server Error", { rest: body.rule.slice(index) })

        return status('OK', { role: { identity: body.role } })

    }, {
        body: t.Object({
            role: t.String(),
            rule: t.Array(t.String())
        }),
        auth: true
        
    })
    .delete("/roles", async ({ body, token: { subject, tenant }}) => {

        console.log("(Controller.Role) '/roles' (target) put (interaction) tenant (variable) -> ", tenant)

        if(!tenant)

            return status("Bad Request", { message: "The Tenant not exist"})


        const Tenant = Database.Tenant(tenant)

        const owner  = await Tenant.owner()


        if(!owner)

            return status("Internal Server Error")


        if(owner !== subject)

            return status("Forbidden")



        const Role = Database.Role(tenant)


        if(!await Role.existWithIdentity(body.role))

            return status('Bad Request')

        
        const remove = await Role.delete(body.role)

        if(!remove)

            return status("Internal Server Error")


        return status("OK")


    }, {
        body: t.Object({
            role: t.String(),
        }),
        auth: true
        
    })