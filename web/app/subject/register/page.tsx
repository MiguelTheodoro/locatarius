
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card"

import { Form } from "@/components/custom/form-subject"

export default async function Page(){

    return (
        <Card className="w-full max-w-sm m-auto">
            <CardHeader>
                <CardTitle>
                    Create Subject
                </CardTitle>
                <CardDescription>
                    Enter with propertys from your subject
                </CardDescription>
            </CardHeader>
            <CardContent>

                <Form />

            </CardContent>
            <CardFooter>
                <Button type="submit" form="register">Submit</Button>
            </CardFooter>
        </Card>
    )

}