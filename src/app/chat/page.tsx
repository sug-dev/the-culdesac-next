'use client'

import React, {useEffect, useState, useRef} from 'react'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import io, { Socket } from 'socket.io-client'
import Image, { ImageLoaderProps } from 'next/image'

const uid = v4()
export default function Page() {

    const { data: session, status } = useSession()

    useEffect(() => {
        if (session && session.user) {
            const uname = session.user as { username: string }
            setUser(uname.username)
        } else {
            setUser(uid)
        }
    }, [session])

    const router = useRouter()

    type Message = {
        user: string,
        dateTime: string,
        messageText: string,
        gif: string,
        image: string
    }

    const [user, setUser] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [messageTextContent, setMessageTextContent] = useState('')
    const [readyToSend, setReadyToSend] = useState(false)
    const [message, setMessage] = useState<Message>({
        user: "",
        dateTime: "",
        messageText: "",
        gif: "",
        image: ""
    })

    const socket = useRef<Socket | null>(null)

    useEffect(() => {
        socket.current = io()

        socket.current.on('connect', () => {
            console.log('Client Connected to WebSocket')
        })

        socket.current.on('chat', (data: any) => {
            const newMessage = JSON.parse(data)
            console.log(newMessage.message)
            setMessages((prev) => [...prev, newMessage.message])
        })

        socket.current.on('new-user', (user: any) => {
            console.log(user)
        })

        return () => {
            if (socket.current) {
                socket.current.disconnect()
            }
        }
    }, [user])

    const bottomScroll = useRef<any>(null)

    function extractImageUrls(input: string): { cleanedString: string, imageUrls: string[] } {
        // Regular expression to match URLs that contain image file extensions
        const imageUrlRegex = /https?:\/\/[^\s]+?\.(png|jpg|jpeg|gif|bmp|webp)(\?[^\s]*)?/gi;
    
        // Array to store the found image URLs
        const imageUrls: string[] = []
    
        // Replace the found image URLs in the input string with an empty string and store them in the array
        const cleanedString = input.replace(imageUrlRegex, (match) => {
            imageUrls.push(match)
            return '' // Remove the URL from the string
        }).trim()
    
        return {
            cleanedString,
            imageUrls,
        }
    }

    useEffect(() => {
        const onSubmit = async () => {
            if (message.messageText.trim() !== '' || message.image || message.gif) {
                if (session && session.user) {
                    try {
                        const response = await fetch('/api/messages', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(message)
                        })
                        socket.current?.emit('chat', { type: 'chat', message: message })

                        setMessageTextContent('')
                        setMessage({
                            user: user,
                            dateTime: "",
                            messageText: "",
                            gif: "",
                            image: ""
                        })
                        // getMessages()
                    } catch (error: any) {
                        console.error("Error sending message from frontend: ", error.message)
                    }
                } else {
                    // const { cleanedString, imageUrls } = extractImageUrls(message.messageText)

                    // console.log(cleanedString, imageUrls)

                    // setMessage({
                    //     user: user,
                    //     dateTime: 
                    // })

                    socket.current?.emit('chat', { type: 'chat', message: message })
                    
                    setMessageTextContent('')
                    setMessage({
                        user: user,
                        dateTime: "",
                        messageText: "",
                        gif: "",
                        image: ""
                    })
                }
            }
        }
        if (readyToSend) {
            onSubmit()
            setReadyToSend(false)
        }
    }, [readyToSend, message, user, session])

    const getMessages = async () => {
        try {
            const response = await fetch('/api/messages', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const res = await response.json()
            setMessages(res)
            setLoading(false)
        } catch (error: any) {
            console.error("Error getting messages from frontend: ", error.message)
        }
    }

    const updateMessage = (k: string, v: string) => {
        setMessage(prev => ({
            ...prev,
            [k]: v
        }))
    }

    useEffect(() => {
        getMessages()
    }, [])

    useEffect(() => {
        scrolling()
        messages.forEach((message, index) => {
            console.log(messages[index].user)
        })
    }, [messages])

    const scrolling = () => {
        if (bottomScroll && bottomScroll.current) {
            bottomScroll.current.scrollTop = bottomScroll.current.scrollHeight - bottomScroll.current.clientHeight
        }
    }

    const handleChange = (e: any) => {
        setMessageTextContent(e.target.value)
    }

    const setMessageToSend = () => {
        if (session && session.user) {
            const { cleanedString, imageUrls } = extractImageUrls(messageTextContent)
            setMessage({
                user: user,
                dateTime: new Date().toUTCString(),
                messageText: cleanedString,
                gif: "",
                image: imageUrls[0]
            })
            setReadyToSend(true)
        } else {
            const { cleanedString, imageUrls } = extractImageUrls(messageTextContent)
            setMessage({
                user: uid,
                dateTime: new Date().toUTCString(),
                messageText: cleanedString,
                gif: "",
                image: imageUrls[0]
            })
            setReadyToSend(true)
        }
    }

    const imageLoader = ({ src }: ImageLoaderProps): string => {
        return src
    }

    return (
        <div className='w-full sm:h-dvh relative flex flex-col'>
            <div className='w-full h-[52px] bg-white dark:bg-neutral-900 border-b dark:border-b-transparent flex items-center justify-between px-6 sm:hidden'>
                <h1 className='font-bold text-xl dark:text-neutral-200'>Cul-De-Sac Chat</h1>
            </div>

            {loading ? (
                <div className='h-full w-full flex flex-col gap-8 items-center justify-center'>
                    <div className="lds-ripple"><div className='border-[4px] border-gray-400'></div><div className='border-[4px] border-gray-400'></div></div>
                    <h1 className='text-gray-400'>Loading...</h1>
                </div>
            ) : (
                <>
                    <div ref={bottomScroll} className='w-full flex-1 overflow-y-scroll overflow-x-hidden sm:pt-8 relative'>
                        {messages ? (
                            <div className='px-3 py-3'>
                                {messages.map((message: Message, index) => {
                                    const isUserMessage = message.user === user;
                                    const isSameUserAsPrevious = index > 0 && messages[index - 1].user === message.user;

                                    const paddingTop = isUserMessage
                                        ? (isSameUserAsPrevious ? 'py-0.5' : 'pt-9')
                                        : (isSameUserAsPrevious ? 'pt-0.5' : 'pt-9');

                                    // Determine classes for the container based on message origin
                                    const containerClasses = `flex flex-col ${isUserMessage ? 'items-end' : 'items-start'} ${paddingTop}`;

                                    // Determine classes for the message container
                                    const messageContainerClasses = `relative flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`;

                                    return (
                                        <div key={index} className={containerClasses}>
                                            <div className={messageContainerClasses}>
                                                {/* Display user name if the message is not from the user and previous message is from a different user */}
                                                {!isUserMessage && !isSameUserAsPrevious && (
                                                    <h1 className='text-xs text-gray-400 font-light absolute w-screen top-[-17px]'>{message.user}</h1>
                                                )}
                                                {message.image && (
                                                    <Image loader={imageLoader} src={message.image} alt="" width={250} height={250} className='rounded-lg mb-1'/>
                                                )}
                                                {message.messageText && (
                                                    <p className={`inline-block p-1.5 px-3 rounded-lg ${isUserMessage ? 'bg-blue-500 dark:bg-blue-800 text-white dark:text-neutral-100' : 'bg-gray-200 dark:bg-neutral-900/50 backdrop-blur-sm text-black dark:text-neutral-300'} max-w-[800px] sm:max-w-64`}>
                                                        {message.messageText}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div id="latestMessage"></div>
                            </div>
                        ) : ( <div></div> )}
                    </div>

                    <div className='w-full h-32 bg-white dark:bg-[#0d0d0d] flex items-center justify-center p-3 gap-3 sm:h-16 relative'>
                        {!session ? (
                            <div className='absolute top-[-25px] left-0 w-full text-center'>
                                {/* <h1 className='text-gray-300 dark:text-neutral-600 font-light text-xs translate-y-[8px]'>If you are not logged in, your messages will not persist.</h1> */}
                            </div>
                        ) : null}
                        <textarea name="message" value={messageTextContent} onChange={handleChange} placeholder='Enter a message...' className='resize-none border dark:border-transparent dark:bg-neutral-900 dark:text-neutral-300 rounded-lg h-full flex-1 p-3 py-2 sm:px-3 sm:py-1.5' />
                        <div className='flex flex-col gap-3 h-full'>
                            <div className='flex gap-3 flex-1 sm:hidden'>
                                <button className='rounded-lg bg-gray-300 dark:bg-neutral-800 text-white w-1/2 cursor-not-allowed' onClick={scrolling}>G</button>
                                <button className='rounded-lg bg-gray-300 dark:bg-neutral-800 text-white w-1/2 cursor-not-allowed'>P</button>
                            </div>
                            <button className='bg-blue-500 dark:bg-blue-800 text-white font-bold rounded-lg h-3/5 p-3 px-5 hover:bg-blue-600 dark:hover:bg-blue-900 sm:h-full sm:px-3 sm:py-1' onClick={setMessageToSend}>Send</button>
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}
