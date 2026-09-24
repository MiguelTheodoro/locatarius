import { Prevent } from "@packing/prevent"
import { db } from "@/src/db"
import * as Schema from "@schema/index"
import { or, eq, sql } from "drizzle-orm"

export const Subject = () => {

    return {

        exist: Prevent(async (target: ({ identity: string, email?: string } | { identity?: string, email: string } | ({ identity: string } & { email: string}))): Promise<boolean> => {

            //return !!(await db.$count(Schema.Subject, target.identity ? eq(Schema.Subject.identity, target.identity) : eq(Schema.Subject.email, target.email) ))

            const restrition = []

            if(target?.identity) restrition.push(eq(Schema.Subject.identity, target.identity))
                
            if(target?.email) restrition.push(eq(Schema.Subject.email, target.email))


            return !!(await db.select({ exists: sql<number>`1` }).from(Schema.Subject).where(or(...restrition)).limit(1)).at(0)?.exists

        }, false),

        add: Prevent(async (subject: Omit<Schema.$Subject, "identity">) => {

            return (await db.insert(Schema.Subject).values(subject).returning({ identity: Schema.Subject.identity })).at(0)?.identity

        }, false),

        get: Prevent(async (subject: Partial<Omit<Schema.$Subject, "password">>) => {

        
            return (await db.select().from(Schema.Subject).where(or(
                ...Object.entries(subject).map(([key, value]) => eq(Schema.Subject[key as keyof Schema.$Subject],value))
            ))).at(0)
        
        }, false),

    }

}