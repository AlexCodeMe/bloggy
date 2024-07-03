'use server'

import { db } from "@/lib/db"

export async function getPost(postId: string) {
    try {
        const post = await db.post.findUnique({
            where: {
                id: postId
            }
        })

        return { success: 'got post', post: post }
    } catch (error) {
        console.error('getPost action error', error)
        return { error: 'Failed to get post' }
    }
}