"use server";
import * as External from "@/lib/External"
//role: { name: string, rule: string[] }
export async function Create(state, form){


    const Role = await External.Role()

    const role = { name: form.get("name"), rule: JSON.parse(form.get("rule")) }

    const { code, data } = await Role.create(role)

    if(code !== 200) return { error: true, message: ""}

    return "ok"


}


export async function Update(role: { role: string, rule: string[] }){


    const Role = await External.Role()

    const { code, data } = await Role.update(role)

    console.log("(ServerAction.Update) from (Role.ts) variable (data)", data)

    if(code !== 200) return { error: true, message: ""}

    return "ok"


}


export async function Delete(role: { role: string }){


    const Role = await External.Role()

    const { code, data } = await Role.delete(role)

    if(code !== 200) return { error: true, message: ""}

    return "ok"


}
