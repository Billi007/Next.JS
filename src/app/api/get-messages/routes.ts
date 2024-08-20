import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/Options";
import dbConnect from '@/lib/databaseConnetcion';
import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user

    if(!session || !session.user){
      return Response.json({
        success: false,
        message: 'Not authenticated'
      },{status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
     const user = await UserModel.aggregate([
        {$match: {id: userId}},
        {$unwind: '$messages'},                      // converts Array to simple Object
        {$sort: {'messages.createdAt': -1}},         // Ascending order of messages
        {$group: {_id: "$_id", messages: {$push: '$messages'}}}
     ])

     if(!user || user.length == 0){
        return Response.json({
        success: false,
        message: 'User not found'
      },{status: 404})
     }

     return Response.json({
        success: true,
        messages: user[0].messages,
     }, {status: 200})

    } catch (error) {
      console.log("An unexpected error occurred:", error);
        return Response.json({
            success: false,
            message:"Error fetching user"
        },{status: 500})
    }
}