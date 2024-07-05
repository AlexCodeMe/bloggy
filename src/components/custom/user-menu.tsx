"use client"

import React from "react"
import { logout } from "@/actions/logout"
import { useRouter } from "next/navigation"

export default function UserMenu({ user }: { user: any }) {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/auth/login')
  }

  return (
    <span onClick={handleLogout} className='cursor-pointer'>
      Logout
    </span>
  )
}
