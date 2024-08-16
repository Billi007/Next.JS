import CredentialsProvider from "next-auth/providers/credentials";
import credentials from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/databaseConnetcion";
import UserModel from "@/models/user.model";

export const authOptions = {
   providers: [
    CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
            email: { label: 'Email', type: 'text', placeholder: 'hjkhc@hc' },
            password: { label: 'Password', type: 'password', placeholder: 'Password' },
        },
        async authorize(credentials:any): Promise<any> {
        await dbConnect();

        try {
        const user = await UserModel.findOne({
            $or: [
                {email: credentials.identifier.email},
                {username: credentials.identifier.username}]
        })
        if(!user){
            throw new Error('User not found');
        };
        if(!user.isVerified){
            throw new Error('Please verify your credentials');
        };

        const comparePassword = await bcrypt.compare(credentials.password, user.password)
        if(comparePassword){
            return user;
        }else{
            throw new Error('Invalid password');
        }

        } catch (error: any) {
            throw new Error(error);
        }
        }
    })
   ],
   callbacks: {
    async session({ session, token }: any) {
        if(token){
            session.user = token;
            session.isVerified = token.isVerified;
            session.isAcceptingMessage = token.isAcceptingMessage;
            session.username = token.username;
        }
      return session
    },
    async jwt({ token, user }: any) {
        if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessage = user.isAcceptingMessage;
            token.username = user.username;
        }
      return token
    },
   pages: {
    signIn: '/signin',
   },
   Session: {
   strategy: "jwt"
   },
   secret: process.env.NEXT_AUTH_SECRET,
}
}