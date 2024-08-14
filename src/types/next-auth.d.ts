import 'next-auth'
import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

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