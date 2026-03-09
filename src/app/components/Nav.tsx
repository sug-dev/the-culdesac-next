'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

import DownArrow from '/public/down-arrow-svgrepo-com.png'


const chatIcon = "M8 10.5H16M8 14.5H11M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z"
const blogIcon = "M7.2 21C6.07989 21 5.51984 21 5.09202 20.782C4.71569 20.5903 4.40973 20.2843 4.21799 19.908C4 19.4802 4 18.9201 4 17.8V6.2C4 5.07989 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V7M8 7H14M8 15H9M8 11H12M11.1954 20.8945L12.5102 20.6347C13.2197 20.4945 13.5744 20.4244 13.9052 20.2952C14.1988 20.1806 14.4778 20.0317 14.7365 19.8516C15.0279 19.6486 15.2836 19.393 15.7949 18.8816L20.9434 13.7332C21.6306 13.0459 21.6306 11.9316 20.9434 11.2444C20.2561 10.5571 19.1418 10.5571 18.4546 11.2444L13.2182 16.4808C12.739 16.96 12.4994 17.1996 12.3059 17.4712C12.1341 17.7123 11.9896 17.9717 11.8751 18.2447C11.7461 18.5522 11.6686 18.882 11.5135 19.5417L11.1954 20.8945Z"
const articlesIcon = "M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20"
const gamesIcon = "M8 8H8.01M16 8H16.01M12 12H12.01M16 16H16.01M8 16H8.01M7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V7.2C20 6.0799 20 5.51984 19.782 5.09202C19.5903 4.71569 19.2843 4.40973 18.908 4.21799C18.4802 4 17.9201 4 16.8 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.07989 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20Z"

const cardIcon = "M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z"


const selectedDivStyle = 'bg-white p-2 flex items-center rounded-lg border border-transparent cursor-pointer hover:border-white dark:hover:border-neutral-800'
const unSelectedDivStyle = 'p-2 flex items-center rounded-lg border border-transparent cursor-pointer hover:border-white dark:hover:border-neutral-800'

const selectedH1Style = 'font-light text-blue-500'
const unSelectedH1Style = 'font-light text-white dark:text-neutral-400'

const toggledNavStyle = 'h-screen w-72 bg-blue-500 dark:bg-[#0d0d0d] flex flex-col p-3 pt-2 gap-6 sm:w-screen sm:h-full sm:z-40 sm:overflow-y-hidden sm:absolute'
const hiddenNavStyle = 'h-screen w-72 bg-blue-500 dark:bg-[#0d0d0d] flex flex-col p-3 pt-2 gap-6 sm:w-screen sm:h-auto sm:z-40 sm:overflow-y-hidden sm:absolute sm:pb-0'

const navLinksShownStyle = 'flex flex-col gap-6'
const navLinksHiddenStyle = 'flex flex-col gap-6 sm:hidden'

