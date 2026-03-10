'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Collapsible } from "../components/Collapsible"
import { useSession } from 'next-auth/react'
import { v4 } from 'uuid'
import Loader from "../components/Loader"

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

    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [categories, setCategories] = useState<Collection[]>([])
    const [folders, setFolders] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    const [categoryToAdd, setCategoryToAdd] = useState('')
    const [openCategory, setOpenCategory] = useState<Collection | undefined>(undefined)

    const [addingFolder, setAddingFolder] = useState(false)
    const [folderToAdd, setFolderToAdd] = useState('')
    const [openFolder, setOpenFolder] = useState<Collection | undefined>(undefined)

    const [openCard, setOpenCard] = useState<Flashcard | undefined>(undefined)

    const [revealCard, setRevealCard] = useState(false)

    const [newCardFront, setNewCardFront] = useState('')
    const [newCardBack, setNewCardBack] = useState('')

    const colors = [
        'bg-red-700','bg-orange-700','bg-amber-700','bg-yellow-700','bg-lime-700',
        'bg-green-700','bg-emerald-700','bg-teal-700','bg-cyan-700','bg-sky-700',
        'bg-blue-700','bg-indigo-700','bg-violet-700','bg-purple-700',
        'bg-fuchsia-700','bg-pink-700','bg-rose-700'
    ]

    useEffect(() => {

        if (status === "loading") return

        setLoading(true)

        get_categories()
        get_folders()
        get_cards()
        // localStorage.clear()

    }, [session, status])

    async function get_categories() {
        if (session?.user) {
            const response = await fetch(`/api/flashcards`)
            const res = await response.json()
            setCategories(res.collections)
            setOpenCategory(res.collections[0])
        } else {
            const categories = localStorage.getItem('collections')
            if (categories) {
                const parsed_categories = JSON.parse(categories)
                setCategories(parsed_categories)
                setOpenCategory(parsed_categories[0])
            }
        }
        setLoading(false)
    }

    async function get_folders() {
        if (session?.user) {
            const response = await fetch(`/api/flashcards`)
            const res = await response.json()
            setFolders(res)
        } else {
            const folders = localStorage.getItem('collections')
            if (folders) {
                const parsed_folders = JSON.parse(folders)
                setFolders(parsed_folders)
            }
        }
        setLoading(false)
    }

    async function get_cards() {
        if (session?.user) {
            const response = await fetch(`/api/flashcards`)
            const res = await response.json()
            setFlashcards(res.cards)
        } else {
            const cards = localStorage.getItem('collections')
            if (cards) {
                const parsed_cards = JSON.parse(cards)
                setFlashcards(parsed_cards.filter((card: any) => card.kind == 'card'))
            }
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
                    // e.g., fetchCategories()
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
        }
        get_categories()
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

                    // Optionally, refresh your categories tree
                    // e.g., fetchCategories()
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
        }
        get_folders()
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

                    // Optionally, refresh categories
                    // e.g., fetchCategories()
                } else {
                    // alert(`Failed to create card: ${data.error || JSON.stringify(data)}`)
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
            let collections = localStorage.getItem('collections')
            if (collections) {
                let parsed = JSON.parse(collections)
                parsed.push({
                    _id: v4(),
                    kind: "card",
                    front: newCardFront,
                    back: newCardBack,
                    subfolderId: openFolder?._id
                })
                localStorage.setItem('collections', JSON.stringify(parsed))
                alert(`Card created`)
            }
            setNewCardFront('')
            setNewCardBack('')
        }
        get_cards()
    }

    async function update_card(card: Flashcard, status: string) {
        setLoading(true)
        let c = card
        if (status === "fail") {
            c.numberIncorrect += 1
        } else if (status === "pass") {
            c.numberCorrect += 1
        }

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

        get_cards()
        setOpenCard(undefined)
        setRevealCard(false)
        setLoading(false)
    }

    function get_random_color() {
        let min = 0
        let max = colors.length - 1
        const n = Math.floor(Math.random() * (max - min + 1)) + min
        return colors[n]
    }
    

    return (
        <div className="w-full max-w-[800px] h-full sm:pt-[52px] flex flex-col z-10">

            {loading ? (
                <Loader />
            ) : (
                openFolder && !openCard ? (
                    <>
                    <div className="bg-neutral-900 w-screen flex flex-col gap-3 p-3 max-w-[800px] relative">
                        <div className="flex items-center">
                            <Collapsible title={openFolder.name} open={false} back={() => {setOpenFolder(undefined)}}>
                                <div className="flex items-center gap-3 w-full h-[33px]">
                                    {/* <div className="flex gap-2">

                                    </div> */}
                                    <input type="text" placeholder="Front..." value={newCardFront} onChange={(e) => {setNewCardFront(e.target.value)}} className="bg-transparent text-neutral-200 border-b border-neutral-200 py-1 text-md w-2/5" />
                                    <input type="text" placeholder="Back..." value={newCardBack} onChange={(e) => {setNewCardBack(e.target.value)}} className="bg-transparent text-neutral-200 border-b border-neutral-200 py-1 text-md w-2/5" />
                                    <button onClick={add_card} className="font-bold text-neutral-200 rounded bg-cyan-900 px-3 text-sm h-full mt-auto w-1/5">Add</button>
                                </div>
                            </Collapsible>
                        </div>
                        {/* <div className="flex absolute top-0 right-0 px-3 pt-5">
                            <p className="text-neutral-400 underline font-light text-xs" onClick={() => {setOpenFolder(undefined)}}>Back</p>
                        </div> */}
                    </div>
                    <div className="h-full bg-neutral-800 flex flex-col items-center p-3 overflow-y-scroll gap-3">
                        {flashcards.map((card, index) => {
                            let style = `bg-emerald-900 w-full rounded p-2 px-3 relative shadow`
                            if (card.subfolderId === openFolder._id) {
                                let percent = 0
                                if (card.numberCorrect > 0 && card.numberIncorrect == 0) {
                                    percent = 100
                                } else if (card.numberCorrect > 0 && card.numberIncorrect > 0) {
                                    percent = (card.numberCorrect / (card.numberCorrect + card.numberIncorrect)) * 100
                                }
                                return (
                                    <div key={index} className={style} onClick={() => {setOpenCard(card)}}>
                                        {/* <div className="absolute top-0 left-0 h-full w-1/2 bg-emerald-800 z-0"></div> */}
                                        <div className="text-neutral-300 font-light text-lg">
                                            <h2 className="font-bold">{card.front}</h2>    
                                            <h3 className="font-thin text-sm opacity-50">{Math.round(percent)}% Success</h3>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    </>
                ) : openCard ? (
                    <>
                    <div className="bg-neutral-900 w-screen flex flex-col gap-3 p-3 max-w-[800px] relative">
                        <div className="flex items-center">
                            <h1 className="text-neutral-300 font-bold text-2xl">{openCard.front}</h1>
                        </div>
                        <div className="flex absolute top-0 right-0 px-3 pt-5">
                            <p className="text-neutral-500 underline text-xs" onClick={() => {setOpenCard(undefined); setRevealCard(false)}}>Back</p>
                        </div>
                    </div>
                    <div className="flex-1 p-9 bg-neutral-800">
                        <div className="bg-neutral-700 w-full overflow-x-hidden h-full rounded-3xl relative shadow-md">
                            <div className={`w-[200%] h-full flex transition-transform transform duration-500 ${revealCard ? `translate-x-[-50%]` : `translate-x-[0%]`}`}>
                                <div className="flex flex-col h-full w-1/2 items-center justify-center relative p-3">
                                    <div className="flex items-center justify-center flex-1">
                                        <h1 className="text-4xl font-bold text-white">{openCard.front}</h1>
                                    </div>
                                    <button className="rounded-2xl bg-neutral-800 font-bold w-full py-1 text-neutral-500" onClick={() => {setRevealCard(true)}}>Show Back</button>
                                </div>
                                <div className="flex flex-col h-full w-1/2 items-center justify-center relative p-3">
                                    <div className="flex items-center justify-center flex-1">
                                        <h1 className="text-4xl font-bold text-white">{openCard.back}</h1>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                        <button className="w-1/2 rounded-2xl bg-neutral-800 font-bold w-full py-1 text-neutral-500" onClick={() => {update_card(openCard, 'fail')}}>Fail</button>
                                        <button className="w-1/2 rounded-2xl bg-blue-700 font-bold w-full py-1 text-neutral-100" onClick={() => {update_card(openCard, 'pass')}}>Pass</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                ) : (
                    <>
                    <div className="bg-neutral-900 w-screen flex flex-col gap-3 pt-3 max-w-[800px]">
                        <div className="flex justify-between px-3">
                            <Collapsible title="Categories" open={false} back={undefined}>
                                <div className="flex items-center gap-3 h-[33px]">
                                    <input type="text" placeholder="New category..." value={categoryToAdd} onChange={(e) => {setCategoryToAdd(e.target.value)}} className="bg-transparent text-neutral-200 border-b border-neutral-200 py-1 text-md flex-1" />
                                    <button onClick={add_category} className="font-bold text-neutral-200 rounded bg-cyan-900 px-3 text-sm h-full">Submit</button>
                                </div>
                            </Collapsible>
                        </div>
                        <div>
                            <div className="flex gap-1 overflow-x-scroll w-full relative">
                                {categories.map((category, index) => {
                                    if (category.type === 'category') {
                                        return (
                                            <button key={index} className={`text-neutral-300 font-light text-sm px-3 py-3 ${openCategory?.name === category.name ? "border-b-4 border-neutral-200" : "border-b-4 border-transparent" }`} onClick={() => {setOpenCategory(category)}}>{category.name}</button>
                                        )
                                    }
                                })}
                                <button className={`absolute bottom-1 right-3 text-3xl text-neutral-300 transition-transform duration-500 font-light ${addingFolder ? "transform rotate-45" : ""}`} onClick={() => {setAddingFolder(!addingFolder)}}>+</button>
                            </div>
                            {categories.length > 0 && addingFolder ? (
                                <div className="flex items-center gap-3 p-3 border-t border-neutral-300/15 h-[50px]">
                                    <input type="text" placeholder="New folder..." value={folderToAdd} onChange={(e) => {setFolderToAdd(e.target.value)}} className="bg-transparent border-b border-b-neutral-700 text-neutral-200 py-1 text-md flex-1 h-full" />
                                    <button onClick={add_folder} className="font-bold text-neutral-200 rounded bg-cyan-900 px-3 text-sm h-full">Submit</button>
                                </div>
                            ) : <></>}
                        </div>
                    </div>
                    <div className="h-full bg-neutral-800 flex flex-col items-center p-3 overflow-y-scroll gap-4">
                        {categories.map((category, index) => {
                            if (category.type === 'folder' && category.parentId === openCategory?._id) {
                                return (
                                    <div key={index} className="text-neutral-300 font-light text-xl bg-cyan-900 w-full rounded shadow p-2 px-3" onClick={() => {setOpenFolder(category)}}>
                                        <h2 className="font-bold">{category.name}</h2>    
                                        <h3 className="font-thin text-sm opacity-50">{flashcards?.filter((card) => card.subfolderId == category._id).length} cards</h3>
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