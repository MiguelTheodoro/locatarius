
import { Prevent } from "@packing/prevent"
import { Fix } from "@packing/fix"
import { eq, or } from "drizzle-orm"
import * as Schema from "@schema/index"
import { db } from "@/src/db"
import { isSwitchStatement } from 'typescript';

export const Regulation = (tenant?: string) => {

    return {

        /*exist: Prevent(Fix(async (name: string, tenant: string): Promise<boolean> => {
        
            return !!(await db.$count(Schema.Role, eq(Schema.Role.name, name)))
        
        }, undefined, tenant), false),*/
        
        add: Prevent(async (regulation: Omit<Schema.$Regulation, "identity">) => {

            return await db.insert(Schema.Regulation).values(regulation).returning({ identity: Schema.Regulation.identity })

        }, false),

        get: Prevent(async (role: string) => {

            return await db.select({ action: Schema.Rule.action, resource: Schema.Rule.resource }).from(Schema.Rule).innerJoin(Schema.Regulation, eq(Schema.Rule.identity, Schema.Role.identity)).where(eq(Schema.Regulation.role, role))

        }, false),

        getOnlyRuleIdentity: Prevent(async (role: string) => {

            return await db.select({ identity: Schema.Regulation.rule }).from(Schema.Regulation).where(eq(Schema.Regulation.role, role))

            //return await db.select({ identity: Schema.Rule.identity }).from(Schema.Rule).innerJoin(Schema.Regulation, eq(Schema.Regulation.rule, Schema.Rule.identity)where(eq(Schema.Regulation.role, role))

        }, false),

        /*modify: Prevent(async (regulation: { ru}) => {


            regulation

            return await db.select({ action: Schema.Rule.action, resource: Schema.Rule.resource }).from(Schema.Rule).innerJoin(Schema.Regulation, eq(Schema.Rule.identity, Schema.Role.identity)).where(eq(Schema.Regulation.role, role))



        }, false),*/

        delete: { 
            
            identity: Prevent(async (identity: string) => {

                return await db.delete(Schema.Role).where(eq(Schema.Regulation.identity, identity))
        
            }, false),

            role: Prevent(async (identity: string) => {

                return await db.delete(Schema.Regulation).where(eq(Schema.Regulation.role, identity))
        
            }, false),

        }
        

    }

}


/*


    to bind rule for role

    name (role) tenant (identity) rule (identity)
    role (identity) role (identity)
*/