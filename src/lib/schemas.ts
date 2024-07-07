import { z } from "zod"

export const LoginSchema = z.object({
  username: z.string().min(1, {
    message: "username required",
  }),
  password: z.string().min(1, {
    message: "password required",
  }),
})

export const RegisterSchema = z.object({
  username: z.string().min(6, {
    message: "username must be at least 6 characters",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters",
  }),
  name: z.string().min(1, {
    message: "please enter a name",
  }),
})

export const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  bannerImage: z.string().optional(),
  cateogyrId: z.string().optional(),
})
