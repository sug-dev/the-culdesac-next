'use client'

import Link from "next/link"
import Image from 'next/image'
import { PropsWithChildren, useState } from "react"
import DownArrow from '/public/down-arrow-svgrepo-com.png'

interface Flashcard {
    id: string
    front: string
    back: string
    numberCorrect: number
    numberIncorrect: number,
    folder: string 
}

export const Collapsible = ({ children, title, open, back }: PropsWithChildren & { title: string, open: boolean, back: any }) => {
    const [isOpen, setIsOpen] = useState(open)
    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`font-bold flex gap-2 flex-1 text-2xl flex items-center ${
                        isOpen ? "text-neutral-300" : "text-neutral-300"
                    }`}
                    >
                    {title}
                    <Image src={DownArrow} width="15" height="5" alt="" className={`w-3 h-3 duration-300 ${isOpen ? `rotate-0` : `rotate-180`}`} />
                </button>
                {back ? (
                    <div className="h-full" onClick={back}>
                        <p className="underline text-neutral-500 text-xs">Back</p>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            {isOpen && <div className="w-full">{children}</div>}
        </div>
    )
}