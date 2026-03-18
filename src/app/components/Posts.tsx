'use client'

import React, {useEffect, useState} from 'react'
import { useSession } from 'next-auth/react'
import Loader from './Loader'

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

export default function Posts({ tag, userLoggedIn }: { tag: string, userLoggedIn: string }) {

    const { data: session, status } = useSession()

    type Post = {
        _id: string,
        content: string,
        date: string,
        name: string,
        tag: string,
        title: string
    }

    const [posts, setPosts] = useState<Post[]>([])
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState('')

    useEffect(() => {
        if (session && session.user) {
            const uname = session.user as { username: string }
            setUser(uname.username)
        }
    }, [session])

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
        <div className='h-full overflow-y-scroll'>
            <div className='w-full h-full divide-y dark:divide-neutral-700'>
                {loading ? (
                    <Loader />
                ) : (
                    filteredPosts.length > 0 ? (filteredPosts.map((post, index) => (
                        <div key={index} className='p-8 py-12 flex flex-col gap-5 bg-white dark:bg-neutral-900 sm:px-3 relative'>
                            <div className='flex flex-col items-start gap-1'>
                                <div className='flex items-center gap-2 sm:w-full sm:items-end sm:gap-1'>
                                    <h1 className='font-bold sm:text-xl dark:text-white'>{post.title} <span className='font-light text-gray-400 text-xs pt-1 sm:pb-0.5 px-1'> by </span><span className='text-blue-500'> {post.name}</span></h1>
                                </div>
                                <div className='sm:w-full flex items-center gap-3'>
                                    <h2 className='font-light text-gray-400 dark:text-neutral-500 text-xs'>{post.date}</h2>
                                    <h2 className='font-light text-gray-400 text-xs bg-gray-200 dark:bg-neutral-800 p-1 px-2 rounded-full'>{post.tag.toLowerCase()}</h2>
                                </div>
                            </div>
                            <div className='font-light text-sm whitespace-pre-wrap max-w-[800px] dark:text-neutral-400' dangerouslySetInnerHTML={{ __html: post.content }} />
                            {(session && session.user && user == post.name) ? (
                                <div className='flex gap-3'>
                                    <button className='bg-blue-900 w-8 h-8 p-1.5 rounded' onClick={() => editPost(post._id)}><EditIcon /></button>
                                    <button className='bg-red-900 w-8 h-8 p-1 rounded' onClick={() => deletePost(post._id)}><DeleteIcon /></button>
                                </div>
                            ) : null}
                        </div>
                    ))) : (<div className='h-full flex items-center justify-center'>
                        <h1 className='text-gray-300 text-2xl font-light text-center'>No posts found...</h1>
                    </div>)
                )}
            </div>
        </div> 
    )
}