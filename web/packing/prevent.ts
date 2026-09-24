

/*const Asynchronous = (async () => {}).name === ''


export const Context = <Argument extends any[], Return>(fn: (...argument: Argument) => Return) => {

    if(fn..)


}*/




export const Prevent = <Argument extends any[], Return, const Fallback>(fn: (... args: Argument) => Return,  fallback: Fallback): (... args: Argument) => Promise<Return | Fallback> =>  {

    return async (... args: Argument): Promise<Return | Fallback> => {

        try {

            return await fn(...args)

        }

        catch(error){

            console.log("Error -> ", error)

            return fallback

        }

    }

}

export const onError = <Type>(callback: (...data: Type[]) => Promise<any>, options?: any | ((error: unknown) => any) | Error | string) => {

    return async (...data: Type[]) => { 
    
        try {

            const result = await callback(...data)

            return result

        }

        catch(error){

            if(typeof options === "string" || typeof options === "object" || typeof options === "boolean")

                return options

            if(typeof options === "function")

                return await options(error)

            return error
            

        }
        
    }
}


