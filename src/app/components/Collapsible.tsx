'use client'

import Link from "next/link"
import { PropsWithChildren, useState } from "react"

interface Flashcard {
    id: string
    front: string
    back: string
    numberCorrect: number
    numberIncorrect: number,
    folder: string 
}

export const Collapsible = ({ children, title, open }: PropsWithChildren & { title: string, open: boolean }) => {
    const [isOpen, setIsOpen] = useState(open)
    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setIsOpen(v => !v)}
                    className={`font-bold flex gap-2 flex-1 text-2xl ${
                        isOpen ? "text-neutral-300" : "text-neutral-300"
                    }`}
                    >
                    {title}
                    <span
                        className={`pt-[6px] font-black text-neutral-500 transition-transform ${
                        isOpen ? "rotate-180 -translate-y-[3px]" : ""
                        }`}
                    >
                        ^
                    </span>
                </button>
                {/* <Link href={`/flashcards/folders/${title}`} className={isOpen ? "text-neutral-300 font-bold text-xs underline" : "text-neutral-300 font-bold text-xs underline"}>start!</Link> */}
            </div>
            {isOpen && <div className="w-full">{children}</div>}
        </div>
    )
}