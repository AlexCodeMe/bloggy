"use client"

import { createPost } from "@/actions/create-post"
import { PostSchema } from "@/lib/schemas"
import { UploadButton } from "@/lib/uploadthing"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { ChangeEvent, FormEvent, useState } from "react"
import { z } from "zod"
import RichEditor from "../custom/rich-editor"
import { Loader2 } from "lucide-react"
import ContentModal from "../custom/content-modal"
import toast from "react-hot-toast"

export default function CreatePostForm() {
  const router = useRouter()

  const [showModal, setShowModal] = useState(false)
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
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      setAiSuggestion(data.content)
      setShowModal(true)
    } catch (error) {
      console.error("Failed to get AI suggestion:", error)
      setAiSuggestion("Failed to get AI suggestion. Please try again.")
    }
    setIsLoading(false)
  }

  function insertSuggestion() {
    function escapeHtml(unsafe: string) {
      return unsafe
        .replace(/&/g, "&amp")
        .replace(/</g, "&lt")
        .replace(/>/g, "&gt")
        .replace(/"/g, "&quot")
        .replace(/'/g, "&#039")
    }

    let current = ""
    const formattedContent = aiSuggestion
      .split("\n")
      .map((line, index, array) => {
        line = line.trim()
        if (!line) return ""

        if (line.startsWith("Title:")) {
          return `<h1>${escapeHtml(line.replace("Title:", "").trim())}</h1>`
        } else if (line === "Conclusion:") {
          current = "conclusion"
          return "<h2>Conclusion</h2>"
        } else if (line.match(/^[A-Z][\w\s]+:?$/)) {
          current = "section"
          return `<h2>${escapeHtml(line.replace(":", ""))}</h2>`
        } else {
          const escapedLine = escapeHtml(line)
          if (current === "conclusion" && index === array.length - 1) {
            return `<p class="conclusion">${escapedLine}</p>`
          } else if (current === "section" || current === "conclusion") {
            return `<p>${escapedLine}</p>`
          } else {
            return `<p class="introduction">${escapedLine}</p>`
          }
        }
      })
      .join("")

    setFormData((prev) => ({
      ...prev,
      content: prev.content + formattedContent,
    }))
    setAiSuggestion("")
    setShowModal(false)
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
    <div className='max-w-full mx-auto py-8'>
      <h1 className='text-4xl font-bold mb-8'>Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:space-x-8'>
          <div className='w-full md:w-[400px]'>
            <label htmlFor='title' className='block text-lg font-medium mb-2'>
              Title
            </label>
            <input
              id='title'
              name='title'
              type='text'
              required
              className='w-full px-4 py-2 text-xl border-b border-gray-300 focus:outline-none focus:border-indigo-500'
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className='w-full md:w-[400px]'>
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
              className='w-full px-4 py-2 text-lg border-b border-gray-300 focus:outline-none focus:border-indigo-500'
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
                  toast.success("Upload Completed", {
                    duration: 5000,
                  })
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`ERROR! ${error.message}`, {
                  duration: 5000,
                })
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
        
        <div className='flex justify-between gap-4 pt-4'>
          <div className='flex gap-4'>
            <button
              type='button'
              onClick={() => {}}
              disabled={isLoading}
              className='flex items-center px-6 py-3 bg-indigo-600 text-white text-lg rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              {isLoading ? (
                <Loader2 className='text-white size-4 animate-spin mr-2' />
              ) : (
                <>Preview</>
              )}
            </button>
            <button
              type='button'
              onClick={handleAiAssist}
              disabled={isLoading}
              className='flex items-center px-6 py-3 bg-indigo-600 text-white text-lg rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              {isLoading ? (
                <Loader2 className='text-white size-4 animate-spin mr-2' />
              ) : (
                <>✨ AI Assist</>
              )}
            </button>
          </div>
          <button
            type='submit'
            className='px-6 py-3 bg-green-600 text-white text-lg rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Publish
          </button>
        </div>
      </form>

      {showModal && (
        <ContentModal
          content={aiSuggestion}
          onClose={() => setShowModal(false)}
          onInsert={insertSuggestion}
        />
      )}
    </div>
  )
}
