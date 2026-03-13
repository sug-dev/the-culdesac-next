'use client'

import React, { useEffect } from 'react'

import System from './components/System'
import Ytdl from './components/Ytdl'
import { useSession } from 'next-auth/react'

export default function Home() {
    const { data: session, status } = useSession()

    return (
        <div className='flex h-full w-full sm:flex-col p-3 sm:p-3 gap-3 sm:pt-16 overflow-y-scroll bg-neutral-900'>

            {session && session.user ? (
                // <Ytdl />
                <></>
            ) : (
                <></>
            )}
            {/* <System />

            <div id='news' className='flex flex-col bg-neutral-800 border border-neutral-700 w-1/3 sm:w-full h-[350px] sm:h-1/2 max-w-[600px] rounded overflow-hidden'>
                <div className='w-full p-3 sm:p-2 border-b border-b-neutral-700'>
                    <h1 className='font-bold text-xl sm:text-sm text-neutral-200'>Recent News</h1>
                </div>
                <div className='overflow-y-scroll flex-1 w-full'>
                    <div className='w-full divide-y divide-neutral-700 max-w-[600px]'>
                        <div className='p-3 sm:p-2 py-9 sm:py-6 flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-neutral-200 text-lg sm:text-xs font-bold'>Tower Defense Game</h2>
                                <p className='text-neutral-600 text-sm sm:text-xs'>18 Oct 2024, 10:26PM EST</p>
                            </div>
                            <p className='text-neutral-400 font-light sm:text-xs'>There now exists the basics of a tower defense style game under the games tab. It&apos;s nowhere near finished, but it&apos;s a good jumping off point for something potentially interesting.</p>
                        </div>
                        <div className='p-3 sm:p-2 py-9 sm:py-6 flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-neutral-200 text-lg sm:text-xs font-bold'>Dashboard Concepts</h2>
                                <p className='text-neutral-600 text-sm sm:text-xs'>17 Oct 2024, 11:14PM EST</p>
                            </div>
                            <p className='text-neutral-400 font-light sm:text-xs'>The site will begin to slowly roll out changes to the homepage.<br></br><br></br>These changes include a recent news section where you can find brief notes about new features or other updates, and also a system status module that displays the CPU and memory usage for the machine the site runs on.</p>
                        </div>
                    </div>
                </div>
            </div> */}

        </div>
    )
}
