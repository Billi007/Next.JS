import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/databaseConnetcion";
import UserModel from "@/models/user.model";
import bcrypt from 'bcryptjs'

export async function POST(request: Request,){
await dbConnect();
try {
    const {username,email, password} = await request.json();
    const existingUserVerifyByUsername = await UserModel.findOne({username,isVerified:true});

    if(existingUserVerifyByUsername){
        return Response.json({
            success: false,
            message: "Username already exists. Please choose a different one."
        },{status: 400})
    };
    const existingUserByEmail = await UserModel.findOne({email});
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if(existingUserByEmail){
       if(existingUserByEmail.isVerified){
         return Response.json({
            success: false,
            message:"Email already exists"
            },{status: 401})
       }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword,
        existingUserByEmail.verifyCode = verifyCode,
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save();
       }
    }else{
        const expirtdate = new Date();
        expirtdate.setHours(expirtdate.getHours() + 1);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ 
            username,
            email, 
            password: hashedPassword,
            isVerified: false,
            verifyCode,
            verifyCodeExpiry: expirtdate,
            isAccepctingMessage: true,
            messages: []
        });

        await user.save();
    }
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        if(!emailResponse.success){
            return Response.json({
            success: false,
            message: emailResponse.message,
            },{status: 501})
        }

        return Response.json({
            success: true,
            message: "User registered successfully.Please verify your email"
        },{status: 201})

} catch (error) {
    console.error("Error registering User", error);
    return Response.json({
        success: false,
        message: "An error occurred while registering the user."
    },{status: 500})
}
}