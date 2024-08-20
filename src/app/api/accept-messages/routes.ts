import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/Options';
import dbConnect from '@/lib/databaseConnetcion';
import UserModel from '@/models/user.model';
import { User } from 'next-auth';

export async function POST(request: Request){
    await dbConnect();

      const session = await getServerSession(authOptions);
      const user = session?.user;

      if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Could not authenticate user"
        },{status: 401,})
      }

      const userId = user._id;
      const {acceptMessages} = await request.json()

      try {
       const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAccepctingMessage: acceptMessages}, {new: true})
       if(!updatedUser){
         return Response.json({
             success: false,
             message: "Failed to update user status to accept messages"
         },{status: 404,})
       }

       return Response.json({
           success: true,
           message: "User status updated successfully",
           updatedUser
       },{status: 200,})
        
      } catch (error) {
        console.log("Failed to update user status to accept messages", error)
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        },{status: 500,})
      }
}

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Could not authenticate user"
        },{status: 401,})
    }
    
    const userId = user._id;

  try {
     const foundUser = await UserModel.findById(userId);
     if(!foundUser){
       return Response.json({
           success: false,
           message: "User not found"
       },{status: 404,})
     }
  
     return Response.json({
         success: true,
         message: "User found successfully",
         isAcceptingMessages: foundUser.isAccepctingMessage
     },{status: 200,})

  } catch (error) {
    console.log("Failed to update user status to accept messages", error)
    return Response.json({
        success: false,
        message:"Error getting message acceptance status",
    },{status: 500,})
  }
}