'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { z } from 'zod'
import { LoginSchema } from '@/lib/schemas'
import Wrapper from '../custom/wrapper'
import { login } from '@/actions/login'

export default function LoginForm() {
  const [formData, setFormData] = useState<z.infer<typeof LoginSchema>>({
    username: '',
    password: ''
  })

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    onSubmit(formData)
  }

  function onSubmit(values: z.infer<typeof LoginSchema>) {
     login(values)
  }

  return (
    <Wrapper headerLabel='Welcome!'
      backButtonLabel='Don&apos;t have an account?'
      backButtonHref='/auth/register'
    >
      <form className='flex flex-col justify-end items-center space-y-4 w-full' onSubmit={handleSubmit}>
        <div className='flex items-center w-full'>
          <label className='w-1/4'>Username</label>
          <input
            className='flex-grow border rounded px-2 py-1'
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className='flex items-center w-full'>
          <label className='w-1/4'>Password</label>
          <input
            className='flex-grow border rounded px-2 py-1'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      </form>
    </Wrapper>
  )
}