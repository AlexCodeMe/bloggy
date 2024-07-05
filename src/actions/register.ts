'use server'

import { db, getUserByUsername } from "@/lib/db"
import { RegisterSchema } from "@/lib/schemas"
import bcrypt from 'bcryptjs'
import { z } from "zod"

export async function register(values: z.infer<typeof RegisterSchema>) {
    try {
        const validatedFields = RegisterSchema.safeParse(values)
        if (!validatedFields.success) return { error: 'invalid fields' }

        const { username, password, name } = validatedFields.data
        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await getUserByUsername(username)
        if (existingUser) return { error: 'username must be unique' }

        if (!db || !db.user) {
            console.error('Database or User model not initialized')
            return { error: 'Database error' }
        }

        const newUser = await db.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
            }
        })

        console.log('New user created:', newUser)

        return { success: 'user created' }
    } catch (error) {
        console.error('Registration error:', error)
        return { error: 'An unexpected error occurred' }
    }
}