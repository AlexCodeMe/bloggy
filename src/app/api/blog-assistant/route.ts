import { ChatCompletionMessageParam } from "ai/prompts"
import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, bannerImage, content } = body

    const openai = new OpenAI()

    const wordcount = '2000-3600'
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are an AI assistant for the blog 'Bloggy'. Your task is to generate blog content based on the provided input. 
            Respond only with the blog content itself, without any preliminary explanations or messages.
            Always write in a blog-style format, ready to be inserted into a post.
            Structure the content as follows:
            Title: [Use the provided title]

            [Section Title]
            [Section 1 content]

            [Section Title]
            [Section 2 content]

            [Section Title]
            [Section 3 content]

            Conclusion:
            [Concluding paragraph]

            Aim for a total word count between ${wordcount} words.`,
    }

    let imageAnalysis = ""
    if (bannerImage) {
      try {
        console.log("Analyzing image...")
        const visionResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image in detail and suggest 3-5 blog topics based on what you see.",
                },
                { type: "image_url", image_url: { url: bannerImage } },
              ],
            },
          ],
          max_tokens: 600,
        })
        imageAnalysis = visionResponse.choices[0].message.content || ""
        console.log("Image analysis complete:", imageAnalysis)
      } catch (imageError) {
        console.error("Error analyzing image:", imageError)
        console.error("Full error:", JSON.stringify(imageError, null, 2))
      }
    }

    const promptMessage: ChatCompletionMessageParam = {
      role: "user",
      content: `Generate a blog post based on the following:
      Title: ${title || "Generate a suitable title"}
      Description: ${description || "Use this as a guide for the content"}
      Image Analysis: ${imageAnalysis || "No image provided"}
      
      Use the title, description, and image analysis as guidance to create the content. 
      Do not repeat these inputs in your response.
      Structure the blog post with an introduction, several main sections, and a conclusion.
      Aim for a comprehensive, engaging post of about ${wordcount} words.
      Respond only with the formatted blog content, starting directly with the introduction.`,
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, promptMessage],
      max_tokens: 4000,
      temperature: 0.7,
    })

    return Response.json(response.choices[0].message)
  } catch (error) {
    console.error("[api/blog-assistant]", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
