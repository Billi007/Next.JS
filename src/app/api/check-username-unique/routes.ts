import {z} from 'zod'
import dbConnect from '@/lib/databaseConnetcion'
import UserModel from '@/models/user.model'
import { usernameValidation } from '@/schema/signUpSchema'
import { signUpSchema } from '@/schema/signUpSchema'

const UsernameQuerySchema = z.object({
    username: usernameValidation,
    signUp: signUpSchema
})

export async function GET(request: Request){
    //use this in all other routes
    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success: false,
    //         message: "Invalid request method"
    //     },{status: 400})
    // }
    await dbConnect();

    try {
     const {searchParams} = new URL(request.url);
     const queryParams = {
        username: searchParams.get("username"),
     }

     //validate with ZOD
     const result = UsernameQuerySchema.safeParse(queryParams);
     console.log(result);

     if(!result.success){
        const usernameError = result.error.format().username?._errors || [];
        return Response.json({
            success: false,
            message: usernameError?.length > 0 
            ? usernameError.join(", ") 
            : "Invalid query error",
        },{status: 400})
     }
     const {username} = result.data;

     const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});
     if(existingVerifiedUser){
        return Response.json({
            success: false,
            message: "Username already exists"
        },{status: 409})
     }

        return Response.json({
            success: true,
            message: "available username"
        },{status: 200});

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status: 501})
    }
}