/* eslint-disable @typescript-eslint/no-explicit-any */

export const External = (fallback: RequestInit & { url: string }) => {


    return <Argument extends any[], Return>(fn: (...args: Argument) => Partial<Record<"param" | "query" | "body", Record<string, any>>>, custom: RequestInit & { endpoint?: string }) => {
        
        return async <Response>(...args: Argument): Promise<{ code: number, data: Response }> =>  {


            const url = new URL(`${fallback.url.endsWith("/") ? fallback.url.slice(0, fallback.url.length - 2) : fallback.url }${custom?.endpoint ? '/' : ''}${custom?.endpoint?.split('/').filter(Boolean).join('/') ?? ''}`)


            
            //(custom.endpoint.startsWith('/') ? custom.endpoint : `/${custom.endpoint}`).endsWith('/') ? 

            ///const url = new URL(`${requestInfo}${(requestInfo.endsWith('/') ? '' : '/') + config.endpoint?.replaceAll('/', '')}`)

            const aggregation = await fn(...args)

        
                
            if("param" in aggregation)
                
                url.pathname += `/${aggregation.param}`
                

            if("query" in aggregation) 
                
                url.search = new URLSearchParams(aggregation.query).toString()


            if("body" in aggregation) 
                
                fallback.body = aggregation.body as unknown as ReadableStream<Uint8Array<ArrayBuffer>>


     
            console.log("(HighOrderFunction.External) variable (url, fallback, custom) -> ", {   ...fallback, url, ...custom  })
            console.log("(HighOrderFunction.External) variable (url) -> ", url.toString())
            console.log("(HighOrderFunction.External) variable (body) -> ", JSON.stringify(fallback.body))
            
            
            const response = await fetch(url.toString(), { ...fallback, body: JSON.stringify(fallback.body), ...custom, cache: "no-store"} as unknown as RequestInit)
            
            console.log("(HighOrderFunction.External) variable (response) -> ", { response })

            const json = await response.json()
            
            return { code: response.status, data: "data" in json ? json["data"] : json }

        }

    }
}