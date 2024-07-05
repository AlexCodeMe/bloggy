import Image from "next/image"
import Link from "next/link"
import React from "react"

type Props = {
  blogId: string
  title: string
  description: string | null
  content: string
  userImage?: string
  bannerImage?: string
}

export default function PostCard({
  title,
  description,
  content,
  userImage,
  bannerImage,
  blogId,
}: Props) {
  const trimmedContent = content.replace(/<[^>]*>?/gm, "")

  return (
    <Link
      href={`/blog/${blogId}`}
      className='mx-4 flex flex-wrap max-w-sm rounded overflow-hidden shadow-lg'
    >
      <div className='flex flex-col gap-2 rounded-xl overflow-hidden h-full bg-gray-200'>
        {/* Banner Image */}
        {bannerImage && (
          <Image
            src={bannerImage}
            alt='Banner'
            width={400}
            height={200}
            className='w-full'
          />
        )}

        <div className='px-6 py-4'>
          {/* Title */}
          <div className='font-bold text-xl text-zinc-800 mb-2'>{title}</div>

          {/* Description */}
          <p className='text-zinc-600 text-base'>{description}</p>

          {/* Content */}
          <div className='mt-4'>
            <p className='text-black truncate'>{trimmedContent}</p>
          </div>
        </div>

        {/* User Image */}
        <div className='px-6 pt-4 pb-2'>
          {userImage && (
            <Image
              src={userImage}
              alt='User'
              width={40}
              height={40}
              className='rounded-full'
            />
          )}
        </div>
      </div>
    </Link>
  )
}
