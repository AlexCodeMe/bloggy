import { z } from "zod";

export const PostSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
})