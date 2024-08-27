import 'next-auth'
import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
import { decl } from 'postcss';

declare module 'next-auth' {
    interface User{
    
            id?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string;
    }
       
 interface Session{
    user: {
        id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    } 
 }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }
}