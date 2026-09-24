import { Prevent } from "@packing/prevent"
import { Fix } from "@packing/fix"
import { eq, and, or, sql } from "drizzle-orm"
import * as Schema from "@schema/index"
import { db } from "@/src/db"

export const Role = (tenant?: string) => {

    return {

        exist: Prevent(Fix(async (name: string, tenant: string): Promise<boolean> => {
        
            return !!(await db.select({ exists: sql<number>`1` }).from(Schema.Role).where(and(eq(Schema.Role.name, name), eq(Schema.Role.tenant, tenant))).limit(1)).at(0)?.exists
        
        }, undefined, tenant), false),

        existWithIdentity: Prevent(Fix(async (identity: string, tenant: string): Promise<boolean> => {
        
            return !!(await db.select({ exists: sql<number>`1` }).from(Schema.Role).where(and(eq(Schema.Role.identity, identity), eq(Schema.Role.tenant, tenant))).limit(1)).at(0)?.exists
        
        }, undefined, tenant), false),

        
        
        add: Prevent(Fix(async (role: string, tenant: string) => {

            return (await db.insert(Schema.Role).values({ name: role , tenant }).returning({ identity: Schema.Role.identity })).at(0)?.identity

        }, undefined, tenant), false),


        get: Prevent(Fix(async (name: string, content: [keyof Schema.$Role], tenant: string) => {

            const select = {}
    
            for(const key of content) select[key] = Schema.Role[key]

            return (await db.select(select).from(Schema.Role).where(eq(Schema.Role.name, name))).at(0)

        }, undefined, undefined, tenant), false),




        getEvery: Prevent(Fix(async (tenant: string) => {

            return await db.select().from(Schema.Role).where(eq(Schema.Role.tenant, tenant))

        }, tenant), false),

        // update?

        delete: Prevent(Fix(async (role: string, tenant: string) => {

            return (await db.delete(Schema.Role).where(or(eq(Schema.Role.identity, role), eq(Schema.Role.name, role)))) || true
        
        }, undefined, tenant), false),



        

    }

}