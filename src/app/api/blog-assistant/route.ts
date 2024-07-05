import { ChatCompletionMessageParam } from "ai/prompts"
import OpenAI from "openai"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { messages } = body

        const openai = new OpenAI()

        const systemMessage: ChatCompletionMessageParam = {
            role: 'system',
            content: `You are an AI assistant for the blog 'Bloggy'. Your task is to generate comprehensive blog content based on the user's input. 
            Create a full-length blog post with multiple sections, each covering a different aspect of the topic.
            Format the output as follows:
            Title: [Blog Post Title]

            Section 1: [Section Title]
            [Section 1 content]

            Section 2: [Section Title]
            [Section 2 content]

            Section 3: [Section Title]
            [Section 3 content]

            Conclusion:
            [Concluding paragraph]

            Aim for a total word count between 1000-1600 words.
            If the input is vague, use your creativity to expand on the topic and provide valuable insights.`
        }

        const userMessage = messages[messages.length - 1].content

        const promptMessage: ChatCompletionMessageParam = {
            role: 'user',
            content: `Generate a comprehensive blog post about: "${userMessage}". Format the post as instructed, with multiple sections covering various aspects of the topic.`
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemMessage, promptMessage],
            max_tokens: 1000,
            temperature: 0.7
        })

        return Response.json(response.choices[0].message)
    } catch (error) {
        console.error('[api/blog-assistant]', error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}