import { getPost } from '@/actions/get-post'
import React from 'react'

export default async function BlogIdPage({ params }: { params: { blogId: string } }) {
  const { post } = await getPost(params.blogId)

  return (
    <div>
        <h1>{post?.title}</h1>
        <p>{post?.description}</p>
        <p>{post?.content}</p>
        <button></button>
    </div>
  )
}
