import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//set the runtime to edge for the best performance
export const runtime = 'edge';

export async function POST(req: Request){
  
   try {
    const promptMessage = "Create a list of users three open-ended and engaging questions formatted as a single string, Each question should be seprated by '||'. These question are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interactions. For example, your output shoulb ve strutured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be ?|| What's a simple thing that makes you happy?'. Ensure the questions are are intriguing, foster curoiousity, and contribute to a positive and welcoming conversational envioroment."
    const response = await openai.chat.completions.create({
      model: ('gpt-4-turbo'),
      maxTokens: 400,
      promptMessage,
      stream: true,
    })

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream)

   } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name,status,headers,message,},{ status });
    } else {
      console.error("An Unexpected error occurred", error);
      throw error;
    }
  }
}


