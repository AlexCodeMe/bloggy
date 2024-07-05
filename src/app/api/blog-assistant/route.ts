import { ChatCompletionMessageParam } from "ai/prompts"
import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const openai = new OpenAI()

    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are an AI assistant for the blog 'Bloggy'. Your task is to generate blog content based on the user's input. 
            Respond only with the blog content itself, without any preliminary explanations or messages.
            If the input is empty or vague, generate a general blog post about a random topic.
            Always write in a blog-style format, ready to be inserted into a post.
            Structure the content as follows:
            Title: [Blog Post Title]

            [Section Title]
            [Section 1 content]

            [Section Title]
            [Section 2 content]

            [Section Title]
            [Section 3 content]

            Conclusion:
            [Concluding paragraph]

            Aim for a total word count between 2000-3600 words.`,
    }

    const userMessage = messages[messages.length - 1].content

    const promptMessage: ChatCompletionMessageParam = {
      role: "user",
      content: `Generate a blog post about: "${userMessage}". Respond only with the formatted blog content.`,
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, promptMessage],
      max_tokens: 1000,
      temperature: 0.7,
    })

    return Response.json(response.choices[0].message)
  } catch (error) {
    console.error("[api/blog-assistant]", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
