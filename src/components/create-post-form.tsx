"use client"

import { createPost } from "@/actions/create-post"
import { PostSchema } from "@/lib/schemas"
import { UploadButton } from "@/lib/uploadthing"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { ChangeEvent, FormEvent, useState } from "react"
import { z } from "zod"
import RichEditor from "./custom/rich-editor"
import { Loader2 } from "lucide-react"

export default function CreatePostForm() {
  const router = useRouter()

  const [aiSuggestion, setAiSuggestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    bannerImage: "",
  })

  async function handleAiAssist() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/blog-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: formData.content }],
        }),
      })
      const data = await response.json()
      setAiSuggestion(data.content)
    } catch (error) {
      console.error("Failed to get AI suggestion:", error)
      setAiSuggestion("Failed to get AI suggestion. Please try again.")
    }
    setIsLoading(false)
  }

  function insertSuggestion() {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + "\n" + aiSuggestion,
    }))
    setAiSuggestion("")
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  function handleContentChange(value: string) {
    setFormData({ ...formData, content: value })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const validatedData = PostSchema.parse(formData)
      const post = await createPost(validatedData)
      if (post.success) {
        router.push(`/blog/${post.post.id}`)
      } else {
        console.error("Failed to create post:", post.error)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors)
      } else {
        console.error("An unexpected error occurred:", error)
      }
    }
  }

  return (
    <div className='max-w-fullmx-auto py-8'>
      <h1 className='text-4xl font-bold mb-8'>Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='flex justify-between items-center space-x-8'>
          <div>
            <label htmlFor='title' className='block text-lg font-medium mb-2'>
              Title
            </label>
            <input
              id='title'
              name='title'
              type='text'
              required
              className='w-[400px] px-4 py-2 text-xl border-b border-gray-300 focus:outline-none focus:border-indigo-500'
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor='description'
              className='block text-lg font-medium mb-2'
            >
              Description
            </label>
            <input
              id='description'
              name='description'
              type='text'
              required
              className='w-[400px] px-4 py-2 text-lg border-b border-gray-300 focus:outline-none focus:border-indigo-500'
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='flex justify-between items-center'>
          <div className='flex flex-col items-center'>
            <label className='block text-lg font-medium mb-2'>
              Banner Image
            </label>
            <UploadButton
              endpoint='imageUploader'
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setFormData((prev) => ({ ...prev, bannerImage: res[0].url }))
                  alert("Upload Completed")
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`)
              }}
            />
          </div>
          {formData.bannerImage && (
            <div className='mt-4'>
              <p className='text-sm text-green-600 mb-2'>
                Image uploaded successfully
              </p>
              <Image
                src={formData.bannerImage}
                alt='banner'
                width={400}
                height={200}
                className='object-cover'
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor='content' className='block text-lg font-medium mb-2'>
            Content
          </label>
          <RichEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder='Write your blog post here...'
            className='w-full px-4 py-2 text-lg custom-editor'
          />
        </div>

        {aiSuggestion && (
          <div className='mt-4'>
            <h3 className='text-lg font-bold'>AI Suggestion:</h3>
            <p>{aiSuggestion}</p>
            <button
              type='button'
              onClick={insertSuggestion}
              className='mt-2 px-4 py-2 bg-green-600 text-white rounded'
            >
              Insert Suggestion
            </button>
          </div>
        )}
        <div className='flex justify-between gap-4 pt-4'>
          <button
            type='button'
            onClick={handleAiAssist}
            disabled={isLoading}
            className='flex items-center px-6 py-3 bg-indigo-600 text-white text-lg rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            {isLoading ? (
              <Loader2 className='text-gold size-4 animate-spin' />
            ) : (
              "✨"
            )}
          </button>
          <button
            type='submit'
            className='px-6 py-3 bg-green-600 text-white text-lg rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Publish Post
          </button>
        </div>
      </form>
    </div>
  )
}
