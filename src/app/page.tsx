'use client'

import React, { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'

export default function Home() {
    const { data: session } = useSession()

    const [s, setS] = useState<string>('')
    const [mediaLogData, setMediaLogData] = useState({
        title: '',
        content: '',
        genre: '',
        rating: ''
    })

    const handleMediaLogChange = (e: any) => {
        setMediaLogData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleStatusSubmit = async (e: any) => {
        e.preventDefault()

        const s_data = {
            status: s
        }
        
        const response = await fetch('/api/status',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(s_data)
        })
        const res = await response.json()

        setS('')
    }

    const handleMediaLogSubmit = async (e: any) => {
        e.preventDefault()

        const response = await fetch('/api/media-log',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mediaLogData)
        })
        const res = await response.json()

        setMediaLogData({
            title: '',
            content: '',
            genre: '',
            rating: ''
        })
    }

    return session && session.user ? (
        <div className='flex h-full w-full sm:flex-col p-3 sm:p-3 gap-3 sm:pt-[57px] overflow-y-scroll bg-d'>
            <div className='grid grid-cols-4 sm:grid-cols-2 sm:pt-3 gap-3 w-full h-full auto-rows-min'>
                <div>
                    <h1 className='text-white mb-3'>suuug.net status</h1>
                    <form onSubmit={handleStatusSubmit} className='w-full flex flex-col gap-3 items-center'>
                        <input
                            className='w-full max-w-[500px] p-1.5 px-3 rounded-lg bg-m border border-light text-emerald-200'
                            type="text"
                            required
                            value={s}
                            onChange={(e) => setS(e.target.value)}
                            placeholder="Set status..."
                        />
                        <button type="submit" className='bg-bl text-emerald-200 rounded-lg p-1.5 px-3 w-full max-w-[500px]'>Submit</button>
                    </form>
                </div>
                <div>
                    <h1 className='text-white mb-3'>suuug.net media log</h1>
                    <form onSubmit={handleMediaLogSubmit} className='w-full flex flex-col gap-3 items-center grid grid-cols-2'>
                        <input
                            className='w-full max-w-[500px] p-1.5 px-3 rounded-lg bg-m border border-light text-emerald-200 col-span-2'
                            type="text"
                            required
                            value={mediaLogData.title}
                            name="title"
                            onChange={handleMediaLogChange}
                            placeholder="Movie / Show Title"
                        />
                        <input
                            className='w-full max-w-[500px] p-1.5 px-3 rounded-lg bg-m border border-light text-emerald-200'
                            type="text"
                            required
                            value={mediaLogData.genre}
                            name="genre"
                            onChange={handleMediaLogChange}
                            placeholder="genre"
                        />
                        <input
                            className='w-full max-w-[500px] p-1.5 px-3 rounded-lg bg-m border border-light text-emerald-200'
                            type="text"
                            required
                            value={mediaLogData.rating}
                            name="rating"
                            onChange={handleMediaLogChange}
                            placeholder="Rating (out of 5)"
                        />
                        <textarea
                            className='w-full max-w-[500px] p-1.5 px-3 rounded-lg bg-m border border-light text-emerald-200 col-span-2'
                            required
                            value={mediaLogData.content}
                            name="content"
                            onChange={handleMediaLogChange}
                            placeholder="Content"
                        />
                        <button type="submit" className='bg-bl text-emerald-200 rounded-lg p-1.5 px-3 w-full max-w-[500px]'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    ) : <div className='flex h-full w-full sm:flex-col p-3 sm:p-3 gap-3 sm:pt-[57px] overflow-y-scroll bg-d'>
            <div className='grid grid-cols-4 sm:grid-cols-2 sm:pt-3 w-full h-full auto-rows-min'>
            </div>
        </div>
}
