import * as Database from "@/src/repository"
import { Belonging } from "@/src/db/schema";
import Elysia, { status, t } from "elysia";
import { Authentication } from "./Authentication";



export const Tenant = new Elysia()
    .use(
        Authentication
    )
    .onTransform( async (a) => {

            console.log("(tenant.controller) in (onRequest) request (variable) -> ", await a.body)

    })
    .post("/tenants", async ({ body, token }) => {

        const Tenant = Database.Tenant()

        


        if(await Tenant.exist.withNameAndOwner({ name: body.name, owner: token.subject }))

            return status("Conflict", { message: "Failed to add Tenant. That exist" })


        const tenant = await Tenant.add({ name: body.name, owner: token.subject })

        if(!tenant)

            return status("Internal Server Error", { message: "Failed to add Tenant" })


        const Role = Database.Role(tenant)

        const role = await Role.add("OWNER")

        
        if(!role)
            
            return status("Internal Server Error", { message: "Failed to add Role" })


        

        const Rule = Database.Rule()

        const rules = await Rule.get.every(['identity'])

        if(!rules)

            return status("Internal Server Error", { message: "Failed to add Rule" })

        
        const Regulation = Database.Regulation()

        for(let index = 0; index < rules.length; index++)

            if(!await Regulation.add({ role, rule: rules[index]?.identity as string }))

                return status("Internal Server Error", { rest: rules.slice(index) })


        const Belonging = Database.Belonging()

        Belonging.add({ subject: token.subject, tenant, role })

        return status("OK", { tenant: { identity: tenant } })


    }, {
        body: t.Object({
            name: t.String()
        }),
        auth: true
    })
    .post("/tenants/subjects", async ({ body, token: { subject, tenant } }) => {

        console.log("(Tenant.Controller) from ('/tenants/subjects') ", "ok")

        if(!tenant)

            return status("Bad Request", { message: "The Tenant not exist "})


        const Tenant = Database.Tenant(tenant)

        const owner  = await Tenant.owner()


        if(!owner)

            return status("Internal Server Error")


        if(owner !== subject)

            return status("Forbidden")


        const Role = Database.Role(tenant)

        //console.log("(Tenant.Controller) from ('/tenants/subjects') variable { role }", role)


        if(!await Role.existWithIdentity(body.role))

            return status("Not Found", { message: `The role with { ${body.role} } identity not exist`})

        


        const Subject = Database.Subject()

        const member = await Subject.get({ email: body.email })

        
        console.log("(Tenant.Controller) from ('/tenants/subjects') variable { member }", member)


        if(!member)

            return status("Not Found")

        
        
        const Belonging = Database.Belonging()

        const belonging = await Belonging.add({  subject: member.identity, tenant, role: body.role })

        return status("OK", { belonging: { identity: belonging } })

    

    }, {
        body: t.Object({
            email: t.String({ format: "email" }),
            role: t.String()
        }),
        auth: true
    })
    .post("tenants/switch", async ({ body: { tenant }, token: { subject }, jwt }) => {


        const Tenant = Database.Tenant(tenant.identity)

        if(!await Tenant.exist.withIdentity())

            return status("Not Found")


        const Belonging = Database.Belonging()

        const belonging = await Belonging.get({ tenant: tenant.identity, subject })

        if(!belonging)

            return status("Internal Server Error")


        const token = await jwt.sign({ subject, tenant: tenant.identity, role: belonging.role })

        return status("OK", { token })


    }, {
        auth: true,
        body: t.Object({
            tenant: t.Object({ 
                identity: t.String()
            })
        })
    })








/*

export const Tenant = new Elysia()
    .post('/tenants', async ({ body: { name }, cookie: { entity } }) => {

        const Tenant = Database.Tenant()

        if(await Tenant.exit({ name })

            return status("Conflict")

        const tenant = await Tenant.add({ name, owner: subject })

        entity.set({ value: { subject: "", tenant }, httpOnly: true, secure: true })

        return status('OK')


    }, {
        body: t.Object({
            name: t.String(),
        })
    })
    .post('/tenants/members', async ({ body: { email, role }, cookie: { entity } }) => {

        const Role = Database.Role({ tenant })

        const Tenant  = Database.Tenant({ tenant })

        const Subject = Database.Subject()

        const Belonging = Database.Belonging({ tenant })


        if(!await Role.exist(role))

            return status('Bad Request')


        if(await Tenant.owner() !== entity?.value.subject)

            return status('Bad Request')


        if(!await Subject.exit({ email }))

            return status('Bad Request')

        

        const subject = await Subject.get({ email })

        await Belonging.add({ subject, role })

        return status('OK')

    }, {
        body: t.Object({
            email: t.String({ format: "email" }),
            role: t.String()
        }),
        cookie: t.Object({
            entity: t.Object({
                value: t.Object({
                    subject: t.String(),
                    tenant: t.String()
                })
            })
        })
    })
    .delete('tenants/:identity', async ({ cookie: { entity } }) => {

        const Tenant  = Database.Tenant({ tenant })        


        if(!await Tenant.owner(entity?.value.subject))

            return status('Bad Request')


        await Tenant.remove()

        return status('OK')


    }, {
        params: t.Object({
            identity: t.String()
        }),
        cookie: t.Object({
            entity: t.Object({
                value: t.Object({
                    subject: t.String(),
                    tenant: t.String()
                })
            })
        })
    })

    
*/