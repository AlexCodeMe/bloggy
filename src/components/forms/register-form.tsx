'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { z } from 'zod'
import { RegisterSchema } from '@/lib/schemas'
import { register } from '@/actions/register'
import Wrapper from '../custom/wrapper'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
    const router = useRouter() 

    const [formData, setFormData] = useState<z.infer<typeof RegisterSchema>>({
        username: '',
        password: '',
        name: ''
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    async function onSubmit(values: z.infer<typeof RegisterSchema>) {
        try {
            const result = await register(values)
            if (result.error) {
                console.error('Registration error:', result.error)
                return
            } else if (result.success) {
                router.push('/auth/login')
            }
        } catch (error) {
            console.error('Registration error:', error)
        }
    }

    return (
        <Wrapper headerLabel='Welcome!'
            backButtonLabel='Already have an account?'
            backButtonHref='/auth/login'
        >
            <form className='flex flex-col justify-end items-center space-y-4 w-full'
                onSubmit={handleSubmit}
            >
                <div className='flex items-center w-full'>
                    <label className='w-1/4'>Name</label>
                    <input
                        className='flex-grow border rounded px-2 py-1'
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
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
                    Register
                </button>
            </form>
        </Wrapper>
    )
}
