import {z} from 'zod'
import dbConnect from '@/lib/databaseConnetcion'
import UserModel from '@/models/user.model'

export async function POST(req: Request){
    await dbConnect();

    try {
        const {username, code} =  await req.json();
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodeUsername});

        if(!user){
            return Response.json({
                success: false,
                message: "User not found."
            },{status: 404})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(!isCodeValid && isCodeExpired){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully."
            },{status: 200})

        }else if(!isCodeExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up and try again"
            },{status: 401})
            
        }else {
            return Response.json({
                success: false,
                message: "Verification code is invalid."
            },{status: 401})
        }
        
    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json({
            success: false,
            message: "An error occurred while verifying the user."
        },{status: 500,})
    }
}