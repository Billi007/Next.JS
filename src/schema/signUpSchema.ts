import {z} from 'zod';

export const usernameValidation = z
.string()
.min(2, "username must be at least 2 characters")
.max(10, "username must be no more than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/ ,"username must not contain special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
})
