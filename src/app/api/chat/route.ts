import { OpenAIStream, StreamingTextResponse } from "ai"
import { ChatCompletionMessageParam } from "ai/prompts"
import OpenAI from "openai"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const messages = body.messages

        const openai = new OpenAI()

        const systemMessage: ChatCompletionMessageParam = {
            role: 'system',
            content: `You are the AI Assistant for the blog 'Bloggy'. Your job provide meaningful blog content.`
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [systemMessage, ...messages],
        })

        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error) {
        console.error('[api/chat_POST]', error)
        return Response.json({ error: 'Interner Server Errror' }, { status: 5000 })
    }
}
