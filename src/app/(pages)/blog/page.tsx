import { db } from '@/lib/db'
import React from 'react'

export default async function BlogPage() {
    const posts = await db.post.findMany()
    console.log('BlogPage posts', { posts })
  return (
    <div>BlogPage</div>
  )
}
