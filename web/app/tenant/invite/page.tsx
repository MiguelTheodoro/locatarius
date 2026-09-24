import { Form } from "@/components/custom/form-invite"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"
import * as External from "@/lib/External"

export default async function Page(){

    const Role = await External.Role()

    const { code, data } = await Role.get.roles()

    if(code !== 200) return <p>error</p>


    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle>
                    Include Member
                </CardTitle>
                <CardDescription>
                    Enter with data to include email to your tenant
                </CardDescription>
            </CardHeader>
            <CardContent>

                
                <Form roles={data.role}/>   

            </CardContent>
            <CardFooter>
                <Button type="submit" form="include">Submit</Button>
            </CardFooter>
        </Card>

    )

}