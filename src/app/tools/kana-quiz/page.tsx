'use client'

import { useState } from "react"

type Kana = {
    kana: string
    romaji: string
}

const Page = () => {

    const [quiz, setQuiz] = useState<string | undefined>(undefined)

    const [totalCount, setTotalCount] = useState<number>(0)
    const [chosen, setChosen] = useState<string | undefined>(undefined)

    const [katakana, setKatakana] = useState<Kana[]>([
        // Vowels
        { kana: "ア", romaji: "a" },
        { kana: "イ", romaji: "i" },
        { kana: "ウ", romaji: "u" },
        { kana: "エ", romaji: "e" },
        { kana: "オ", romaji: "o" },

        // K
        { kana: "カ", romaji: "ka" },
        { kana: "キ", romaji: "ki" },
        { kana: "ク", romaji: "ku" },
        { kana: "ケ", romaji: "ke" },
        { kana: "コ", romaji: "ko" },

        // S
        { kana: "サ", romaji: "sa" },
        { kana: "シ", romaji: "shi" },
        { kana: "ス", romaji: "su" },
        { kana: "セ", romaji: "se" },
        { kana: "ソ", romaji: "so" },

        // T
        { kana: "タ", romaji: "ta" },
        { kana: "チ", romaji: "chi" },
        { kana: "ツ", romaji: "tsu" },
        { kana: "テ", romaji: "te" },
        { kana: "ト", romaji: "to" },

        // N
        { kana: "ナ", romaji: "na" },
        { kana: "ニ", romaji: "ni" },
        { kana: "ヌ", romaji: "nu" },
        { kana: "ネ", romaji: "ne" },
        { kana: "ノ", romaji: "no" },

        // H
        { kana: "ハ", romaji: "ha" },
        { kana: "ヒ", romaji: "hi" },
        { kana: "フ", romaji: "fu" },
        { kana: "ヘ", romaji: "he" },
        { kana: "ホ", romaji: "ho" },

        // M
        { kana: "マ", romaji: "ma" },
        { kana: "ミ", romaji: "mi" },
        { kana: "ム", romaji: "mu" },
        { kana: "メ", romaji: "me" },
        { kana: "モ", romaji: "mo" },

        // Y
        { kana: "ヤ", romaji: "ya" },
        { kana: "ユ", romaji: "yu" },
        { kana: "ヨ", romaji: "yo" },

        // R
        { kana: "ラ", romaji: "ra" },
        { kana: "リ", romaji: "ri" },
        { kana: "ル", romaji: "ru" },
        { kana: "レ", romaji: "re" },
        { kana: "ロ", romaji: "ro" },

        // W
        { kana: "ワ", romaji: "wa" },
        { kana: "ヲ", romaji: "wo" },

        // N
        { kana: "ン", romaji: "n" },

        // G
        { kana: "ガ", romaji: "ga" },
        { kana: "ギ", romaji: "gi" },
        { kana: "グ", romaji: "gu" },
        { kana: "ゲ", romaji: "ge" },
        { kana: "ゴ", romaji: "go" },

        // Z
        { kana: "ザ", romaji: "za" },
        { kana: "ジ", romaji: "ji" },
        { kana: "ズ", romaji: "zu" },
        { kana: "ゼ", romaji: "ze" },
        { kana: "ゾ", romaji: "zo" },

        // D
        { kana: "ダ", romaji: "da" },
        { kana: "ヂ", romaji: "ji" },
        { kana: "ヅ", romaji: "zu" },
        { kana: "デ", romaji: "de" },
        { kana: "ド", romaji: "do" },

        // B
        { kana: "バ", romaji: "ba" },
        { kana: "ビ", romaji: "bi" },
        { kana: "ブ", romaji: "bu" },
        { kana: "ベ", romaji: "be" },
        { kana: "ボ", romaji: "bo" },

        // P
        { kana: "パ", romaji: "pa" },
        { kana: "ピ", romaji: "pi" },
        { kana: "プ", romaji: "pu" },
        { kana: "ペ", romaji: "pe" },
        { kana: "ポ", romaji: "po" }
    ])
    const [hiragana, setHiragana] = useState<Kana[]>([
        // Vowels
        { kana: "あ", romaji: "a" },
        { kana: "い", romaji: "i" },
        { kana: "う", romaji: "u" },
        { kana: "え", romaji: "e" },
        { kana: "お", romaji: "o" },

        // K
        { kana: "か", romaji: "ka" },
        { kana: "き", romaji: "ki" },
        { kana: "く", romaji: "ku" },
        { kana: "け", romaji: "ke" },
        { kana: "こ", romaji: "ko" },

        // S
        { kana: "さ", romaji: "sa" },
        { kana: "し", romaji: "shi" },
        { kana: "す", romaji: "su" },
        { kana: "せ", romaji: "se" },
        { kana: "そ", romaji: "so" },

        // T
        { kana: "た", romaji: "ta" },
        { kana: "ち", romaji: "chi" },
        { kana: "つ", romaji: "tsu" },
        { kana: "て", romaji: "te" },
        { kana: "と", romaji: "to" },

        // N
        { kana: "な", romaji: "na" },
        { kana: "に", romaji: "ni" },
        { kana: "ぬ", romaji: "nu" },
        { kana: "ね", romaji: "ne" },
        { kana: "の", romaji: "no" },

        // H
        { kana: "は", romaji: "ha" },
        { kana: "ひ", romaji: "hi" },
        { kana: "ふ", romaji: "fu" },
        { kana: "へ", romaji: "he" },
        { kana: "ほ", romaji: "ho" },

        // M
        { kana: "ま", romaji: "ma" },
        { kana: "み", romaji: "mi" },
        { kana: "む", romaji: "mu" },
        { kana: "め", romaji: "me" },
        { kana: "も", romaji: "mo" },

        // Y
        { kana: "や", romaji: "ya" },
        { kana: "ゆ", romaji: "yu" },
        { kana: "よ", romaji: "yo" },

        // R
        { kana: "ら", romaji: "ra" },
        { kana: "り", romaji: "ri" },
        { kana: "る", romaji: "ru" },
        { kana: "れ", romaji: "re" },
        { kana: "ろ", romaji: "ro" },

        // W
        { kana: "わ", romaji: "wa" },
        { kana: "を", romaji: "wo" },

        // N
        { kana: "ん", romaji: "n" },

        // Dakuten (G)
        { kana: "が", romaji: "ga" },
        { kana: "ぎ", romaji: "gi" },
        { kana: "ぐ", romaji: "gu" },
        { kana: "げ", romaji: "ge" },
        { kana: "ご", romaji: "go" },

        // Z
        { kana: "ざ", romaji: "za" },
        { kana: "じ", romaji: "ji" },
        { kana: "ず", romaji: "zu" },
        { kana: "ぜ", romaji: "ze" },
        { kana: "ぞ", romaji: "zo" },

        // D
        { kana: "だ", romaji: "da" },
        { kana: "ぢ", romaji: "ji" },
        { kana: "づ", romaji: "zu" },
        { kana: "で", romaji: "de" },
        { kana: "ど", romaji: "do" },

        // B
        { kana: "ば", romaji: "ba" },
        { kana: "び", romaji: "bi" },
        { kana: "ぶ", romaji: "bu" },
        { kana: "べ", romaji: "be" },
        { kana: "ぼ", romaji: "bo" },

        // P
        { kana: "ぱ", romaji: "pa" },
        { kana: "ぴ", romaji: "pi" },
        { kana: "ぷ", romaji: "pu" },
        { kana: "ぺ", romaji: "pe" },
        { kana: "ぽ", romaji: "po" }
    ])

    const [workingDeck, setWorkingDeck] = useState<{
        deck: Kana[]
        current: Kana
        correct_index: number
        answers: string[]
    } | null>(null)

    const progress = workingDeck ? (totalCount - workingDeck.deck.length) / totalCount : 0;

    function random_int(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(deck: Kana[], full_deck: Kana[]) {
        const copy = [...deck];

        // Shuffle deck
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]]
        }

        const current = copy[0]
        const correct_index = random_int(0, 3)

        const answers: string[] = []

        const wrongPool = full_deck.filter(k => k.kana !== current.kana)

        for (let i = 0; i < 4; i++) {
            if (i === correct_index) {
                answers.push(current.romaji)
            } else {
                let choice: Kana

                do {
                    choice = wrongPool[random_int(0, wrongPool.length - 1)]
                } while (answers.includes(choice.romaji))

                answers.push(choice.romaji)
            }
        }

        return {
            deck: copy,
            current,
            correct_index,
            answers
        }
    }

    function check_answer(ans: string) {
        if (!workingDeck) return

        const is_correct = ans === workingDeck.current.romaji

        const current = workingDeck.current
        let new_deck = workingDeck.deck.slice(1)

        if (!is_correct) {
            const insert_index = Math.floor(Math.random() * (new_deck.length + 1))
            new_deck.splice(insert_index, 0, current)
        }

        setChosen(undefined)
        if (new_deck.length === 0) {
            setWorkingDeck(null)
            return
        }

        if (quiz === 'Katakana') {
            setWorkingDeck(shuffle(new_deck, katakana))
        } else if (quiz === 'Hiragana') {
            setWorkingDeck(shuffle(new_deck, hiragana))
        }
    }

    function start_quiz(deck: Kana[], type: string) {
        let shuffled

        if (type === 'Katakana') {
            shuffled = shuffle(deck, katakana)
            setWorkingDeck(shuffled)
        } else if (type === 'Hiragana') {
            shuffled = shuffle(deck, hiragana)
            setWorkingDeck(shuffled)
        }

        setTotalCount(deck.length)
        setQuiz(type)
    }

    function reset() {
        setWorkingDeck(null)
        setQuiz(undefined)
        setChosen(undefined)
    }

    return (
        <div className='flex flex-col items-center sm:w-full sm:pt-14 bg-m flex-1 sm:border-b border-light'>
            {!workingDeck ? (
                <div className="w-full p-3 flex flex-col gap-3 items-center">
                    <button className="text-white text-xl font-bold p-3 rounded-lg bg-bl w-full" onClick={() => {start_quiz(hiragana, 'Hiragana')}}>Hiragana Quiz</button>
                    <button className="text-white text-xl font-bold p-3 rounded-lg bg-bl w-full" onClick={() => {start_quiz(katakana, 'Katakana')}}>Katakana Quiz</button>
                </div>   
            ) : (
                <>
                <div className="w-full bg-d flex items-center justify-between border-b border-light">
                    <h1 className="text-white font-bold text-2xl p-3">{quiz}</h1>
                    <button className="text-neutral-500 underline p-3 text-xs font-light" onClick={() => {reset()}}>Back</button>
                </div>
                <div className="w-full p-9 flex flex-col gap-3 sm:justify-start flex-1">
                    <div className="w-full max-w-[300px] rounded-xl bg-bl flex flex-col items-center p-3 gap-3 relative">
                        <div className="w-full h-6 rounded-full bg-neutral-200 relative overflow-hidden">
                            <div className="absolute top-1 left-1 rounded-full h-4 bg-emerald-500 transition-all duration-300" style={{ width: `calc(1rem + ${progress * (100 - (1 / 16 * 100))}%)` }}>

                            </div>
                        </div>
                        <div className="bg-neutral-200 rounded-lg flex items-center justify-center w-full aspect-square">
                            <h1 className="text-8xl text-black font-bold">{workingDeck.current.kana}</h1>
                        </div>
                        <div className="flex items-center justify-between w-full gap-3">
                            {workingDeck.answers.map((a, i) => {
                                return (
                                    chosen ? (
                                        <button key={i} className={`text-black font-bold p-3 rounded-lg border-2 border-neutral-200 flex-1 ${a === workingDeck.current.romaji ? `bg-emerald-600 text-white` : chosen === a && workingDeck.current.romaji !== a ? `bg-red-600 text-white` : `bg-neutral-200`}`}>{a}</button>
                                    ) : (
                                        <button key={i} onClick={() => {setChosen(a)}} className="text-black font-bold p-3 rounded-lg bg-neutral-200 border-2 border-neutral-200 flex-1">{a}</button>
                                    )
                                )
                            })}
                        </div>
                        {chosen ? (
                            <button className="absolute bottom-[-42px] right-0 bg-bl text-white font-bold p-3 rounded-b-xl pt-4" onClick={() => check_answer(chosen)}>Next</button>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                </>
            )}
        </div>
    )
}

export default Page