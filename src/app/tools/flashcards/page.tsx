'use client'

import { useEffect, useRef, useState } from "react"
import { Collapsible } from "../../components/Collapsible"
import { useSession } from 'next-auth/react'
import { v4 } from 'uuid'
import Loader from "../../components/Loader"

const Flashcards = () => {

    const { data: session, status } = useSession()

    interface Collection {
        _id: string
        name: string
        type: string
        parentId: string
    }

    interface Flashcard {
        _id: string
        user: string
        front: string
        back: string
        numberCorrect: number
        numberIncorrect: number
        subfolderId: string
    }

    const [loading, setLoading] = useState(true)

    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [categories, setCategories] = useState<Collection[]>([])

    const [categoryToAdd, setCategoryToAdd] = useState('')
    const [openCategory, setOpenCategory] = useState<Collection | undefined>(undefined)

    const [addingFolder, setAddingFolder] = useState(false)
    const [folderToAdd, setFolderToAdd] = useState('')
    const [openFolder, setOpenFolder] = useState<Collection | undefined>(undefined)

    const [openCard, setOpenCard] = useState<Flashcard | undefined>(undefined)

    const shuffledRef = useRef<Flashcard[] | null>(null)

    const [revealCard, setRevealCard] = useState(false)

    const [newCardFront, setNewCardFront] = useState('')
    const [newCardBack, setNewCardBack] = useState('')

    useEffect(() => {
        if (status === "loading") return

        setLoading(true)

        if (!session) {
            local_fetch()
        } else {
            db_fetch()
        }

        // localStorage.clear()
    }, [session, status])

    async function db_fetch() {
        if (session && session.user) {
            const response = await fetch('/api/flashcards')
            const res = await response.json()

            setCategories(res.collections)
            setOpenCategory(res.collections[0])
            setFlashcards(res.cards)

            setLoading(false)
        }
    }

    async function local_fetch() {
        const categories = localStorage.getItem('collections')
        const cards = localStorage.getItem('cards')
        if (categories) {
            setCategories(JSON.parse(categories))
            setOpenCategory(JSON.parse(categories)[0])
        }
        if (cards) {
            setFlashcards(JSON.parse(cards))
        }
        setLoading(false)
    }

    async function add_category() {
        if (session?.user) {
            try {
                if (!categoryToAdd.trim()) {
                    alert("Category name cannot be empty")
                    return
                }

                const response = await fetch("/api/flashcards", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        kind: "collection",
                        type: "category",
                        name: categoryToAdd
                    })
                })

                const data = await response.json()

                if (response.ok) {
                    alert(`Category created: ${data.id}`)

                    setCategoryToAdd('')

                    // Optionally, refresh your categories tree
                    db_fetch()
                } else {
                    alert(`Failed to create category: ${data.error || JSON.stringify(data)}`)
                }

            } catch (err) {
                console.error("Error adding category: ", err)
                alert("Error adding category")
            }
        } else {

            if (!categoryToAdd.trim()) {
                alert("Category name cannot be empty")
                return
            }
            let collections = localStorage.getItem('collections')
            if (collections) {
                let parsed = JSON.parse(collections)
                parsed.push({
                    _id: v4(),
                    kind: "collection",
                    type: "category",
                    name: categoryToAdd
                })
                localStorage.setItem('collections', JSON.stringify(parsed))
                alert(`Category created`)
            } else {
                localStorage.setItem('collections', JSON.stringify([{
                    _id: v4(),
                    kind: "collection",
                    type: "category",
                    name: categoryToAdd
                }]))
                alert(`Category created`)
            }
            setCategoryToAdd('')

            local_fetch()
        }
    }

    async function add_folder() {
        if (session?.user) {
            try {
                if (!folderToAdd.trim()) {
                    alert("Folder name cannot be empty")
                    return
                }

                console.log("CATEGORY ID: ", openCategory)

                const response = await fetch("/api/flashcards", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        kind: "collection",
                        type: "folder",
                        name: folderToAdd,
                        parentId: openCategory?._id
                    })
                })

                const data = await response.json()

                if (response.ok) {
                    alert(`Folder created: ${data.id}`)

                    setFolderToAdd('')

                    db_fetch()
                } else {
                    alert(`Failed to create folder: ${data.error || JSON.stringify(data)}`)
                }

            } catch (err) {
                console.error("Error adding folder: ", err)
                alert("Error adding folder")
            }
        } else {
            if (!folderToAdd.trim()) {
                alert("Folder name cannot be empty")
                return
            }
            let collections = localStorage.getItem('collections')
            if (collections) {
                let parsed = JSON.parse(collections)
                parsed.push({
                    _id: v4(),
                    kind: "collection",
                    type: "folder",
                    name: folderToAdd,
                    parentId: openCategory?._id
                })
                localStorage.setItem('collections', JSON.stringify(parsed))
                alert(`Folder created`)
            }
            setFolderToAdd('')

            local_fetch()
        }
    }

    async function add_card() {
        if (session?.user) {
            try {
                if (!newCardFront.trim() || !newCardBack.trim()) {
                    alert("Card front/back cannot be empty")
                    return
                }

                console.log("CATEGORY ID: ", openCategory)

                const response = await fetch("/api/flashcards", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        kind: "card",
                        user: session.user,
                        front: newCardFront,
                        back: newCardBack,
                        subfolderId: openFolder?._id
                    })
                })

                const data = await response.json()

                if (response.ok) {
                    alert(`Card created: ${data.id}`)

                    setNewCardFront('')
                    setNewCardBack('')

                    db_fetch()
                } else {
                    alert(`Failed to create card: ${data.error || JSON.stringify(data)}`)
                }

            } catch (err) {
                console.error("Error adding folder: ", err)
                alert("Error adding folder")
            }
        } else {
            if (!newCardFront.trim() || !newCardBack.trim()) {
                alert("Card front/back cannot be empty")
                return
            }
            let cards = localStorage.getItem('cards')
            if (cards) {
                let parsed = JSON.parse(cards)
                parsed.push({
                    _id: v4(),
                    kind: "card",
                    front: newCardFront,
                    back: newCardBack,
                    numberCorrect: 0,
                    numberIncorrect: 0,
                    subfolderId: openFolder?._id
                })
                localStorage.setItem('cards', JSON.stringify(parsed))
                alert(`Card created`)
            } else {
                let c = []
                c.push({
                    _id: v4(),
                    kind: "card",
                    front: newCardFront,
                    back: newCardBack,
                    numberCorrect: 0,
                    numberIncorrect: 0,
                    subfolderId: openFolder?._id
                })
                localStorage.setItem('cards', JSON.stringify(c))
                alert(`Card created`)
            }
            setNewCardFront('')
            setNewCardBack('')

            local_fetch()
        }
    }

    async function update_card(card: Flashcard, status: string) {
        setLoading(true)
        let c = card
        if (status === "fail") {
            c.numberIncorrect += 1
        } else if (status === "pass") {
            c.numberCorrect += 1
        }

        if (session?.user) {
            const result = await fetch(`/api/flashcards`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    _id: c._id,
                    numberCorrect: c.numberCorrect,
                    numberIncorrect: c.numberIncorrect
                })
            })

            const data = await result.json()

            if (!result.ok) {
                throw new Error(data.error || "Failed to update flashcard")
            }

            db_fetch()
        } else {
            let cs = flashcards
            cs[cs.findIndex(cd => cd._id === card._id)] = c
            localStorage.setItem('cards', JSON.stringify(cs))

        }

        setOpenCard(undefined)
        setRevealCard(false)

        get_new_card()

        setLoading(false)
    }

    function start_shuffle(cds: Flashcard[]) {
        shuffledRef.current = cds

        const randomIndex = Math.floor(Math.random() * cds.length)
        const cd = cds[randomIndex]

        setOpenCard(cd)
    }

    function get_new_card() {
        if (shuffledRef.current && openCard && shuffledRef.current.length > 1) {
            const idx = shuffledRef.current.indexOf(openCard)
            shuffledRef.current.splice(idx, 1)

            const randomIndex = Math.floor(Math.random() * shuffledRef.current.length)
            const cd = shuffledRef.current[randomIndex]

            setOpenCard(cd)
        }

        if (shuffledRef.current && shuffledRef.current.length <= 1) {
            shuffledRef.current = null
        }
    }

    return (
        <div className="w-full h-full sm:pt-[57px] flex flex-col z-10">

            {loading ? (
                <Loader />
            ) : (
                openFolder && !openCard ? (
                    <>
                        <div className="bg-d w-full sm:w-screen flex flex-col gap-3 p-3 relative border-b border-light">
                            <div className="flex items-center">
                                <Collapsible title={openFolder.name} open={false} back={() => {setOpenFolder(undefined)}}>
                                    <div className="flex items-center gap-3 w-full h-[33px]">
                                        <input type="text" placeholder="Front..." value={newCardFront} onChange={(e) => {setNewCardFront(e.target.value)}} className="bg-transparent text-emerald-200 border-b border-light py-1 text-md w-2/5" />
                                        <input type="text" placeholder="Back..." value={newCardBack} onChange={(e) => {setNewCardBack(e.target.value)}} className="bg-transparent text-emerald-200 border-b border-light py-1 text-md w-2/5" />
                                        <button onClick={add_card} className="font-bold text-emerald-200 rounded bg-bl px-3 text-sm h-full mt-auto w-1/5">Add</button>
                                    </div>
                                </Collapsible>
                            </div>
                        </div>
                        <div className="h-full bg-d grid grid-cols-2 auto-rows-min p-3 overflow-y-scroll gap-3 sm:border-b border-light">
                            {flashcards.filter(c => c.subfolderId === openFolder._id).length > 1 ? (
                                <div className="bg-bl w-full rounded shadow p-[2px] px-2 cursor-pointer col-span-2" onClick={() => {start_shuffle(flashcards.filter(c => c.subfolderId === openFolder._id))}}>
                                    <div className="text-emerald-200 font-light text-md bg-m rounded px-3 py-1.5">
                                        <h2 className="font-bold text-center">Shuffle Cards</h2>    
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                            {flashcards.map((card, index) => {
                                let front_split = card.front.split(' ')

                                let percent = 0
                                if (card.numberCorrect > 0 && card.numberIncorrect == 0) {
                                    percent = 100
                                } else if (card.numberCorrect > 0 && card.numberIncorrect > 0) {
                                    percent = (card.numberCorrect / (card.numberCorrect + card.numberIncorrect)) * 100
                                }

                                let style = `self-start ${percent >= 80 ? 'bg-emerald-900' : 'bg-l'} rounded py-[2px] px-2 relative shadow cursor-pointer`

                                if (card.subfolderId === openFolder._id) {
                                    return (
                                        <div key={index} className={style} onClick={() => {setOpenCard(card)}}>
                                            <div className="relative">
                                                <div className="text-emerald-200 font-light text-lg flex flex-col gap-1 bg-m rounded py-1.5 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <h2 className="font-bold">{front_split[0]}</h2>
                                                        {/* <h2 className="font-light text-neutral-500">{front_split[1]}</h2>  */}
                                                    </div>
                                                    <h3 className="text-sm">{card.back}</h3>    
                                                    <h4 className="font-thin text-sm opacity-50">{Math.round(percent)}% Success</h4>
                                                </div>     
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </>
                ) : openCard ? (
                    <>
                    <div className="bg-d border-b border-light w-full sm:w-screen flex flex-col gap-3 p-3 relative">
                        <div className="flex items-center">
                            <h1 className="text-emerald-200 font-bold text-2xl">{openCard.front.split(' ')[0]}</h1>
                        </div>
                        <div className="flex absolute top-0 right-0 px-3 pt-5">
                            <p className="text-neutral-500 underline text-xs cursor-pointer" onClick={() => {setOpenCard(undefined); setRevealCard(false); shuffledRef.current = null}}>Back</p>
                        </div>
                    </div>
                    <div className="flex-1 p-9 bg-d sm:border-b border-light">
                        <div className="bg-m border border-light w-full max-w-[300px] overflow-x-hidden rounded-2xl relative shadow">
                            <div className={`w-[200%] h-full flex transition-transform transform duration-500 ${revealCard ? `translate-x-[-50%]` : `translate-x-[0%]`}`}>
                                <div className="flex flex-col gap-3 h-full w-1/2 items-center justify-center relative p-3">
                                    <div className="flex flex-col gap-3 items-center justify-center flex-1 aspect-square bg-l w-full rounded-lg">
                                        <h1 className="text-4xl font-bold text-emerald-200">{openCard.front.split(' ')[0]}</h1>
                                        <h1 className="text-2xl font-light text-neutral-500">{openCard.front.split(' ')[1]}</h1>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                        <button className="rounded-lg bg-bl border border-transparent font-bold w-full py-1 text-emerald-200" onClick={() => {setRevealCard(true)}}>Show Back</button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 h-full w-1/2 items-center justify-center relative p-3">
                                    <div className="flex items-center justify-center flex-1 aspect-square bg-l w-full rounded-lg">
                                        <h1 className="text-4xl font-bold text-emerald-200 text-center">{openCard.back}</h1>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                        <button className="w-1/2 rounded-lg border border-light font-bold w-full py-1 text-emerald-200" onClick={() => {update_card(openCard, 'fail')}}>Fail</button>
                                        <button className="w-1/2 rounded-lg bg-bl font-bold w-full py-1 text-emerald-200" onClick={() => {update_card(openCard, 'pass')}}>Pass</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                ) : (
                    <>
                    <div className="bg-d w-full sm:w-screen flex flex-col gap-3 pt-3 border-b border-light">
                        <div className="flex justify-between px-3">
                            <Collapsible title="Categories" open={false} back={undefined}>
                                <div className="flex items-center gap-3 h-[33px]">
                                    <input type="text" placeholder="New category..." value={categoryToAdd} onChange={(e) => {setCategoryToAdd(e.target.value)}} className="bg-transparent text-emerald-200 border-b border-light py-1 text-md flex-1" />
                                    <button onClick={add_category} className="font-bold text-emerald-200 rounded bg-bl px-3 text-sm h-full">Submit</button>
                                </div>
                            </Collapsible>
                        </div>
                        <div>
                            <div className="flex gap-1 overflow-x-scroll w-full relative">
                                {categories.map((category, index) => {
                                    if (category.type === 'category') {
                                        return (
                                            <button key={index} className={`text-emerald-200 font-light text-sm px-3 py-3 cursor-pointer ${openCategory?.name === category.name ? "border-b-4 border-neutral-200" : "border-b-4 border-transparent" }`} onClick={() => {setOpenCategory(category)}}>{category.name}</button>
                                        )
                                    }
                                })}
                                <button className={`absolute bottom-1 right-3 text-3xl text-emerald-200 transition-transform duration-500 font-light ${addingFolder ? "transform rotate-45" : ""}`} onClick={() => {setAddingFolder(!addingFolder)}}>+</button>
                            </div>
                            {categories.length > 0 && addingFolder ? (
                                <div className="flex items-center gap-3 p-3 border-t border-light h-[50px]">
                                    <input type="text" placeholder="New folder..." value={folderToAdd} onChange={(e) => {setFolderToAdd(e.target.value)}} className="bg-transparent border-b border-light text-emerald-200 py-1 text-md flex-1 h-full" />
                                    <button onClick={add_folder} className="font-bold text-emerald-200 rounded bg-bl px-3 text-sm h-full cursor-pointer">Submit</button>
                                </div>
                            ) : <></>}
                        </div>
                    </div>
                    <div className="h-full bg-d flex flex-col items-center p-3 overflow-y-scroll gap-3 sm:border-b border-light">
                        {categories.length > 0 ? (
                            <div className="bg-bl w-full rounded shadow p-[2px] px-2 cursor-pointer" onClick={() => {start_shuffle(flashcards)}}>
                                <div className="text-emerald-200 font-light text-md bg-m rounded px-3 py-1.5">
                                    <h2 className="font-bold text-center">Shuffle All Cards</h2>    
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        {categories.map((category, index) => {
                            if (category.type === 'folder' && category.parentId === openCategory?._id) {
                                return (
                                    <div key={index} className="bg-l w-full rounded shadow p-[2px] px-2 cursor-pointer" onClick={() => {setOpenFolder(category)}}>
                                        <div className="text-emerald-200 font-light text-xl bg-m rounded px-3 py-1.5">
                                            <h2 className="font-bold">{category.name}</h2>    
                                            <h3 className="font-thin text-sm opacity-50">{flashcards?.filter((card) => card.subfolderId == category._id).length} cards</h3>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    </>
                )
            )}

        </div>
    )
}

export default Flashcards