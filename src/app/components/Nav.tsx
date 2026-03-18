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
const toolsIcon1 = "M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
const toolsIcon2 = "M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z"

const profileIcon1 = "M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
const profileIcon2 = "M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"

const cardIcon = "M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z"


const selectedDivStyle = 'bg-white py-2 flex items-center cursor-pointer'
const unSelectedDivStyle = 'py-2 flex items-center cursor-pointer'

const selectedH1Style = 'font-light text-blue-500'
const unSelectedH1Style = 'font-light text-white dark:text-neutral-400'

const toggledNavStyle = 'h-screen w-72 bg-blue-500 dark:bg-neutral-950 flex flex-col p-3 gap-6 sm:w-screen sm:h-full sm:z-40 sm:overflow-y-hidden sm:absolute'
const hiddenNavStyle = 'h-screen w-72 bg-blue-500 dark:bg-neutral-950 flex flex-col p-3 gap-6 sm:w-screen sm:h-auto sm:z-40 sm:overflow-y-hidden sm:absolute sm:pb-0'

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

    const [gamesToggled, setGamesToggled] = useState(false)
    const [toolsToggled, setToolsToggled] = useState(false)

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
                    <h1 className='text-white dark:text-white font-black text-3xl flex gap-2 items-center'><div className='w-[10px] h-[10px] rounded-full bg-white'></div>FLASHCARDS</h1>
                </>
            )
        } else if (pathname.split('/')[1] === 'chat') {
            return (
                <>
                    <h1 className='text-white dark:text-white font-black text-3xl flex gap-2 items-center'><div className='w-[10px] h-[10px] rounded-full bg-white'></div>CHAT</h1>
                </>
            )
        } else if (pathname.split('/')[1] === 'blog') {
            return (
                <>
                    <h1 className='text-white dark:text-white font-black text-3xl flex gap-2 items-center'><div className='w-[10px] h-[10px] rounded-full bg-white'></div>BLOG</h1>
                </>
            )
        } else {
            return (
                <>
                    {/* <h1 className='text-lg font-light text-white dark:text-white'>the</h1> */}
                    <h1 className='text-white dark:text-white font-black text-3xl flex gap-1 items-center'><span className='text-lg font-light text-white dark:text-white mr-1 mt-auto'>the</span>CUL<div className='w-[10px] h-[10px] rounded-full bg-white'></div>DE<div className='w-[10px] h-[10px] rounded-full bg-white'></div>SAC</h1>
                </>
            )
        } 
        
    }

    return (
        <nav className={navToggled ? toggledNavStyle : hiddenNavStyle}>
            <div className={navToggled ? 'pb-2 w-full flex items-center sm:justify-between sm:border-b-1 dark:border-b-neutral-800' : 'pb-2 w-full flex items-center sm:justify-between sm:border-b-0 dark:border-b-neutral-800'}>
                <Link href="/" onClick={() => handleClick('/')} className='flex flex-col sm:flex-row sm:gap-2 sm:items-end px-1'>
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
                                <path d={link.icon} stroke={link.selected ? "#3b82f6" : "white"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h1 className={link.selected ? selectedH1Style : unSelectedH1Style}>{link.text}</h1>
                        </Link>
                    )
                })}

                <div className={'flex flex-col items-center cursor-pointer relative hidden'}>
                    <div className='flex w-full items-center justify-between' onClick={() => {setGamesToggled(!gamesToggled)}}>
                        <div className='flex items-center'>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" className='mr-2'>
                                <path d={gamesIcon} stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h1 className={unSelectedH1Style}>Games</h1>
                        </div>
                        <Image src={DownArrow} width="30" height="10" alt="" className={`w-5 h-5 duration-300 ${gamesToggled ? `rotate-0` : `rotate-180`}`} />
                    </div>
                    {gamesToggled ? (
                        <div className='flex flex-col w-full items-end gap-6 sm:gap-4 p-2 pt-10 sm:pt-6'>
                            <Link href="/games/cookie-clicker" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Cookie Clicker</Link>
                            <Link href="/games/tic-tac-toe" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Tic-Tac-Toe</Link>
                            <Link href="/games/whiteboard" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Whiteboard</Link>
                            <Link href="/games/produce-hero" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Produce Hero</Link>
                            <Link href="/games/culdesac-defense" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>The Cul-De-Sac Defense</Link>
                            {/* <Link href="/games/luis-invaders" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Luis Invaders</Link> */}
                            {/* <Link href="/games/battle-monsters" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Battle Monsters</Link> */}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

                <div className={'flex flex-col items-center cursor-pointer relative'}>
                    <div className='flex w-full items-center justify-between' onClick={() => {setToolsToggled(!toolsToggled)}}>
                        <div className='flex items-center'>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" className='mr-2'>
                                <path d={toolsIcon1} stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d={toolsIcon2} stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h1 className={unSelectedH1Style}>Tools</h1>
                        </div>
                        {/* <Image src={DownArrow} width="30" height="10" alt="" className={`w-5 h-5 duration-200 ${toolsToggled ? `rotate-0` : `rotate-180`}`} /> */}
                    </div>
                    {toolsToggled ? (
                        <div className='flex flex-col w-full items-end gap-6 sm:gap-4 p-2 pt-10 sm:pt-6'>
                            <Link href="/tools/pointillizer" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Image Pointillizer</Link>
                            <Link href="/tools/kana-quiz" className='text-white dark:text-neutral-400 font-light hover:border-b-white dark:hover:border-b-neutral-800' onClick={navToggle}>Kana Quiz</Link>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                    
            </div>


            <div className={navToggled ? 'w-full flex-1 flex items-end' : 'w-full flex-1 flex items-end sm:hidden'}>
                {status == 'authenticated' ? (
                    <div className='flex items-center cursor-pointer' onClick={() => {signOut({ callbackUrl: '/', redirect:true }); navToggle()}}>
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" className='mr-2'>
                            <path d={profileIcon1} stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d={profileIcon2} stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h1 className='text-center text-white dark:text-neutral-400 font-bold text-sm'>Logout</h1>
                    </div>
                ) : (
                    status == 'loading' ? (
                        null
                    ) : (
                        <Link className='text-center text-white dark:text-neutral-400 font-bold text-sm cursor-pointer' href={loginUrl} onClick={navToggle}>
                            <div className='flex items-center'>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" className='mr-2'>
                                    <path d={profileIcon1} stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d={profileIcon2} stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h1 className='text-center text-white dark:text-neutral-400 font-bold text-sm'>Login</h1>
                            </div>
                        </Link>
                    )
                )}
            </div>
        </nav>
    )
}