'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Collapsible } from "../components/Collapsible"
import { useSession } from 'next-auth/react'
import { v4 } from 'uuid'

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
    const [loading, setLoading] = useState(false)

    const [categoryToAdd, setCategoryToAdd] = useState('')
    const [openCategory, setOpenCategory] = useState<Collection | undefined>(undefined)

    const [addingFolder, setAddingFolder] = useState(false)
    const [folderToAdd, setFolderToAdd] = useState('')
    const [openFolder, setOpenFolder] = useState<Collection | undefined>(undefined)

    const [openCard, setOpenCard] = useState<Flashcard | undefined>(undefined)

    const [revealCard, setRevealCard] = useState(false)

    const [newCardFront, setNewCardFront] = useState('')
    const [newCardBack, setNewCardBack] = useState('')

    const [colors, setColors] = useState([
        'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
    ])

    useEffect(() => {

        if (status === "loading") return

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
    }

    function get_random_color() {
        let min = 0
        let max = colors.length
        const n = Math.floor(Math.random() * (max - min + 1)) + min
        return colors[n]
    }
    

    return (
        <div className="w-full h-full pt-[52px] flex flex-col z-10">

            {openFolder && !openCard ? (
                <>
                <div className="bg-[#0d0d0d] w-screen flex flex-col gap-6 pt-6 max-w-[500px] relative">
                    <div className="flex items-center px-3">
                        <Collapsible title={openFolder.name} open={false}>
                            <div className="flex items-center gap-3 pb-3 w-full">
                                {/* <div className="flex gap-2">

                                </div> */}
                                <input type="text" placeholder="Front..." value={newCardFront} onChange={(e) => {setNewCardFront(e.target.value)}} className="bg-transparent text-neutral-200 border-b border-neutral-200 py-1 text-md w-2/5" />
                                <input type="text" placeholder="Back..." value={newCardBack} onChange={(e) => {setNewCardBack(e.target.value)}} className="bg-transparent text-neutral-200 border-b border-neutral-200 py-1 text-md w-2/5" />
                                <button onClick={add_card} className="font-bold text-neutral-200 rounded bg-cyan-900 px-3 py-1 text-sm mt-auto w-1/5">Add</button>
                            </div>
                        </Collapsible>
                    </div>
                    <div className="flex absolute top-0 right-0 px-3 pt-9">
                        <p className="text-neutral-400 underline font-light text-xs" onClick={() => {setOpenFolder(undefined)}}>Back</p>
                    </div>
                </div>
                <div className="h-full backdrop-blur-sm flex flex-col items-center p-3 overflow-y-scroll gap-3">
                    {flashcards.map((card, index) => {
                        if (card.subfolderId === openFolder._id) {
                            let style = `text-neutral-300 font-light text-xl bg-${get_random_color()}-800 w-full rounded p-3 px-4`
                            return (
                                <div key={index} className={style} onClick={() => {setOpenCard(card)}}>
                                    <h2 className="font-bold">{card.front}</h2>    
                                </div>
                            )
                        }
                    })}
                </div>
                </>
            ) : openCard ? (
                <>
                <div className="bg-[#0d0d0d] w-screen flex flex-col gap-6 pt-6 max-w-[500px] relative">
                    <div className="flex items-center px-3">
                        <h1 className="text-white font-bold text-xl">{openCard.front}</h1>
                    </div>
                    <div className="flex absolute top-0 right-0 h-full px-3 pt-9">
                        <p className="text-neutral-400 underline font-light text-xs" onClick={() => {setOpenCard(undefined)}}>Back</p>
                    </div>
                </div>
                <div className="flex-1 p-3 pt-6 w-screen">
                    <div className="bg-neutral-900 w-full overflow-x-hidden h-full rounded-3xl relative">
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
                                    <button className="w-1/2 rounded-2xl border border-neutral-700 font-bold w-full py-1 text-neutral-500" onClick={() => {update_card(openCard, 'fail')}}>Fail</button>
                                    <button className="w-1/2 rounded-2xl bg-blue-900 font-bold w-full py-1 text-neutral-100" onClick={() => {update_card(openCard, 'pass')}}>Pass</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <>
                <div className="bg-[#0d0d0d] w-screen flex flex-col gap-6 pt-6 max-w-[500px]">
                    <div className="flex justify-between px-3">
                        <Collapsible title="Categories" open={false}>
                            <div className="flex items-center gap-3">
                                <input type="text" placeholder="New category..." value={categoryToAdd} onChange={(e) => {setCategoryToAdd(e.target.value)}} className="bg-transparent text-neutral-200 border-b border-neutral-200 py-1 text-md flex-1" />
                                <button onClick={add_category} className="font-bold text-neutral-200 rounded bg-cyan-900 px-3 py-1 text-sm">Submit</button>
                            </div>
                        </Collapsible>
                    </div>
                    <div>
                        <div className="flex gap-1 overflow-x-scroll w-full relative">
                            {categories.map((category, index) => {
                                if (category.type === 'category') {
                                    return (
                                        <button key={index} className={`text-neutral-300 font-light text-sm px-3 py-3 ${openCategory?.name === category.name ? "border-b-4 border-neutral-200" : "" }`} onClick={() => {setOpenCategory(category)}}>{category.name}</button>
                                    )
                                }
                            })}
                            <button className={`absolute bottom-1 right-3 text-3xl text-neutral-300 font-light ${addingFolder ? "transform rotate-45" : ""}`} onClick={() => {setAddingFolder(!addingFolder)}}>+</button>
                        </div>
                        {categories.length > 0 && addingFolder ? (
                            <div className="flex items-center gap-3 p-3 border-t border-neutral-300/15">
                                <input type="text" placeholder="New folder..." value={folderToAdd} onChange={(e) => {setFolderToAdd(e.target.value)}} className="bg-transparent text-neutral-200 py-1 text-md flex-1" />
                                <button onClick={add_folder} className="font-bold text-neutral-200 rounded bg-cyan-900 px-3 py-1 text-sm">Submit</button>
                            </div>
                        ) : <></>}
                    </div>
                </div>
                <div className="h-full backdrop-blur-sm flex flex-col items-center p-3 overflow-y-scroll gap-4">
                    {categories.map((category, index) => {
                        if (category.type === 'folder' && category.parentId === openCategory?._id) {
                            return (
                                <div key={index} className="text-neutral-300 font-light text-xl bg-cyan-900 w-full rounded bottom-hover-effect p-3 px-4" onClick={() => {setOpenFolder(category)}}>
                                    <h2 className="font-bold">{category.name}</h2>    
                                    <h3 className="font-thin text-sm opacity-50">{flashcards?.filter((card) => card.subfolderId == category._id).length} cards</h3>
                                </div>
                            )
                        }
                    })}
                </div>
                </>
            )}

            {/* {flashcards ? (
                <Collapsible title="All Cards" open={true} cards={flashcards}>
                    {flashcards.map((card) => {
                        let percent = 0
                        if (card.numberIncorrect != 0 && card.numberCorrect == 0) {
                            percent = 0
                        }
                        if (card.numberIncorrect == 0 && card.numberCorrect > 0) {
                            percent = 100
                        }
                        if (card.numberIncorrect != 0 && card.numberCorrect != 0) {
                            percent = (card.numberCorrect / (card.numberCorrect + card.numberIncorrect) * 100)
                        }

                        let splitCardOne
                        let splitCardTwo
                        if (card.front) {
                            let split = card.front.match(/([^\(\)]+)|(\([^)]*\))/g)
                            if (split) {
                                splitCardOne = split[0]
                                splitCardTwo = split[1]
                            } else {
                                splitCardOne = card.front
                                splitCardTwo = ''
                            }
                        }

                        return (
                            <Link key={card.id} href={`/flashcards/${encodeURIComponent(card.id)}`} className={percent < 80 && card.numberIncorrect > 0 ? "card-grid-item backdrop-blur-sm bg-zinc-800 p-1" : card.numberCorrect == 0 && card.numberIncorrect == 0 ? "card-grid-item bg-neutral-900 border border-neutral-800 p-[3px]" : "card-grid-item bg-sky-400/30 border border-sky-400/30 flex justify-center overflow-hidden backdrop-blur-sm p-1"}>
                                {percent >= 80 ? (
                                    <div className="shineBg z-0"></div>
                                ) : card.numberCorrect == 0 && card.numberIncorrect == 0 ? (
                                    <div className="newTag bg-red-600 text-neutral-200 font-bold rounded absolute right-[-5px] top-[-5px]">New!</div>
                                ) : (
                                    <></>
                                )}
                                <h3 id='card-grid-item-h3' className="relative text-neutral-200 font-light z-1">{splitCardOne}</h3>
                                {percent < 80 ? (
                                <div id='card-grid-percent-outer' className={percent < 80 && card.numberIncorrect > 0 ? "relative z-1 bg-zinc-700" : card.numberCorrect == 0 && card.numberIncorrect == 0 ? "relative z-1 bg-zinc-800" : "relative z-1 bg-sky-950"}>
                                    <div
                                        id='card-grid-percent-inner'
                                        style={{ width: `${percent}%`, height: `100%` }}
                                        className={percent < 80 ? "relative pulseBg rounded-lg z-1" : "relative bg-sky-400/85 rounded-lg z-1"}
                                    >
                                    </div>
                                </div>
                                ) : <></>}
                            </Link>
                        )
                    })}
                </Collapsible>
            ) : (
                <></>
            )}
            {flashcards && folders.map((folder) => {
                if (folder !== 'Miscellaneous') {
                    let cards = flashcards.filter((card) => card.folder !== 'Miscellaneous')
                    return (
                        <Collapsible key={folder} title={folder} open={false} cards={cards}>
                            {flashcards.map((card) => {
                                if (card.folder === folder && card.folder !== 'Miscellaneous') {
                                    let percent = 0
                                    if (card.numberIncorrect != 0 && card.numberCorrect == 0) {
                                        percent = 0
                                    }
                                    if (card.numberIncorrect == 0 && card.numberCorrect > 0) {
                                        percent = 100
                                    }
                                    if (card.numberIncorrect != 0 && card.numberCorrect != 0) {
                                        percent = (card.numberCorrect / (card.numberCorrect + card.numberIncorrect) * 100)
                                    }

                                    let splitCardOne
                                    let splitCardTwo
                                    if (card.front) {
                                        let split = card.front.match(/([^\(\)]+)|(\([^)]*\))/g)
                                        if (split) {
                                            splitCardOne = split[0]
                                            splitCardTwo = split[1]
                                        } else {
                                            splitCardOne = card.front
                                            splitCardTwo = ''
                                        }
                                    }

                                    return (
                                        <Link key={card.id} href={`/flashcards/${encodeURIComponent(card.id)}`} className={percent < 80 && card.numberIncorrect > 0 ? "card-grid-item backdrop-blur-sm bg-zinc-800 p-1" : card.numberCorrect == 0 && card.numberIncorrect == 0 ? "card-grid-item bg-neutral-900 border border-neutral-800 p-[3px]" : "card-grid-item bg-sky-400/30 border border-sky-400/30 flex justify-center overflow-hidden backdrop-blur-sm p-1"}>
                                            {percent >= 80 ? (
                                                <div className="shineBg z-0"></div>
                                            ) : card.numberCorrect == 0 && card.numberIncorrect == 0 ? (
                                                <div className="newTag bg-red-600 text-neutral-200 font-bold rounded absolute right-[-5px] top-[-5px]">New!</div>
                                            ) : (
                                                <></>
                                            )}
                                            <h3 id='card-grid-item-h3' className="relative text-neutral-200 font-light z-1">{splitCardOne}</h3>
                                            {percent < 80 ? (
                                            <div id='card-grid-percent-outer' className={percent < 80 && card.numberIncorrect > 0 ? "relative z-1 bg-zinc-700" : card.numberCorrect == 0 && card.numberIncorrect == 0 ? "relative z-1 bg-zinc-800" : "relative z-1 bg-sky-950"}>
                                                <div
                                                    id='card-grid-percent-inner'
                                                    style={{ width: `${percent}%`, height: `100%` }}
                                                    className={percent < 80 ? "relative pulseBg rounded-lg z-1" : "relative bg-sky-400/85 rounded-lg z-1"}
                                                >
                                                </div>
                                            </div>
                                            ) : <></>}
                                        </Link>
                                    )
                                }
                            })}
                        </Collapsible>
                    )
                }
            })}
            {flashcards && folders.map((folder) => {
                if (folder === 'Miscellaneous') {
                    let cards = flashcards.filter((card) => card.folder == 'Miscellaneous')
                    return (
                        <Collapsible key={folder} title={folder} open={false} cards={cards}>
                            {flashcards.map((card) => {
                                if (card.folder == 'Miscellaneous') {
                                    let percent = 0
                                    if (card.numberIncorrect != 0 && card.numberCorrect == 0) {
                                        percent = 0
                                    }
                                    if (card.numberIncorrect == 0 && card.numberCorrect > 0) {
                                        percent = 100
                                    }
                                    if (card.numberIncorrect != 0 && card.numberCorrect != 0) {
                                        percent = (card.numberCorrect / (card.numberCorrect + card.numberIncorrect) * 100)
                                    }

                                    let splitCardOne
                                    let splitCardTwo
                                    if (card.front) {
                                        let split = card.front.match(/([^\(\)]+)|(\([^)]*\))/g)
                                        if (split) {
                                            splitCardOne = split[0]
                                            splitCardTwo = split[1]
                                        } else {
                                            splitCardOne = card.front
                                            splitCardTwo = ''
                                        }
                                    }

                                    return (
                                        <Link key={card.id} href={`/flashcards/${encodeURIComponent(card.id)}`} className={percent < 80 && card.numberIncorrect > 0 ? "card-grid-item backdrop-blur-sm bg-zinc-800 p-1" : card.numberCorrect == 0 && card.numberIncorrect == 0 ? "card-grid-item bg-neutral-900 border border-neutral-800 p-[3px]" : "card-grid-item bg-sky-400/30 border border-sky-400/30 flex justify-center overflow-hidden backdrop-blur-sm p-1"}>
                                            {percent >= 80 ? (
                                                <div className="shineBg z-0"></div>
                                            ) : card.numberCorrect == 0 && card.numberIncorrect == 0 ? (
                                                <div className="newTag bg-red-600 text-neutral-200 font-bold rounded absolute right-[-5px] top-[-5px]">New!</div>
                                            ) : (
                                                <></>
                                            )}
                                            <h3 id='card-grid-item-h3' className="relative text-neutral-200 font-light z-1">{splitCardOne}</h3>
                                            {percent < 80 ? (
                                            <div id='card-grid-percent-outer' className={percent < 80 && card.numberIncorrect > 0 ? "relative z-1 bg-zinc-700" : card.numberCorrect == 0 && card.numberIncorrect == 0 ? "relative z-1 bg-zinc-800" : "relative z-1 bg-sky-950"}>
                                                <div
                                                    id='card-grid-percent-inner'
                                                    style={{ width: `${percent}%`, height: `100%` }}
                                                    className={percent < 80 ? "relative pulseBg rounded-lg z-1" : "relative bg-sky-400/85 rounded-lg z-1"}
                                                >
                                                </div>
                                            </div>
                                            ) : <></>}
                                        </Link>
                                    )
                                }
                            })}
                        </Collapsible>
                    )
                }
            })}
            <Link href={"/flashcards/create"} className="absolute bottom-6 right-6 text-center text-neutral-200 text-4xl border-none font-light z-60">
                +
            </Link> */}
        </div>
    )
}

export default Flashcards