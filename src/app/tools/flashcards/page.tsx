'use client'

import { useEffect, useRef, useState } from "react"
import { Collapsible } from "../../components/Collapsible"
import { useSession } from 'next-auth/react'
import { v4 } from 'uuid'
import Loader from "../../components/Loader"

const star_path = "M11.2919 3.84263C11.5213 3.40737 11.636 3.18973 11.7892 3.11868C11.9226 3.05679 12.0765 3.05679 12.21 3.11868C12.3632 3.18973 12.4779 3.40737 12.7073 3.84263L14.1143 6.51208C14.2134 6.70001 14.2629 6.79397 14.3367 6.85654C14.4018 6.91178 14.48 6.94942 14.5637 6.96588C14.6586 6.98453 14.763 6.96467 14.9717 6.92494L17.936 6.36063C18.4193 6.26862 18.661 6.22262 18.8121 6.29809C18.9437 6.36382 19.0396 6.48415 19.0744 6.62705C19.1144 6.79113 19.0158 7.0165 18.8185 7.46725L17.6087 10.2317C17.5235 10.4263 17.481 10.5236 17.478 10.6203C17.4754 10.7056 17.4947 10.7902 17.5341 10.866C17.5787 10.9518 17.6593 11.021 17.8205 11.1594L20.1099 13.1252C20.4832 13.4457 20.6698 13.606 20.705 13.7711C20.7357 13.915 20.7014 14.065 20.6114 14.1813C20.508 14.3149 20.2703 14.3783 19.7949 14.5051L16.8793 15.2828C16.674 15.3376 16.5714 15.365 16.494 15.423C16.4257 15.4741 16.3716 15.542 16.3369 15.62C16.2976 15.7084 16.2937 15.8145 16.286 16.0268L16.1765 19.0424C16.1587 19.5341 16.1498 19.7799 16.0426 19.9104C15.9492 20.0241 15.8106 20.0909 15.6635 20.093C15.4946 20.0954 15.2969 19.9491 14.9013 19.6565L12.4754 17.8619C12.3046 17.7356 12.2192 17.6724 12.1256 17.648C12.043 17.6265 11.9562 17.6265 11.8736 17.648C11.78 17.6724 11.6946 17.7356 11.5238 17.8619L9.09789 19.6565C8.70233 19.9491 8.50456 20.0954 8.3357 20.093C8.18864 20.0909 8.04997 20.0241 7.95661 19.9104C7.84941 19.7799 7.84049 19.5341 7.82264 19.0424L7.71317 16.0268C7.70547 15.8145 7.70161 15.7084 7.66231 15.62C7.62762 15.542 7.57353 15.4741 7.50518 15.423C7.42777 15.365 7.32514 15.3376 7.11989 15.2828L4.20427 14.5051C3.72887 14.3783 3.49117 14.3149 3.38781 14.1813C3.29778 14.065 3.26354 13.915 3.29418 13.7711C3.32936 13.606 3.51601 13.4457 3.88931 13.1252L6.17874 11.1594C6.33991 11.021 6.42049 10.9518 6.46509 10.866C6.50445 10.7902 6.52376 10.7056 6.52116 10.6203C6.51823 10.5236 6.47565 10.4263 6.39048 10.2317L5.18069 7.46725C4.98343 7.0165 4.8848 6.79113 4.92477 6.62705C4.95957 6.48415 5.05553 6.36382 5.18711 6.29809C5.33817 6.22262 5.57985 6.26862 6.06319 6.36063L9.02753 6.92494C9.23621 6.96467 9.34055 6.98453 9.43545 6.96588C9.51924 6.94942 9.59741 6.91178 9.66252 6.85654C9.73627 6.79397 9.78579 6.70001 9.88484 6.51208L11.2919 3.84263Z"

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
                                <div className="bg-m w-full rounded shadow p-[2px] px-2 cursor-pointer col-span-2" onClick={() => {start_shuffle(flashcards.filter(c => c.subfolderId === openFolder._id))}}>
                                    <div className="text-emerald-200 font-light text-md bg-m rounded px-3 py-2">
                                        <h2 className="font-bold text-sm text-center">Shuffle Cards</h2>    
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

                                let style = `self-start ${percent >= 80 ? 'bg-emerald-800' : 'bg-l'} rounded py-[2px] px-2 relative shadow cursor-pointer overflow-hidden`

                                if (card.subfolderId === openFolder._id) {
                                    return (
                                        <div key={index} className={style} onClick={() => {setOpenCard(card)}}>
                                            <div className={`absolute top-0 left-0 h-full ${percent >= 80 ? `hidden` : ``}`} style={{ width: percent + '%', background: `linear-gradient(90deg, rgba(16, 78, 100, 1) 0%, rgba(16, 78, 100, 0) 100%)` }}></div>
                                            <div className="relative">
                                                {percent >= 80 ? (
                                                    <svg className="absolute right-0 top-1" width="32px" height="32px" viewBox="0 0 28 28" fill="oklch(83.7% 0.128 66.29)" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"></g><path d={star_path} stroke="oklch(83.7% 0.128 66.29)" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                ) : (
                                                    <></>
                                                )}
                                                <div className={`text-emerald-200 font-light text-lg flex flex-col gap-1 rounded py-1.5 px-3 ${percent >= 80 ? `bg-l` : `bg-m`}`}>
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
                            <div className="bg-m w-full rounded shadow p-[2px] px-2 cursor-pointer" onClick={() => {start_shuffle(flashcards)}}>
                                <div className="text-emerald-200 font-light text-md bg-m rounded px-3 py-2">
                                    <h2 className="font-bold text-sm text-center">Shuffle All Cards</h2>    
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