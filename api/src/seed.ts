import * as Schema from "@schema/index"
import * as Database from "@repository/index"


const rules: Omit<Schema.$Rule, "identity">[] = [
    {
        action: "create",
        resource: "tenant"
    },
    {
        action: "update",
        resource: "role"
    },
    {
        action: "create",
        resource: "role"
    },
    {
        action: "delete",
        resource: "role"
    },
]


const Rule = Database.Rule()

for(const rule of rules)

    await Rule.add(rule)