'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function BlogEdit() {

    const param = useSearchParams().get('_id')

    const { data: session, status } = useSession()

    const [user, setUser] = useState('')
    const [id, setId] = useState('')
    const [postData, setPostData] = useState({
        name: '',
        title: '',
        content: '',
        tag: '',
        date: ''
    })

    useEffect(() => {
        if (session && session.user) {
            const user = session.user as { username: string }
            setUser(user.username)
        }
    }, [session])

    useEffect(() => {
        const getEditablePost = async () => {
            const response = await fetch(`/api?_id=${param}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const res = await response.json()
            console.log(res)
            setPostData({
                name: res.posts[0].name,
                title: res.posts[0].title,
                content: res.posts[0].content,
                tag: res.posts[0].tag,
                date: res.posts[0].date
            })
        }
        if (param && id === '') {
            setId(param)
            getEditablePost()
        }
    }, [id, param])

    const handleChange = (e: any) => {
        setPostData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const savePost = async () => {
        const response = await fetch('/api', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({postId: id, updatedData: postData})
        })
        const res = await response.json()
        if (res.status == 200) {
            window.location.href = '/blog'
        }
    }

    return (
        session && session.user && user == postData.name) ? (
            <div className='flex-1 flex flex-col justify-center items-center px-2 gap-5 bg-white dark:bg-neutral-800 sm:px-3 relative'>

                <div className='flex flex-col items-start gap-2 w-full max-w-[800px] '>
                    <div className='flex items-center w-full gap-2 sm:w-full sm:items-end sm:gap-1'>
                        <input className='font-bold border dark:bg-neutral-700 dark:border-transparent dark:text-white w-full rounded-lg p-2 sm:text-xl' name="title" onChange={handleChange} value={postData.title} />
                    </div>
                    <div className='sm:w-full flex items-center gap-3'>
                        <h2 className='font-light text-gray-400 text-xs'>{postData.date}</h2>
                        <input className='font-light text-gray-400 dark:text-white text-xs bg-gray-200 dark:bg-neutral-700 p-1 px-2 rounded-full border-gray-300 border dark:border-transparent' type='text' name='tag' onChange={handleChange} value={postData.tag.toLowerCase()} />
                    </div>
                </div>
                <textarea className='border p-2 rounded-lg h-96 w-full font-light text-sm dark:bg-neutral-700 dark:border-transparent dark:text-white whitespace-pre-wrap max-w-[800px] resize-none' name="content" onChange={handleChange} value={ postData.content } />
                <div className='flex gap-2 absolute bottom-3 right-3'>
                    <button className='text-blue-500 hover:underline' onClick={savePost}>Save</button>
                </div>
            </div>
        ) : (
            null
    )    
}