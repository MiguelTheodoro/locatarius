'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as External from "../External/index";
import { Session } from "../session";


export async function Create(state: { error: boolean, message: string }, form: FormData){
    
    const Tenant = await External.Tenant()

    const tenant = { name: form.get("name") } as { name: string }


    const { code: codeFromCreate, data: dataFromCreate } = await Tenant.create(tenant)
  
    if(codeFromCreate !== 200) return { error: true, message: JSON.stringify(dataFromCreate) }

    
    const { code: codeFromSwitch, data: dataFromSwitch } = await Tenant.switch(dataFromCreate)

    if(codeFromSwitch !== 200) return { error: true, message: JSON.stringify(dataFromSwitch) }
    

    
    const Token = await Session()

    console.log("(Action.Tenant) from [ Create ] (function) Token (variable) -> ", Token)

    Token.add(dataFromSwitch.token)

        revalidatePath("/")


}

export async function Include(state: { error: boolean, message: string }, form: FormData){
    
    const Tenant = await External.Tenant()

    const member = { email: form.get("email"), role: form.get("role") } as { email: string, role: string }


    const { code, data } = await Tenant.add.member(member)
  
    if(code !== 200) return { error: true, message: JSON.stringify(data) }


    revalidatePath("/")


}

