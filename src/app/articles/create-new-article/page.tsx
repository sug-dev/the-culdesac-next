'use client'

import React, {useEffect, useState} from 'react'
import { useSession } from 'next-auth/react'

export default function Page() {

    const { data: session, status } = useSession()

    useEffect(() => {
        if (session && session.user) {
            const user = session.user as { username: string }
            setPostData(prev => ({
                ...prev,
                name: user.username
            }))
        }
    }, [session])

    const [postData, setPostData] = useState({
        name: '',
        title: '',
        content: '',
        date: ''
    })
    const [readyToSend, setReadyToSend] = useState(false)

    const handleChange = (e: any) => {
        setPostData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const setArticleToPost = () => {
        setPostData(prev => ({
            ...prev,
            date: new Date().toUTCString()
        }))
        setReadyToSend(true)
    }

    useEffect(() => {
        const onSubmit = async () => {
            if (postData.content.trim() !== '' && postData.title.trim() !== '') {
                try {
                    const response = await fetch('/api/articles', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(postData)
                    })
                    const res = await response.json()
                    setPostData({
                        name: '',
                        title: '',
                        content: '',
                        date: ''
                    })
                    window.location.href = '/articles'
                } catch (error: any) {
                    console.error("Error creating article from frontend: ", error.message)
                }
            }
        }
        if (readyToSend) {
            onSubmit()
            setReadyToSend(false)
        }
    }, [readyToSend, postData])

    
    return session && session.user ? (
        <div className='bg-d flex-1 w-full relative flex flex-col sm:pt-[57px]'>
            <div className='flex flex-col gap-3 w-full h-full max-w-[800px] p-3'>
                <input type='text' name="title" placeholder='Title...' className='bg-m rounded p-1.5 px-3 border border-light text-emerald-200' value={postData.title} onChange={handleChange}/>
                <textarea placeholder='Content...' name="content" className='bg-m rounded p-1.5 px-3 resize-none border border-light text-emerald-200 h-96 sm:h-64' value={postData.content} onChange={handleChange}/>
                <button className='w-full mx-auto p-1 bg-bl rounded text-emerald-200 font-bold' onClick={setArticleToPost}>Submit</button>
            </div>
        </div>
    ) : <h1>Not logged in...</h1>
}
