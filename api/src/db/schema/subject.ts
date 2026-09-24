
import { sql, type InferSelectModel } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'


export const Subject = pgTable("subject", {

    identity: uuid("identity").primaryKey().default(sql`uuidv7()`),

    name: varchar("name", { length: 255 }).notNull(),
    
    password: varchar("password", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 }).notNull().unique()

})



export type $Subject = InferSelectModel<typeof Subject>