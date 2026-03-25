'use client'

import React, {useEffect, useState} from 'react'
import { useSession } from 'next-auth/react'

import Image from 'next/image'
import Link from 'next/link'

import DownArrow from '/public/down-arrow-svgrepo-com.png'
import Loader from '../../components/Loader'

export default function Page({ params }: { params: { slug: string } }) {

    const { data: session, status } = useSession()
    const slug = params.slug

    type Article = {
        _id: string,
        content: string,
        date: string,
        name: string,
        title: string
    }

    const [currentUser, setCurrentUser] = useState('')
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    const DeleteIcon = () => {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14 11V17" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M4 7H20" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        )
    }

    const EditIcon = () => {
        return (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#fff" stroke="#fff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></polygon> </g> </g> </g> </g></svg>
        )
    }

    // Get user
    useEffect(() => {
        if (session && session.user) {
            const user = session.user as { username: string }
            setCurrentUser(user.username)
        } else setCurrentUser('')
    },[session])

    useEffect(() => {
        const get_article = async () => {
            setLoading(true)
            const response = await fetch(`/api/articles/${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const res = await response.json()
            const a: any = Object.entries(res)[0][1]

            setArticle(a[0])
            
            setLoading(false)
        }
        get_article()
    }, [])

    const edit_article = (id: string) => {
        window.location.href = `/articles/edit/${id}`
    }
    const delete_article = async (id: string) => {
        const response = await fetch(`/api/articles/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const res = await response.json()
        if (res.status === 200) {
            window.location.href = '/articles'
        }
    }

    return (
        <div className='bg-d h-full relative flex flex-col sm:pt-[57px] sm:w-screen'>
            {loading ? (
                <Loader />
            ) : (
                <>
                <div className='flex-1 relative p-9 sm:p-3 sm:pt-12 grid grid-cols-2 sm:grid-cols-1 auto-rows-min gap-9 sm:border-b border-light overflow-y-scroll'>
                    <div className='flex flex-col gap-5 relative'>
                        {/* POST METADATA */}
                        <div className='flex flex-col items-start gap-1'>
                            <div className='flex items-center gap-2 sm:w-full sm:items-end sm:gap-1'>
                                <h1 className='font-bold text-3xl sm:text-xl text-emerald-200'>{article?.title} <span className='font-light text-gray-400 text-xs pt-1 sm:pb-0.5 px-1'> by </span><span className='color-bl'> {article?.name}</span></h1>
                            </div>
                            <span className='text-neutral-600'>{article?.date}</span>
                        </div>

                        {/* POST CONTENT */}
                        <div className='text-lg font-light whitespace-pre-wrap max-w-[800px] text-neutral-400'>
                            {/* {article?.content.split(' ').map((t, i) => {
                                let token: React.ReactNode = <span className='font-light'>{t + ' '}</span>
                                if (t.startsWith('**') && t.endsWith('**')) {
                                    token = <span className='font-bold'>{t.slice(2, -2) + ' '}</span>
                                } else {
                                    if (t.startsWith('*') && t.endsWith('*')) {
                                        token = <span className='font-italic'>{t.slice(1, -1) + ' '}</span>
                                    }
                                }
                                return (
                                    <span key={i} className='font-light'>{token}</span>
                                )
                            })} */}
                            {article?.content}
                        </div>

                        {/* EDIT / DELETE */}
                        {(session && session.user && currentUser == article?.name) ? (
                            <div className='flex gap-3'>
                                <button className='bg-bl w-8 h-8 p-1.5 rounded' onClick={() => edit_article(article?._id)}><EditIcon /></button>
                                <button className='bg-red-800 w-8 h-8 p-1 rounded' onClick={() => delete_article(article?._id)}><DeleteIcon /></button>
                            </div>
                        ) : null}
                    </div>
                </div>
                </>
            )}
        </div>
    )
}
