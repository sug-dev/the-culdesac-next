'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

const Page = () => {

    const router = useRouter()
    const { data: session, status } = useSession()

    interface Flashcard {
        id: string
        user: string
        front: string
        back: string
        numberCorrect: number
        numberIncorrect: number
        category: string
        folder: string 
        subfolder: string
    }

    const path = usePathname()
    const cardId = decodeURIComponent(path).split('/').pop()

    const [allCards, setAllCards] = useState<Flashcard[]>([])
    const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([])
    const [card, setCard] = useState<Flashcard | undefined>()
    const [checked, setChecked] = useState(false)
    const [valueToCheck, setValueToCheck] = useState('')
    const [isCorrect, setIsCorrect] = useState(false)
    const [alert, setAlert] = useState(false)
    const [loading, setLoading] = useState(false)

    const [splitOne, setSplitOne] = useState<string | undefined>('')
    const [splitTwo, setSplitTwo] = useState<string | undefined>('')

        useEffect(() => {

        if (status === "loading") return

        const get_cards_from_db = async (id: string) => {
            setLoading(true)
            const response = await fetch(`/api/flashcards?id=${encodeURIComponent(id)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const res = await response.json()
            setCard(res[0])
        }

        const get_cards_from_local = (id: string) => {
            const cards = localStorage.getItem('flashcards')
            if (cards && cards != '[]') {
                try {
                    const parsedCards = JSON.parse(cards)
                    setCard(parsedCards.find((card: Flashcard) => card.id === id))
                } catch (e) {
                    console.error('Failed to parse flashcards:', e)
                }
            }
        }

        if (cardId) {
            if (session?.user) {
                const user = session.user as { username: string }
                get_cards_from_db(cardId)
            } else {
                get_cards_from_local(cardId)
            }
        }

    }, [session, status])

    // useEffect(() => {
    //     const cards = localStorage.getItem('flashcards')
    //     if (cards) {
    //         const parsedCards = JSON.parse(cards)
    //         setAllCards(parsedCards)
    //         const cardTitle = cardName.split("/")
    //         const folder = parsedCards.find((card: Flashcard) => card.front === cardTitle[cardTitle.length - 1]).folder
    //         const filtered = parsedCards.filter((card: Flashcard) => card.folder == folder)
    //         setFilteredFlashcards(filtered)
    //     }
    // }, [])

    // useEffect(() => {
    //     if (filteredFlashcards && filteredFlashcards.length > 0) {
    //         const cardTitle = cardName.split("/")
    //         const cardToSet = filteredFlashcards.find(card => card.front === cardTitle[cardTitle.length - 1])
    //         setCard(cardToSet)
    //         if (cardToSet) {
    //             let split = cardToSet.front.match(/([^\(\)]+)|(\([^)]*\))/g)
    //             if (split) {
    //                 setSplitOne(split[0])
    //                 setSplitTwo(split[1])
    //             } else {
    //                 setSplitOne(cardToSet.front)
    //                 setSplitTwo('')
    //             }
    //         }
    //     }
    // }, [filteredFlashcards, cardName])

    // useEffect(() => {
    //     if (allCards.length > 0) {
    //         localStorage.setItem('flashcards', JSON.stringify(allCards))
    //     }
    // }, [allCards])

    

    const checkCard = () => {
        if (card) {
            if (valueToCheck.toLowerCase() == card.back.toLowerCase()) {
                setIsCorrect(true)
                updateCardCorrect(card.id, 'numberCorrect')
            } else {
                setIsCorrect(false)
                updateCardCorrect(card.id, 'numberIncorrect')
            }
            setChecked(true)
        }
    }

    const updateCardCorrect = (id: string, key: 'numberCorrect' | 'numberIncorrect') => {
        setAllCards((prevCards: Flashcard[]) =>
            prevCards.map(card =>
                card.id === id ? { ...card, [key]: card[key] + 1 } : card
            )
        )
    }

    const newCard = () => {
        if (filteredFlashcards.length == 1) {
            router.push(`/flashcards`)
        }
        let tempCards = filteredFlashcards.filter((card) => card !== card)
        let n = Math.floor(Math.random() * tempCards.length)
        console.log(n)
        router.push(`/flashcards/${filteredFlashcards[n].front}`)
    }

    const removeCard = () => {
        let tempCards = [...allCards]
        const idx = allCards.findIndex(crd => crd.id === card?.id)
        if (idx !== -1) {
            tempCards.splice(idx, 1)
            setAllCards(tempCards)
            localStorage.setItem('flashcards', JSON.stringify(tempCards))
            router.push('/flashcards')
        }
    }

    useEffect(() => {
        let split = card?.front.match(/([^\(\)]+)|(\([^)]*\))/g)
        if (split) {
            setSplitOne(split[0])
            setSplitTwo(split[1])
        } else {
            setSplitOne(card?.front)
            setSplitTwo('')
        }
    }, [card])

    return (
        <div className='w-full flex-1 p-3 relative flex flex-col'>
            <div className="w-full flex-1 flex flex-col items-center justify-center sm:justify-center gap-3 pt-[64px]">
                <a href="/flashcards" className="fixed top-[64px] left-3 text-neutral-300 font-bold underline">Back</a>
                <div id='card'>
                    <div id='card-inner' className={checked ? 'card-hover' : 'none'}>
                        <div id='card-front'>
                            <h1 className="card-info text-neutral-200 text-2xl leading-[43px] mt-[43px]">{splitOne}</h1>
                            <h2 className="card-info text-neutral-600 font-light leading-[43px]">{splitTwo}</h2>
                            <button className='absolute bottom-1 right-1 rotate-45 text-neutral-600 font-light text-[28px] pb-[3px] leading-[0px] text-center w-[36px] h-[36px]' onClick={() => setAlert(true)}>+</button>
                        </div>
                        <div id='card-back'>
                            <h1 id='card-back-header'>
                                {splitOne}
                            </h1>
                            <div id='card-back-inner'>
                                <h1 className="card-info text-neutral-200 text-xl leading-[43px]">{card?.back}</h1>
                                <h1 className={isCorrect ? 'card-info text-emerald-600 text-xl leading-[43px]' : 'text-xl card-info text-red-500 line-through leading-[43px]'}>{valueToCheck.charAt(0).toUpperCase() + valueToCheck.slice(1)}</h1>
                            </div>
                            <button className='absolute bottom-1 right-1 rotate-45 text-neutral-600 font-light text-[28px] pb-[3px] leading-[0px] text-center w-[36px] h-[36px]' onClick={() => setAlert(true)}>+</button>
                        </div>
                    </div>
                </div>
                {!checked ? (
                    <div id='card-check-container' className='flex gap-3 w-full'>
                        <input className="w-2/3 bg-black/15 backdrop-blur-sm border border-black text-neutral-200 card-input font-light px-3 py-1 rounded-full" placeholder='What is this in English?' onChange={(e) => {setValueToCheck(e.target.value)}} />
                        <button className="bg-emerald-800 flex-1 text-white rounded-full px-4 py-2 font-bold border border-black" onClick={checkCard}>Submit</button>
                    </div>
                ) : (
                    // <div id='card-check-container'>
                    //     <button className="bg-emerald-800 text-neutral-200 rounded px-3 py-2 font-bold w-max" onClick={newCard}>New Card</button>
                    // </div>
                    <></>
                )}
            </div>
            {alert ? (
                <div id='alert-container'>
                    <div className='flex flex-col divide-y divide-neutral-700'>
                        <h1 className='font-bold text-2xl text-neutral-200 py-6'>Delete Card:</h1>
                        <h2 className='text-xl text-neutral-200 py-6'>Are you sure you want to delete this card?</h2>
                        <div className='flex justify-between py-6'>
                            <button className='bg-red-700 text-neutral-200 font-bold text-xl px-5 py-1 rounded' onClick={removeCard}>Yes</button>
                            <button className='bg-emerald-700 text-neutral-200 font-bold text-xl px-5 py-1 rounded' onClick={() => {setAlert(false)}}>No</button>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

export default Page