import { Authentication } from './Authentication';
import { Belonging } from '../db/schema/belonging';
import Elysia, { status, t } from "elysia";
import * as Database from "@/src/repository/index"











export const Subject = new Elysia({ name: "Subject" })
    .use(
        Authentication
    )
    .onTransform( async (a) => {

            console.log("(subject.controller) in (onRequest) request (variable) -> ", await a.body)

    })
    .post('/subjects', async (Context) => {

        const Subject = Database.Subject()

        const exist = await Subject.exist({ email: Context.body.email })

        console.log("Exist -> ", exist)

        if(exist)

            return status("Conflict")    


        const hash = await Bun.password.hash(Context.body.password, "argon2d")

        const subject_identity = await Subject.add({ ...Context.body, password: hash })

        console.log("(subject.controller) subject (variable) -> ", subject_identity)

        if(!subject_identity)

            return status("Internal Server Error")

        const token = await Context.jwt.sign({ subject: subject_identity })
        return status('OK', {token})


    }, {

        
        body: t.Object({
            name: t.String(),
            email: t.String({ format: 'email' }),
            password: t.String()
        })


    })
    .post("/subjects/entry", async (Context) => {

        const Subject = Database.Subject()
    

        if(! await Subject.exist({ email: Context.body.email }))

            return status("Not Found")    


        const subject = await Subject.get({ email: Context.body.email })

        if(!subject)

            return status("Internal Server Error")

        
        if(!await Bun.password.verify(Context.body.password, subject.password, "argon2d"))

            return status("Not Found")


        const token = await  Context.jwt.sign({ subject: subject.identity })

        return status('OK', {token})

    }, {
        body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String()
        })
    })
    .get("/subjects/me", async (Context) => {

        //console.log("(Suvject.Controller) from ('/subjects/me') variable { Context }", Context)

        const Subject = Database.Subject()

        const subject = await Subject.get({ identity: Context.token.subject })

        if(!subject)

            return status("Not Found")


        return status('OK', {subject})

    }, {
        auth: true
    })






    /*
    .get('/subjects/rules', async ({ cookie: { entity }}) => {
     
        const Belonging = Database.Belonging({ tenant })

        const Regulation = Database.Regulation({ tenant })

        const role = await Belonging.role(subject)


        if(!role)

            return status('Bad Request')


        return await Regulation.rule(role)

        
    }, {
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