import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
 content : string;
 createdAt : Date;
};

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAccepctingMessage: boolean;
    messages: Message[];
}

const messageSchema: Schema<Message> = new Schema({
 content: {
    type: String,
    required: true,
 },
 createdAt: {
    type: Date,
    required: true,
    default: Date.now()
 },
});

const userSchema: Schema<User> = new Schema({
       username: {
        type: String,
        required: [true ,"Please enter your username"],
        trim: true,
        unique: true
     },
       email: {
        type: String,
        required: [true ,"Email is required"],
        unique: true,
        match: [/.+\@.+\..+/ ,"Please enter valid email"]
     },
      password: {
        type: String,
        required: [true ,"Password is required"],
     },
     verifyCode: {
        type: String,
        required:  [true ,"verification code is required"],
     },
     verifyCodeExpiry: {
        type: Date,
        required: true,
     },
     isVerified: {
        type: Boolean,
        default: false,
     },
     isAccepctingMessage: {
        type: Boolean,
        required: true,
     },
     messages: [messageSchema]
   });
 
   const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("user", userSchema));
   export default UserModel;