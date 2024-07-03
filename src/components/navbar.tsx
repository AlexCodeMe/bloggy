import Link from 'next/link'
import React from 'react'
import ThemeToggle from './themes/theme-toggle'

export default function Navbar() {
  return (
    <header className='sticky top-0 bg-background'>
      <div className='mx-auto flex max-w-3xl flex-wrap justify-between gap-3 px-3 py-4'>
        <nav className='space-x-4 font-medium'>
          {/**TODO: Nav Items */}
        </nav>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