export default function Nav() {

    type NavLink = {
        selected: boolean;
        text: string;
        icon: string;
    }

    type NavLinks = {
        [key: string]: NavLink;
    }

    const { data: session, status } = useSession()

    const pathname = usePathname()
    
    const [navLinks, setNavLinks] = useState<NavLinks>({
        '/chat': {selected: false, text: "Chat", icon: chatIcon},
        '/blog': {selected: false, text: "Blog", icon: blogIcon},
        '/flashcards': {selected: false, text: "Flashcards", icon: cardIcon},
        // '/articles': {selected: false, text: "Articles", icon: articlesIcon},
        // '/games': {selected: false, text: "Games", icon: gamesIcon}
    })
    const [navToggled, setNavToggled] = useState(false)
    const [loginUrl, setLoginUrl] = useState(`/login?ref=${pathname}`)
    const [num, setNum] = useState(1)

    const navToggle = () => {
        setNavToggled(!navToggled)
    }
    
    useEffect(() => {
        setLoginUrl(`/login?ref=${pathname}`)
    }, [pathname])

    const handleClick = (key: string) => {
        if (key.includes('/') && key !== '/') {
            key = key.slice(1)
        }
        setNavLinks(prev => {
            const updated: NavLinks = {}
            for (let i in prev) {
                updated[i] = {
                    ...prev[i],
                    selected: i === key,
                }
            }
            return updated
        })
    }

    useEffect(() => {   
        // console.log(pathname.split('/')[1])
    }, [])

    const Header = () => {
        if (pathname.split('/')[1] === 'flashcards') {
            return (
                <>
                    <h1 className='text-white dark:text-neutral-200 font-black text-3xl text-center flex gap-2 items-center'><div className='w-[10px] h-[10px] rounded-full bg-white'></div>FLASHCARDS</h1>
                </>
            )
        } else if (pathname.split('/')[1] === 'chat') {
            return (
                <>
                    <h1 className='text-white dark:text-neutral-200 font-black text-3xl text-center flex gap-2 items-center'><div className='w-[10px] h-[10px] rounded-full bg-white'></div>CHAT</h1>
                </>
            )
        } else if (pathname.split('/')[1] === 'blog') {
            return (
                <>
                    <h1 className='text-white dark:text-neutral-200 font-black text-3xl text-center flex gap-2 items-center'><div className='w-[10px] h-[10px] rounded-full bg-white'></div>BLOG</h1>
                </>
            )
        } else {
            return (
                <>
                    {/* <h1 className='text-lg font-light text-white dark:text-neutral-200'>the</h1> */}
                    <h1 className='text-white dark:text-neutral-200 font-black text-3xl text-center flex gap-1 items-center'><span className='text-lg font-light text-white dark:text-neutral-200 mr-1 mt-auto'>the</span>CUL<div className='w-[10px] h-[10px] rounded-full bg-white'></div>DE<div className='w-[10px] h-[10px] rounded-full bg-white'></div>SAC</h1>
                </>
            )
        } 
        
    }

    return (
        <nav className={navToggled ? toggledNavStyle : hiddenNavStyle}>
            <div className={navToggled ? 'border-b pb-2 w-full flex items-center justify-center sm:justify-between sm:border-b-1 dark:border-b-neutral-800' : 'border-b pb-2 w-full flex items-center justify-center sm:justify-between sm:border-b-0 dark:border-b-neutral-800'}>
                <Link href="/" onClick={() => handleClick('/')} className='flex flex-col sm:flex-row sm:gap-2 sm:items-end'>
                    <Header />
                </Link>
                <div className='hidden sm:flex h-6 w-7 cursor-pointer flex flex-col justify-between' onClick={navToggle}>
                    <div className={navToggled ? 'bg-white h-[3px] rounded-lg w-full rotate-45 translate-y-[9px] transition-all duration-300' : 'bg-white h-[3px] rounded-lg w-full rotate-0 transition-all duration-300'}></div>
                    <div className={navToggled ? 'bg-white h-[3px] rounded-lg w-full opacity-0 transition-all duration-300' : 'bg-white h-[3px] rounded-lg w-full opacity-100 transition-all duration-300'}></div>
                    <div className={navToggled ? 'bg-white h-[3px] rounded-lg w-full -rotate-45 -translate-y-3 transition-all duration-300' : 'bg-white h-[3px] rounded-lg w-full rotate-0 transition-all duration-300'}></div>
                </div>
            </div>
            <div className={navToggled ? navLinksShownStyle : navLinksHiddenStyle}>

                {Object.keys(navLinks).map((key) => {
                    const link = navLinks[key]
                    return (
                        <Link key={key} className={link.selected ? selectedDivStyle : unSelectedDivStyle} href={key} onClick={() => {handleClick(key); navToggle()}}>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" className='mr-2'>
                                <path d={link.icon} stroke={link.selected ? "#3b82f6" : "#e5e5e5"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h1 className={link.selected ? selectedH1Style : unSelectedH1Style}>{link.text}</h1>
                        </Link>
                    )
                })}

                <div className={'p-2 flex items-center border border-transparent cursor-pointer hover:border-b-white dark:hover:border-b-neutral-800 gamesTab relative'}>
                    <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" className='mr-2'>
                                <path d={gamesIcon} stroke="#e5e5e5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h1 className={unSelectedH1Style}>Games</h1>
                        </div>
                        <Image src={DownArrow} width="30" height="10" alt="" className='w-5 h-5' />
                    </div>
                    <div className='gamesSubTab flex-col w-full items-end gap-6 sm:gap-4 p-2 pt-20 sm:pt-14'>
                        <Link href="/games/cookie-clicker" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Cookie Clicker</Link>
                        <Link href="/games/tic-tac-toe" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Tic-Tac-Toe</Link>
                        <Link href="/games/whiteboard" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Whiteboard</Link>
                        <Link href="/games/produce-hero" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Produce Hero</Link>
                        <Link href="/games/culdesac-defense" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>The Cul-De-Sac Defense</Link>
                        {/* <Link href="/games/luis-invaders" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Luis Invaders</Link> */}
                        {/* <Link href="/games/battle-monsters" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Battle Monsters</Link> */}
                    </div>
                </div>
                    
            </div>


            <div className={navToggled ? 'w-full flex-1 flex items-end' : 'w-full flex-1 flex items-end sm:hidden'}>
                {status == 'authenticated' ? (
                    <button className='text-white dark:text-neutral-400 font-bold text-sm rounded-lg border-white dark:border-neutral-800 border py-2 w-full hover:text-blue-500 hover:bg-white dark:hover:bg-neutral-800' onClick={() => {signOut({ callbackUrl: '/', redirect:true }); navToggle()}}>Logout</button>
                ) : (
                    status == 'loading' ? (
                        null
                    ) : (
                        <Link className='text-center text-white font-bold text-sm rounded-lg border-white dark:border-neutral-800 border py-2 w-full hover:text-blue-500 hover:bg-white dark:hover:bg-neutral-800' href={loginUrl} onClick={navToggle}>Login</Link>
                    )
                )}
            </div>
        </nav>
    )
}