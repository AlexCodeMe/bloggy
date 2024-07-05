import { getPost } from '@/actions/get-post'
import Reader from '@/components/custom/reader'
import Image from 'next/image'
import React from 'react'

export default async function BlogIdPage({ params }: { params: { blogId: string } }) {
  const { post } = await getPost(params.blogId)

  return (
    <section className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>
        {/**TODO: Avatar */}
        {post?.bannerImage && (
          <div className='relative max-w-4xl mx-auto aspect-video mb-8 rounded-lg overflow-hidden shadow-lg'>
            <Image
              src={post.bannerImage}
              alt='Banner'
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <p className="text-lg text-gray-300 mb-6">{post?.description}</p>
        <div className="max-w-none">
          <Reader value={post?.content!} />
        </div>
        <button className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update</button>
    </section>
  )
}
