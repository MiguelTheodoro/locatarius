
import { sql, type InferSelectModel } from 'drizzle-orm'
import { Tenant } from '@/src/db/schema/tenant'
import { pgTable, uuid, varchar, unique } from 'drizzle-orm/pg-core'

export const Role = pgTable("role", {

    identity: uuid("identity").primaryKey().default(sql`uuidv7()`),

    name: varchar("name", { length: 255 }).notNull(),

    tenant: uuid("tenant").references(() => Tenant.identity, { onDelete: 'cascade' }).notNull()

}, (table) => [unique("unique_role_name_per_tenant").on(table.name, table.tenant)])

export type $Role = InferSelectModel<typeof Role>