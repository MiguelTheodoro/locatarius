'use server';

import { redirect } from "next/navigation";
import * as External from "../External/Subject";
import { Session } from "../session";


export async function Create(previous: { error: boolean, message: string }, form: FormData){
    
    const Subject = await External.Subject()

    const subject = { name: form.get("name"), email: form.get("email"), password: form.get("password") } as { name: string, email: string, password: string }

    const { code, data } = await Subject.create(subject)
  
    if(code !== 200) return { error: true, message: JSON.stringify(data) }

    const Token = await Session()

    Token.add(data.token)

    redirect("/tenant/register")


}

