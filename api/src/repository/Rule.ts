import { Prevent } from "@packing/prevent"
import { Fix } from "@packing/fix"
import { eq, and } from "drizzle-orm"
import * as Schema from "@schema/index"
import { db } from "@/src/db"

export const Rule = () => {

    return {
       
        add: Prevent(async (rule: Omit<Schema.$Rule, "identity">) => {

            return await db.insert(Schema.Rule).values(rule).returning({ identity: Schema.Rule.identity })

        }, false),

        get: {

            every: Prevent(async (content: (keyof Schema.$Rule)[]) => {

                const select: Map<keyof Schema.$Rule, any> = new Map()

                for(const key of content) select.set(key, Schema.Rule[key])

                return (await db.select(Object.fromEntries(select)).from(Schema.Rule)) as unknown as Schema.$Rule[]

            }, false),

            only: Prevent(async (identity: string) => {

                return (await db.select().from(Schema.Rule).where(eq(Schema.Rule.identity, identity))).at(0)

            }, false),

            groupByResource: Prevent(async () => {

                const rules = await db.select().from(Schema.Rule)

                console.log("(Repository.Rule) from (groupByResource) variable { rules }", rules)

                const group: Record<string, { identity: string, action: 'create' | 'get' | 'update' | 'delete' }[]> = {}

                rules.forEach(({ identity, action, resource }) => {
                    
                    if(!group[resource]) group[resource] = []

                    group[resource].push({ identity, action })

                })

                const g = []

                for(const resource in group)

                    g.push({ resource , permissions: group[resource]})

                return g
                
            }, false),

            groupByAction: Prevent(async () => {

                const rules = await db.select().from(Schema.Rule)

                const group: Record<'create' | 'get' | 'update' | 'delete', { identity: string, resource: string }[]> = {}

                
                rules.forEach(({ identity, action, resource }) => {
                    
                    if(!group[action]) group[action] = []

                    group[action].push({ identity, resource })

                })

                return group

            }, false)

        },

        // update?

        delete: Prevent(async (rule: Omit<Schema.$Rule, "identity">) => {

            return await db.delete(Schema.Rule).where(and(eq(Schema.Rule.action, rule.action), eq(Schema.Rule.resource, rule.resource)))
        
        }, false),
        

    }

}