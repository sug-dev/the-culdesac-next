'use client'

import Image from 'next/image'
import { PropsWithChildren, useState } from "react"
import DownArrow from '/public/down-arrow-svgrepo-com.png'

export const Collapsible = ({ children, title, open, back }: PropsWithChildren & { title: string, open: boolean, back: any }) => {
    const [isOpen, setIsOpen] = useState(open)
    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`font-bold flex gap-2 flex-1 text-2xl flex items-center ${
                        isOpen ? "text-emerald-200" : "text-emerald-200"
                    }`}
                    >
                    {title}
                    <Image src={DownArrow} width="15" height="5" alt="" className={`w-3 h-3 duration-300 ${isOpen ? `rotate-0` : `rotate-180`}`} />
                </button>
                {back ? (
                    <div className="h-full cursor-pointer" onClick={back}>
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