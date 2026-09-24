
import { eq, or, sql, and } from "drizzle-orm"
import { db } from "@db/index"
import  * as Schema from "@schema/index"

import { Prevent } from "@packing/prevent"
import { Fix } from "@packing/fix"




export const Tenant = (identity?: string) => {

    return {

        exist: {

            withIdentity: Prevent(Fix(async (tenant: Pick<Schema.$Tenant, "identity">): Promise<boolean> => {

                return !!(await db.select({ exists: sql<number>`1` }).from(Schema.Tenant).where(eq(Schema.Tenant.identity, tenant.identity)).limit(1)).at(0)?.exists

            }, (tenant: Schema.$Tenant) => ({ ...tenant, identity })), false),

            withNameAndOwner: Prevent(async (tenant: Omit<Schema.$Tenant, "identity">): Promise<boolean> => {

                return !!(await db.select({ exists: sql<number>`1` }).from(Schema.Tenant).where(
                    and(eq(Schema.Tenant.name, tenant.name), eq(Schema.Tenant.owner, tenant.owner))
                ).limit(1)).at(0)?.exists


            }, false),

        },
        
        
        /*Prevent(Fix(async (tenant: Schema.$Tenant): Promise<boolean> => {

            return !!(await db.select({ exists: sql<number>`1` }).from(Schema.Tenant).where(
                or(...Object.entries(tenant).map(([key, value]) => eq(Schema.Tenant[key as keyof Schema.$Tenant], value)))
            ).limit(1)).at(0)?.exists


        }, (tenant: Schema.$Tenant) => ({ ...tenant, identity })), false),*/

        add: Prevent(async (tenant: Omit<Schema.$Tenant, "identity">) => {

            return (await db.insert(Schema.Tenant).values(tenant).returning({ identity: Schema.Tenant.identity })).at(0)?.identity

        }, false),


        delete: Prevent(Fix(async (identity: string) => {

            return await db.delete(Schema.Tenant).where(eq(Schema.Tenant.identity, identity))
        
        }, identity), false),

        owner: Prevent(Fix(async (identity: string) => {

            return (await db.select({ owner: Schema.Tenant.owner }).from(Schema.Tenant).where(eq(Schema.Tenant.identity, identity))).at(0)?.owner

        }, identity), false)

    }

}





/*export const Tenant = (identity?: string) => {

    if(identity)

        return {

            owner: onError(async () => {

                return (await db.select({ owner: Schema.Tenant.owner }).from(Schema.Tenant).where(eq(Schema.Tenant.identity, identity))).at(0)

            }, false)

        }

    return {


        exist: onError(async (tenant: string): Promise<boolean> => {

            return !!(await db.$count(Schema.Tenant, eq(Schema.Tenant.identity, tenant || '')))

        }, false),

        add: onError(async (tenant: Omit<Schema.$Tenant, "identity">) => {

            return await db.insert(Schema.Tenant).values(tenant).returning({ identity: Schema.Tenant.identity })

        }, false),


        delete: onError(async (tenant: string) => {

            return await db.delete(Schema.Tenant).where(eq(Schema.Tenant.identity, tenant))
        
        }, false)

    }

}*/