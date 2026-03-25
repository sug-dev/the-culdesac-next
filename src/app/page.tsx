'use client'

import React, { useEffect } from 'react'

import { Bogo } from './components/Bogo'

import { useSession } from 'next-auth/react'

export default function Home() {
    const { data: session, status } = useSession()

    return (
        <div className='flex h-full w-full sm:flex-col p-3 sm:p-3 gap-3 sm:pt-[57px] overflow-y-scroll bg-d'>
            <div className='grid grid-cols-4 sm:grid-cols-2 sm:pt-3 w-full h-full auto-rows-min'>
                <Bogo />
            </div>
        </div>
    )
}
