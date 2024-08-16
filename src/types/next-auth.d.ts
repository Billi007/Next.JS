import 'next-auth'
import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
import { decl } from 'postcss';

declare module 'next-auth' {
    interface User{
        user: {
            id?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string;
        } & DefaultJWT['user']
 }
 interface Session{
    user: {
        id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    } & DefaultSession['user']
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