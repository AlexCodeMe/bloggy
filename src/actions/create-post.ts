"use server"

import { db } from "@/lib/db"
import { PostSchema } from "@/lib/schemas"
import { z } from "zod"

export async function createPost(values: z.infer<typeof PostSchema>) {
  const validatedFields = PostSchema.safeParse(values)
  if (!validatedFields.success) return { error: "invalid fields" }

  const { title, description, content, bannerImage } = validatedFields.data

  try {
    const newPost = await db.post.create({
      data: {
        title,
        description,
        content,
        bannerImage,
      },
    })

    return { success: "Post created!", post: newPost }
  } catch (error) {
    console.error("createPost action error", error)
    return { error: "Failed to create post" }
  }
}
