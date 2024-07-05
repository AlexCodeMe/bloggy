import { OpenAIStream, StreamingTextResponse } from "ai"
import { ChatCompletionMessageParam } from "ai/prompts"
import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages

    const openai = new OpenAI()

    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are Bloggy, a silly and light-hearted bot. Your job is to converse with users in a fun, playful manner. Use humor, puns, and casual language. Be enthusiastic and occasionally over-the-top in your responses. Feel free to make silly jokes or observations. Always maintain a positive and energetic tone.`,
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messages],
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("[api/chat_POST]", error)
    return Response.json({ error: "Interner Server Errror" }, { status: 5000 })
  }
}
