import React, { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className='h-[80vh] flex items-center justify-center'>
            {children}
        </div>
    )
}