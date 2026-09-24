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
