
import { sql, type InferSelectModel } from 'drizzle-orm'
import { Subject } from '@/src/db/schema/subject'
import { Tenant } from '@/src/db/schema/tenant'
import { Role } from '@/src/db/schema/role'
import { pgTable, uuid, unique } from 'drizzle-orm/pg-core'


export const Belonging = pgTable("belonging", {

    identity: uuid("identity").primaryKey().default(sql`uuidv7()`),

    subject: uuid("subject").references(() => Subject.identity, { onDelete: 'cascade' }).notNull(),

    tenant: uuid("tenant").references(() => Tenant.identity, { onDelete: 'cascade' }).notNull(),

    role: uuid("role").references(() => Role.identity, { onDelete: 'cascade'}).notNull()

}, (table) => [
    unique("unique_subject_tenant").on(table.subject, table.tenant)
])

export type $Belonging = InferSelectModel<typeof Belonging>