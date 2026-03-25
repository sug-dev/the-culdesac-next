'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, Suspense } from 'react'

function LoginPage() {

    const uri = useSearchParams().get('ref')

    const [redirectURL, setRedirectURL] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        if (uri) {
            setRedirectURL(uri)
        }
    }, [uri])

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const res = await signIn('credentials', {
            redirect: false,
            username,
            password
        })

        if (res && res.ok) {
            window.location.href = redirectURL
        } else {
            alert('Login failed')
        }
    }

    return (
        <div className='bg-d w-full flex-1 relative flex flex-col items-center justify-center p-3'>
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-3 items-center'>
                <input
                    className='w-full max-w-[500px] p-1.5 px-3 rounded-lg bg-m border border-light text-emerald-200'
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    className='w-full max-w-[500px] p-1.5 px-3 rounded-lg bg-m border border-light text-emerald-200'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className='bg-bl text-emerald-200 rounded-lg p-1.5 px-3 w-full max-w-[500px]'>Login</button>
                {/* <button className='bg-transparent text-blue-500 rounded-lg p-1.5 px-3 w-full max-w-[500px]' onClick={() => {window.location.href = '/register'}}>Register</button> */}
            </form>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense>
            <LoginPage />
        </Suspense>
    )
}