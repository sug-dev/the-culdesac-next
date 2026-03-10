'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import Search from '../components/Search'
import Posts from '../components/Posts'

export default function Page() {

    const { data: session, status } = useSession()

    const [currentUser, setCurrentUser] = useState('')
    const [tag, setTag] = useState('')

    useEffect(() => {
        if (session && session.user) {
            const user = session.user as { username: string }
            setCurrentUser(user.username)
        } else setCurrentUser('')
    },[session])

    const toggleTag = (tag: string) => {
        setTag(tag)
    }

    return (
        <Suspense>
            <div className='bg-gray-100 dark:bg-neutral-900 h-full relative flex flex-col sm:pt-[52px] sm:w-screen'>
                <Search text="Filter by tag..." func={toggleTag} currentUser={currentUser} />
                <Posts tag={tag} userLoggedIn={currentUser}/>
            </div>
        </Suspense>
    )
}