'use client'

import { createPost } from '@/actions/create-post'
import { PostSchema } from '@/lib/schemas'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { z } from 'zod'

export default function CreatePostForm() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: ''
    })

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        onSubmit(formData)
    }

    async function onSubmit(values: z.infer<typeof PostSchema>) {
        const post = await createPost(values)

        if (post.success) {
            router.push(`/blog/${post.post.id}`)
        } else {
            console.error('Failed to create post:', post.error)
        }
    }


    return (
        <div>
            <form className='flex flex-col justify-end items-center space-y-4 w-full text-black'
                onSubmit={handleSubmit}
            >
                <div className='flex items-center w-full'>
                    <label className='w-1/4'>Title</label>
                    <input
                        className='flex-grow border rounded px-2 py-1'
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex items-center w-full'>
                    <label className='w-1/4'>Description</label>
                    <input
                        className='flex-grow border rounded px-2 py-1'
                        name="description"
                        type='text'
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex items-center w-full'>
                    <label className='w-1/4'>Content</label>
                    <textarea
                        className='flex-grow border rounded px-2 py-1'
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex items-center justify-end gap-10'>
                    <button type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Create Post
                    </button>
                </div>
            </form>
        </div>
    )
}
