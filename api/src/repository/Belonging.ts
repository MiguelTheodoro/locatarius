
import { Prevent } from "@packing/prevent"
import { Fix } from "@packing/fix"
import { eq, or, and } from "drizzle-orm"
import * as Schema from "@schema/index"
import { db } from "@/src/db"


export const Belonging = () => {

    return {

        /*exist: Prevent(Fix(async (name: string, tenant: string): Promise<boolean> => {
        
            return !!(await db.$count(Schema.Role, eq(Schema.Role.name, name)))
        
        }, undefined, tenant), false),*/
        
        add: Prevent(async (belonging: Omit<Schema.$Belonging, "identity">) => {

            return (await db.insert(Schema.Belonging).values(belonging).returning({ identity: Schema.Belonging.identity })).at(0)?.identity

        }, false),

        get: Prevent(async (belonging: Omit<Schema.$Belonging, "role" | "identity"> | Pick<Schema.$Belonging, "identity">) => {

            if(belonging.identity)

                return (await db.select().from(Schema.Belonging).where(eq(Schema.Belonging.identity, belonging.identity)))[0]

            return (await db.select().from(Schema.Belonging).where(and(eq(Schema.Belonging.tenant, belonging.tenant), eq(Schema.Belonging.subject, belonging.subject))))[0]

        }, false),

        /*modify: Prevent(async (belonging: { ru}) => {


            belonging

            return await db.select({ action: Schema.Rule.action, resource: Schema.Rule.resource }).from(Schema.Rule).innerJoin(Schema.Belonging, eq(Schema.Rule.identity, Schema.Role.identity)).where(eq(Schema.Belonging.belonging, belonging))



        }, false),*/

        delete: Prevent(async (belonging: Omit<Schema.$Belonging, "role" | "identity"> & Pick<Schema.$Belonging, "identity">) => {

            return await db.delete(Schema.Belonging).where(or(eq(Schema.Belonging.identity, belonging.identity), and(eq(Schema.Belonging.tenant, belonging.tenant), eq(Schema.Belonging.subject, belonging.subject))))
        
        }, false),
        

    }

}


/*


    to bind rule for belonging

    name (role) tenant (identity) rule (identity)
    role (identity) role (identity)
*/