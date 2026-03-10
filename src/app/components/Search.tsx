'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DownArrow from '/public/down-arrow-svgrepo-com.png'

type SearchProps = {
    text: string,
    func: (a: string) => void,
    currentUser: any
}

export default function Search({ text, func, currentUser }: SearchProps) {

    const [tagFilter, setTagFilter] = useState('')

    const [isOpen, setIsOpen] = useState(false)

    const handleChange = (e: any) => {
        setTagFilter(e.target.value)
    }

    return (
        <div className='sm:overflow-x-scroll overflow-y-hidden bg-white dark:bg-neutral-950 flex items-center gap-9 relative'>
            {isOpen ? (
                <>
                <div className='flex gap-3 items-center min-w-[100vw] p-3 z-20'>
                    <input type="text" name="search" placeholder={text} autoCapitalize='off' autoCorrect='off' className='border p-1 px-3 rounded-full dark:text-neutral-300 dark:bg-neutral-900 dark:border-transparent font-light' value={tagFilter} onChange={handleChange} />
                    <button className='bg-blue-900 text-white dark:text-neutral-200 font-bold text-sm px-4 py-1 rounded-full' onClick={() => func(tagFilter)}>Filter</button>
                    <button className='text-gray-400 text-sm py-1 rounded-full hover:underline' onClick={() => {func(''); setTagFilter('')}}>Clear</button>
                </div>
                <div className='flex items-center flex-shrink-0 px-3 z-20'>
                    {currentUser !== '' ? (
                        <Link href='/blog/create-new-post' className='bg-blue-900 text-white font-bold text-sm rounded-full px-3 py-1'>New Post</Link>
                ) : null}
                </div>
                </>
            ) : (
                <></>
            )}
            <button className={`fixed right-3 ${isOpen ? `top-[105px]` : 'top-[50px]'} bg-neutral-950 rounded-b-lg px-6 py-2 z-10 font-bold text-neutral-300 text-lg`}onClick={() => {setIsOpen(!isOpen)}}>
                <Image src={DownArrow} width="15" height="5" alt="" className={`w-3 h-3 duration-300 ${isOpen ? `rotate-180` : `rotate-0`}`} />
            </button>
        </div>
    )

}