'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

function BlogEditPage() {

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
        <>
        {session && session.user && user == postData.name ? (
            <div className='flex-1 flex flex-col p-9 gap-3 bg-white bg-d sm:p-3 sm:pt-[57px] relative'>

                <div className='flex flex-col items-start gap-3 w-full max-w-[800px] sm:pt-3'>
                    <div className='flex items-center w-full gap-2 sm:w-full sm:items-end sm:gap-1'>
                        <input className='font-bold border bg-m border-light text-emerald-200 w-full rounded-lg p-2 sm:text-xl' name="title" onChange={handleChange} value={postData.title} />
                    </div>
                    <div className='sm:w-full flex items-center gap-3'>
                        <h2 className='font-light text-gray-400 text-xs'>{postData.date}</h2>
                        <input className='font-light text-gray-400 text-emerald-200 bg-gray-200 bg-m p-1 px-2 rounded-full border-gray-300 border border-light' type='text' name='tag' onChange={handleChange} value={postData.tag.toLowerCase()} />
                    </div>
                </div>
                <textarea className='border p-2 rounded-lg h-96 w-full font-light bg-m border-light text-emerald-200 whitespace-pre-wrap max-w-[800px] resize-none' name="content" onChange={handleChange} value={ postData.content } />
                <button className='text-emerald-200 bg-bl px-3 py-1.5 rounded-lg font-bold' onClick={savePost}>Save</button>
            </div>
        ) : (
            <></>
        )}
        </>
    )
}

export default function Page() {
    return (
        <Suspense>
            <BlogEditPage />
        </Suspense>
    )
}