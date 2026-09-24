

import * as Controller from "@/src/controller"
import Elysia from "elysia"



const Application = new Elysia()
    .mapResponse(({ responseValue } ) => {


        return new Response(
            JSON.stringify({
                error: responseValue.code != 200,
                code: responseValue.code,
                data: responseValue.response,

            })
        )

        
    })
    .use(Controller.Authentication)
    .use(Controller.Subject)
    .use(Controller.Tenant)
    .use(Controller.Role)
    .use(Controller.Rule)


Application.listen(5000, (Context) => {

    //console.clear()
    console.log(`Running on -> ${Context.protocol}://${Context.hostname}:${Context.port}`)

})


