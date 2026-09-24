
import { sql, type InferSelectModel } from 'drizzle-orm'

import { pgTable, uuid, varchar, pgEnum, unique } from 'drizzle-orm/pg-core'

export const ActionEnum = pgEnum("action", ["create", "get", "update", "delete"])

export const Rule = pgTable("rule", {

    identity: uuid("identity").primaryKey().default(sql`uuidv7()`),

    action: ActionEnum("action").notNull(),

    resource: varchar("resource", { length: 255 }).notNull(),
    
}, (table) => [
    unique("unique_action_resource").on(table.action, table.resource)
])

export type $Rule = InferSelectModel<typeof Rule>