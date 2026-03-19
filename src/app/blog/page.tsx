'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Image from 'next/image'
import Link from 'next/link'

import DownArrow from '/public/down-arrow-svgrepo-com.png'
import Loader from '../components/Loader'

export function DeleteIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14 11V17" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M4 7H20" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
    )
}

export function EditIcon() {
    return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#fff" stroke="#fff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></polygon> </g> </g> </g> </g></svg>
    )
}

export default function Page() {

    const { data: session, status } = useSession()

    type Post = {
        _id: string,
        content: string,
        date: string,
        name: string,
        tag: string,
        title: string
    }

    const [currentUser, setCurrentUser] = useState('')
    const [tag, setTag] = useState('')
    const [posts, setPosts] = useState<Post[]>([])
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [tagFilter, setTagFilter] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const handleChange = (e: any) => {
        setTagFilter(e.target.value)
    }

    // Get user
    useEffect(() => {
        if (session && session.user) {
            const user = session.user as { username: string }
            setCurrentUser(user.username)
        } else setCurrentUser('')
    },[session])

    const toggleTag = (tag: string) => {
        setTag(tag)
    }

    //Grabbing all the posts from the DB
    useEffect(() => {
        const getDb = async () => {
            setLoading(true)
            const response = await fetch(`/api`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const res = await response.json()
            const p: any = Object.entries(res)[0][1]
            setPosts(p)
            setFilteredPosts(p)
            setLoading(false)
        }
        getDb()
    }, [])
    
    //Filtering posts
    useEffect(() => {
        const filterPosts = (filter: string) => {
            const filtered: Post[] = posts.filter(post => {
                if (filter) {
                    return post.tag.toLowerCase() === filter.toLowerCase()
                }
                return true
            })
            setFilteredPosts(filtered)
        }
        filterPosts(tag)
    }, [tag, posts])
    
    const editPost = (id: string) => {
        window.location.href = `/blog/edit?_id=${id}`
    }
    const deletePost = async (id: string) => {
        const response = await fetch(`/api?_id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const res = await response.json()
        if (res.status === 200) {
            window.location.href = '/blog'
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            {loading ? (
                <Loader />
            ) : (
                <div className='bg-m h-full relative flex flex-col sm:pt-[57px] sm:w-screen sm:border-b border-light'>

                    {/* SEARCH */}
                    <div>
                        {isOpen ? (
                            <div className='sm:overflow-x-scroll overflow-y-hidden bg-d border-b border-light flex items-center gap-9 relative'>
                                <div className='flex gap-3 items-center sm:min-w-[100vw] p-3 z-20'>
                                    <input type="text" name="search" placeholder="Filter by tag..." autoCapitalize='off' autoCorrect='off' className='border p-1 px-3 rounded-full text-white bg-m border-light font-light' value={tagFilter} onChange={handleChange} />
                                    <button className='bg-bl text-white text-white font-bold text-sm px-4 py-1 rounded-full' onClick={() => toggleTag(tagFilter)}>Filter</button>
                                    <button className='text-neutral-500 text-sm py-1 rounded-full' onClick={() => {toggleTag(''); setTagFilter('')}}>Clear</button>
                                </div>
                                <div className='flex items-center flex-shrink-0 px-3 z-20'>
                                    {currentUser !== '' ? (
                                        <Link href='/blog/create-new-post' className='bg-bl text-white font-bold text-sm rounded-full px-3 py-1'>New Post</Link>
                                ) : null}
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <button className={`fixed right-3 ${isOpen ? `top-[58px] sm:top-[115px]` : 'top-[0px] sm:top-[57px]'} bg-d rounded-b-lg border border-t-0 border-light px-6 py-2 z-10 font-bold text-white text-lg`}onClick={() => {setIsOpen(!isOpen)}}>
                            <Image src={DownArrow} width="15" height="5" alt="" className={`w-3 h-3 duration-300 ${isOpen ? `rotate-180` : `rotate-0`}`} />
                        </button>
                    </div>

                    {/* POSTS */}
                    <div className='h-full overflow-y-scroll'>
                        <div className='w-full h-full'>
                            {filteredPosts.length > 0 ? (filteredPosts.map((post, index) => (
                                <div key={index} className='p-8 py-12 flex flex-col gap-5 sm:px-3 relative'>
                                    <div className='flex flex-col items-start gap-1'>
                                        <div className='flex items-center gap-2 sm:w-full sm:items-end sm:gap-1'>
                                            <h1 className='font-bold sm:text-xl text-white'>{post.title} <span className='font-light text-gray-400 text-xs pt-1 sm:pb-0.5 px-1'> by </span><span className='color-bl'> {post.name}</span></h1>
                                        </div>
                                        <div className='sm:w-full flex items-center gap-3'>
                                            <h2 className='font-light text-gray-400 text-neutral-500 text-xs'>{post.date}</h2>
                                            <h2 className='font-light text-gray-400 text-xs bg-l p-1 px-2 rounded-full'>{post.tag.toLowerCase()}</h2>
                                        </div>
                                    </div>
                                    <div className='font-light text-sm whitespace-pre-wrap max-w-[800px] text-neutral-400' dangerouslySetInnerHTML={{ __html: post.content }} />
                                    {(session && session.user && currentUser == post.name) ? (
                                        <div className='flex gap-3'>
                                            <button className='bg-bl w-8 h-8 p-1.5 rounded' onClick={() => editPost(post._id)}><EditIcon /></button>
                                            <button className='bg-red-800 w-8 h-8 p-1 rounded' onClick={() => deletePost(post._id)}><DeleteIcon /></button>
                                        </div>
                                    ) : null}
                                </div>
                            ))) : (<div className='h-full flex items-center justify-center'>
                                <h1 className='text-gray-300 text-2xl font-light text-center'>No posts found...</h1>
                            </div>)}
                        </div>
                    </div>
                </div>
            )}
        </Suspense>
    )
}