import * as Database from "@/src/repository/index"
import Elysia, { status, t } from "elysia"
import jwt from "@elysia/jwt"
import bearer from "@elysia/bearer"









export const Authentication = 

new Elysia({ name: "Authentication" })
    .use(
        jwt({
            secret: process.env.JWT_SECRET!,
            alg: "HS256",
            exp: '100d'
        })
    )
    .use(
        bearer()
    )
   .macro("auth", {
        

        resolve: async ({ bearer, jwt, headers }) => {

            

            console.log("(Authenticaiton.Controller) from (macro) variable { headers }", headers)
            console.log("(Authenticaiton.Controller) from (macro) variable { bearer }", bearer)

            if(!bearer) 

                return status('Unauthorized', { error: true, data: { message: "without Bearer" }} )

            const token = await jwt.verify(bearer)

            if(!token)

                return status('Unauthorized', { error: true, data: { message: "invalid token" }})

            console.log("(Authenticaiton.Controller) from (macro) variable { token }", token)

            console.log("-".repeat(process.stdout.columns ?? 80))

            
            return { token } as unknown as ({ token: { subject: string, tenant: string, role: string }})


        },
    })
    .macro("permission", (rules: Omit<Schema.$Rule, "identity">[]) => ({

        auth: true,


        beforeHandle: async ({ token: { subject, tenant, role } }) => {

            const Regulation = Database.Regulation()

            
            console.log("(Entry) (Permission.Controller) from (macro) variable { token }")

            if(!await Regulation.can({ role, rules }))

                return status('Unauthorized', { error: true, data: { message: "cannot permission" }})


            console.log("(Permission.Controller) from (macro) variable { token }")


        }

    }))























/*import { db } from "@/src/db";
import { Rule } from "@/src/db/schema";
import { Subject } from "@/src/db/schema";
import jwt from "@elysia/jwt";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";














const App = new Elysia()
    .use(
        jwt(
            {
                name: "jwt",
                secret: process.env.SECRET_JWT_KEY! 
            }
        )
    ).post("/sign", async ({ body: { name, password, email }, jwt }) => {





        const hashpassword = await Bun.password.hash(password)

        
        if((await db.select().from(Subject).where(eq(Subject.email, email))).at(0))

            throw new Error()


        const { identity } = (await db.insert(Subject).values({ name, password: hashpassword, email }).returning({ identity: Subject.identity })).at(0)




    }, { 
        body: t.Object({

            name: t.String({ minLength: 1, maxLength: 255 }),

            password: t.String(),

            email: t.String({ format: 'email'})

        })
    })







*/