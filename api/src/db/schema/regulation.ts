
import { sql, type InferSelectModel } from 'drizzle-orm'
import { Role } from '@/src/db/schema/role'
import { Rule } from '@/src/db/schema/rule'
import { Tenant } from '@/src/db/schema/tenant'
import { pgTable, uuid, unique } from 'drizzle-orm/pg-core'


export const Regulation = pgTable("regulation", {

    identity: uuid("identity").primaryKey().default(sql`uuidv7()`),

    role: uuid("role").references(() => Role.identity, { onDelete: 'cascade'}).notNull(),

    rule: uuid("rule").references(() => Rule.identity, { onDelete: 'cascade' }).notNull(),

    //tenant: uuid().references(() => Tenant.identity, { onDelete: 'cascade' }).notNull(),


}, (table) => [
    unique("unique_role_rule").on(table.role, table.rule)
])

export type $Regulation = InferSelectModel<typeof Regulation>



