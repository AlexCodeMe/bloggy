import Link from "next/link"
import React from "react"
import AiChatButton from "../ai/ai-chat-button"
import ThemeToggle from "../themes/theme-toggle"
import UserMenu from "../custom/user-menu"
import { getUserByID } from "@/lib/db"
import { auth } from "../../../auth"

export default async function Navbar() {
  const session = await auth()

  return (
    <header className='z-[99999] sticky top-0 bg-background'>
      <div className='mx-auto flex max-w-3xl flex-wrap justify-between gap-3 px-3 py-4'>
        <nav className='space-x-4 font-medium'>
          {/**TODO: Nav Items */}
          <Link href='/'>home</Link>
          <Link href='/create-post'>create post</Link>
          <Link href='/blog'>blogs</Link>
        </nav>
        <div className='flex items-center gap-4'>
          <AiChatButton />
          <ThemeToggle />
          {session?.user ? <UserMenu user={session?.user} /> : <Link href='/auth/login'>Login</Link>}
        </div>
      </div>
    </header>
  )
}
