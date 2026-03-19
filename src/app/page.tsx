'use client'

import React, { useEffect } from 'react'

import { useSession } from 'next-auth/react'

export default function Home() {
    const { data: session, status } = useSession()

    return (
        <div className='flex h-full w-full sm:flex-col p-3 sm:p-3 gap-3 sm:pt-16 overflow-y-scroll bg-d'>
            {session && session.user ? (
                <></>
            ) : (
                <></>
            )}
        </div>
    )
}
