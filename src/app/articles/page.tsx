'use client'

import React, {useEffect, useState} from 'react'
import { useSession } from 'next-auth/react'

import Image from 'next/image'
import Link from 'next/link'

import DownArrow from '/public/down-arrow-svgrepo-com.png'
import Loader from '../components/Loader'

export default function Page() {

    const { data: session, status } = useSession()

    type Article = {
        _id: string,
        content: string,
        date: string,
        name: string,
        title: string
    }

    const [currentUser, setCurrentUser] = useState('')
    const [articles, setArticles] = useState<Article[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    // Get user
    useEffect(() => {
        if (session && session.user) {
            const user = session.user as { username: string }
            setCurrentUser(user.username)
        } else setCurrentUser('')
    },[session])

    useEffect(() => {
        const get_articles = async () => {
            setLoading(true)
            const response = await fetch(`/api/articles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const res = await response.json()
            const a: any = Object.entries(res)[0][1]
            setArticles(a)
            
            setLoading(false)
        }
        get_articles()
    }, [])

    return (
        <div className='bg-d h-full relative flex flex-col sm:pt-[57px] sm:w-screen'>
            {loading ? (
                <Loader />
            ) : (
                <>
                {/* SEARCH */}
                <div className=''>
                    {isOpen ? (
                        <div className='sm:overflow-x-scroll overflow-y-hidden bg-d border-b border-light flex items-center justify-between gap-9 relative'>
                            <div className='flex gap-3 items-center sm:min-w-[100vw] p-3'>
                                <input type="text" name="search" placeholder="Filter by tag..." autoCapitalize='off' autoCorrect='off' className='border p-1 px-3 rounded-full text-emerald-200 bg-m border-light font-light' />
                                <button className='bg-bl text-emerald-200 font-bold text-sm px-4 py-1 rounded-full' onClick={() => {}}>Filter</button>
                                <button className='text-neutral-500 text-sm py-1 rounded-full' onClick={() => {}}>Clear</button>
                            </div>
                            <div className='flex items-center flex-shrink-0 px-3'>
                                {currentUser !== '' ? (
                                    <Link href='/articles/create-new-article' className='bg-bl text-emerald-200 font-bold text-sm rounded-full px-3 py-1'>New Article</Link>
                            ) : null}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    <button className={`fixed right-3 ${isOpen ? `top-[58px] sm:top-[115px]` : 'top-[0px] sm:top-[57px]'} bg-d rounded-b-lg border border-t-0 border-light px-6 py-2 z-10 font-bold text-emerald-200 text-lg`}onClick={() => {setIsOpen(!isOpen)}}>
                        <Image src={DownArrow} width="15" height="5" alt="" className={`w-3 h-3 duration-300 ${isOpen ? `rotate-180` : `rotate-0`}`} />
                    </button>
                </div>
                <div className='flex-1 relative p-9 sm:p-3 sm:pt-12 grid grid-cols-2 sm:grid-cols-1 auto-rows-min gap-9 sm:border-b border-light'>
                    {articles ? (
                        articles.map((a, i) => {
                            return (
                                <Link href={`/articles/${a._id}`} key={i} className='self-start bg-m border border-light rounded flex flex-col max-h-[300px] sm:max-h-[250px] overflow-y-hidden relative shadow cursor-pointer'>
                                    <h1 className='p-3 text-emerald-200 font-bold text-xl'>{a.title}</h1>
                                    <p className='p-3 text-neutral-400 font-light text-xs whitespace-pre-wrap'>{a.content}</p>
                                    <div className='absolute bottom-0 left-0 w-full h-2/3 bg-m-fade'></div>
                                </Link>
                            )
                        })
                    ) : (
                        <h1 className='text-neutral-500 text-sm font-light'>Nothing to see here...</h1>
                    )}
                </div>
                </>
            )}
        </div>
    )
}
