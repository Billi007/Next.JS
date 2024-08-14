import { resend } from "@/lib/resend";
import EmailTemplate from "../../emails/EmailTemplate";
import { ApiResponse } from "@/types/APIresponse";

export async function sendVerificationEmail(
email: string,
username: string,
verifyCode: string
):Promise<ApiResponse> {
    try {
           await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'Hello world',
            react: EmailTemplate({username: "Tanishka", verifyCode: "hellllo"}),
          });
        return {success: true, message: "Verification email sent successfully"}
    } catch (error) {
        console.error("error sending verification email");
        return {success: false, message: "failed to send Verification email"}
    }
}



