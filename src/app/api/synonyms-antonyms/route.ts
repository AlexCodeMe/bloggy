import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { word } = body

    const openai = new OpenAI()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a linguistic expert. Provide synonyms and antonyms for the given word.",
        },
        {
          role: "user",
          content: `Please provide synonyms and antonyms for the word: "${word}". Format your response as follows:
          Synonyms: [comma-separated list of synonyms]
          Antonyms: [comma-separated list of antonyms]`,
        },
      ],
    })

    return Response.json({ result: response.choices[0].message.content })
  } catch (error) {
    console.error("[api/synonyms-antonyms_POST]", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
