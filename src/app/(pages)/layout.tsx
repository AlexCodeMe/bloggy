import React, { ReactNode } from 'react'

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 via-orange-400 to-rose-800'>
        {children}
    </div>
  )
}
