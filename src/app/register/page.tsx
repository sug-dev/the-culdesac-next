'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, Suspense } from 'react'

import Loader from '../components/Loader'

const Page = () => {

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

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })

        const responseData = await res.json()

        if (res && res.ok && !responseData.code) {
            window.location.href = '/'
        } else {
            alert(`Registration failed: ${responseData.message}`)
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <div className='bg-gray-100 bg-d flex-1 relative flex flex-col items-center justify-center'>
                <form onSubmit={handleSubmit} action="POST" className='w-full flex flex-col gap-3 items-center'>
                    <input
                        className='w-2/3 max-w-96 p-1.5 px-3 rounded-lg bg-neutral-700 text-neutral-100'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        className='w-2/3 max-w-96 p-1.5 px-3 rounded-lg bg-neutral-700 text-neutral-100'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className='bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-1.5 px-3 w-2/3 max-w-96'>Register</button>
                    <button className='bg-transparent text-blue-500 rounded-lg p-1.5 px-3 w-2/3 max-w-96' onClick={() => {window.location.href = '/login'}}>Login</button>
                </form>
            </div>
        </Suspense>
    )
}

export default Page