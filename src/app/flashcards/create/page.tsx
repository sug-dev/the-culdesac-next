'use client'

import { useState, useEffect } from "react"
import { v4 } from 'uuid'
import { useSession } from 'next-auth/react'

const CreateFlashcard = () => {

    const { data: session, status } = useSession()

    interface Flashcard {
        id: string
        user: string | undefined
        front: string
        back: string
        numberCorrect: number
        numberIncorrect: number,
        category: string
        folder: string
        subfolder: string

    }

    const [front, setFront] = useState('')
    const [back, setBack] = useState('')
    const [category, setCategory] = useState('')
    const [folder, setFolder] = useState('')
    const [subfolder, setSubfolder] = useState('')
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [user, setUser] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (session && session.user) {
            const user = session.user as { username: string }
            setUser(user.username)
        } else {
            setUser(undefined)
            const cards = localStorage.getItem('flashcards')
            if (cards && cards != '[]') {
                try {
                    const parsedCards = JSON.parse(cards)
                    setFlashcards(parsedCards)
                } catch (e) {
                    console.error('Failed to parse flashcards:', e)
                }
            }
        }
    }, [])

    const createCard = async () => {
        if (back != '' && front != '') {
            const uid = v4()

            const flashcard = {
                id: uid,
                user: user,
                front: front,
                back: back,
                numberCorrect: 0,
                numberIncorrect: 0,
                category: category,
                folder: folder,
                subfolder: subfolder
            }

            if (session && session.user) {
                const response = await fetch('/api/flashcards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(flashcard)
                })
            } else {
                const cards = flashcards
                cards.push(flashcard)
                localStorage.setItem('flashcards', JSON.stringify(cards))
            }

            setFront('')
            setBack('')
            setCategory('')
            setFolder('')
            setSubfolder('')

            alert("Card Created")
        } else alert("Please add card information")
    }

    return (
        <div className='relative flex flex-col h-dvh w-full'>
            <a href="/flashcards" className="fixed top-[64px] left-3 text-neutral-200 font-bold underline">Back</a>
            <div className="w-full h-full flex flex-col items-center justify-center sm:justify-center gap-3 p-3">
                <div className="card gap-3 w-full max-w-[500px] aspect-[3/2] flex flex-col justify-evenly items-center">
                    <div className="bg-black/15 backdrop-blur-sm border border-black rounded h-1/2 flex justify-center w-full">
                        <input className="bg-transparent text-xl text-neutral-200 card-input text-center font-light px-2 py-1 rounded-none w-full" placeholder="Front" value={front} onChange={(e) => {setFront(e.target.value)}}/>
                    </div>
                    <div className="bg-black/15 backdrop-blur-sm border border-black rounded h-1/2 flex justify-center w-full">
                        <input className="bg-transparent text-xl text-neutral-200 card-input text-center font-light px-2 py-1 rounded-none w-full" placeholder="Back" value={back} onChange={(e) => {setBack(e.target.value)}}/>
                    </div>
                </div>
                <div className="flex gap-3 w-full max-w-[500px]">
                    {/* <input className="w-2/3 bg-black/15 backdrop-blur-sm border border-black text-neutral-200 card-input font-light px-3 py-1 rounded-full" placeholder="Folder" value={folder} onChange={(e) => {setFolder(e.target.value)}}/> */}
                    <button className="bg-emerald-800 flex-1 text-white rounded-full px-4 py-2 font-bold border border-black" onClick={createCard}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default CreateFlashcard