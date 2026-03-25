'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'

function ArticleEditPage({ slug }: { slug: string }) {

    const { data: session, status } = useSession()

    type Article = {
        _id: string,
        content: string,
        date: string,
        name: string,
        title: string
    }

    const [user, setUser] = useState('')
    const [id, setId] = useState('')
    const [article, setArticle] = useState<Article | null>(null)

    useEffect(() => {
        if (session && session.user) {
            const user = session.user as { username: string }
            setUser(user.username)
        }
    }, [session])

    useEffect(() => {
        const getEditablePost = async () => {
            const response = await fetch(`/api/articles/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const res = await response.json()
            setArticle(res.articles[0])
        }
        getEditablePost()
    }, [])

    const handleChange = (e: any) => {
        setArticle((prev) => {
            if (!prev) return prev

            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const savePost = async () => {
        let article_data = {
            content: article?.content,
            date: article?.date,
            name: article?.name,
            title: article?.title
        }
        const response = await fetch(`/api/articles/${slug}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ updatedData: article_data })
        })
        const res = await response.json()
        if (res.status == 200) {
            window.location.href = '/articles'
        }
    }

    return (
        <>
        {session && session.user && user == article?.name ? (
            <div className='flex-1 w-full flex flex-col p-9 gap-3 bg-d sm:p-3 sm:pt-[57px] relative'>

                <div className='flex flex-col items-start gap-3 w-full max-w-[800px] sm:pt-3'>
                    <div className='flex items-center w-full gap-3 sm:w-full sm:items-end sm:gap-1'>
                        <input className='font-bold border bg-m border-light text-emerald-200 w-full rounded-lg p-3 sm:text-xl' name="title" onChange={handleChange} value={article?.title} />
                    </div>
                    <textarea className='border p-3 rounded-lg h-96 w-full font-light bg-m border-light text-emerald-200 whitespace-pre-wrap resize-none' name="content" onChange={handleChange} value={ article?.content } />
                    <button className='text-emerald-200 bg-bl px-3 py-1.5 rounded-lg font-bold. w-full' onClick={savePost}>Save</button>
                </div>
            </div>
        ) : (
            <></>
        )}
        </>
    )
}

export default function Page({ params }: { params: { slug: string } }) {
    return (
        <Suspense>
            <ArticleEditPage slug={params.slug} />
        </Suspense>
    )
}