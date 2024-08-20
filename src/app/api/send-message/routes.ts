import UserModel from "@/models/user.model";
import dbConnect from "@/lib/databaseConnetcion";
import { Message } from "@/models/user.model";

export async function POST(req: Request){
    await dbConnect();
    const {username, content} = await req.json();

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        //is user accepting the messages
        if(!user.isAccepctingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            },{status: 403})
        }

        const newMessages = {content, createdAt: new Date()}
        user.messages.push(newMessages as Message)
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        },{status: 200})
        
    } catch (error) {
        console.log("Error sending message ", error)
        return Response.json({
            success: false,
            message: "Error sending message"
        },{status: 500})
    }
}