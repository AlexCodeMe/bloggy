import Link from 'next/link'
import React from 'react'
import ThemeToggle from './themes/theme-toggle'
import AiChatButton from './ai/ai-chat-button'

export default function Navbar() {
  return (
    <header className='sticky top-0 bg-background'>
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
        </div>
      </div>
    </header>
  )
}
