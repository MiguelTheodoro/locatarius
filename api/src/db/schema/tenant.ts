
import { sql, type InferSelectModel } from 'drizzle-orm'
import { Subject } from '@/src/db/schema/subject'
import { pgTable, uuid, varchar, unique } from 'drizzle-orm/pg-core'

export const Tenant = pgTable("tenant", {

    identity: uuid("identity").primaryKey().default(sql`uuidv7()`),

    name: varchar("name", { length: 255 }).notNull(),

    owner: uuid("owner").references(() => Subject.identity, { onDelete: 'cascade'}).notNull(),

}, (table) => [
    unique("unique_tenant_per_owner").on(table.name, table.owner)
])

export type $Tenant = InferSelectModel<typeof Tenant>