import PostCard from "@/components/custom/post-card"
import { db } from "@/lib/db"
import React from "react"

export default async function BlogPage() {
  const posts = await db.post.findMany()
  const alex = 'alex'

  const boyAvatar = `https://avatar.iran.liara.run/public/boy?username=${alex}`
  const girlAvatar = `https://avatar.iran.liara.run/public/girl?username=${alex}`

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 space-y-6'>
      {posts &&
        posts.map((post) => (
          <PostCard key={post.id}
            blogId={post.id}
            title={post.title}
            description={post.description}
            content={post.content}
            userImage={girlAvatar}
            bannerImage={post.bannerImage || undefined}
          />
        ))}
    </div>
  )
}
