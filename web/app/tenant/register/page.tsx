import { FormTenant } from "@/components/custom/form-tenant"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"


export default async function Page(){

    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle>
                    Create Tenant
                </CardTitle>
                <CardDescription>
                    Enter with name form your tenant
                </CardDescription>
            </CardHeader>
            <CardContent>

                
                <FormTenant/>   

            </CardContent>
            <CardFooter>
                <Button type="submit" form="register">Submit</Button>
            </CardFooter>
        </Card>

    )

}