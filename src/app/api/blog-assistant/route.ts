import { ChatCompletionMessageParam } from "ai/prompts"
import OpenAI from "openai"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { messages } = body

        const openai = new OpenAI()

        const systemMessage: ChatCompletionMessageParam = {
            role: 'system',
            content: `You are an AI assistant for the blog 'Bloggy'. Your task is to generate blog content based on the user's input. 
            Do not engage in conversation or ask questions. Instead, expand on the given topic or phrase to create relevant blog content. 
            If the input is too vague, generate a short, general blog paragraph related to the topic. 
            Always write in a blog-style format, ready to be inserted into a post.`
        }

        const userMessage = messages[messages.length - 1].content

        const promptMessage: ChatCompletionMessageParam = {
            role: 'user',
            content: `Generate a blog paragraph about or related to: "${userMessage}"`
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemMessage, promptMessage],
            max_tokens: 150  // Adjust this for desired length
        })

        return Response.json(response.choices[0].message)
    } catch (error) {
        console.error('[api/blog-assistant]', error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}