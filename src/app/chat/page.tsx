'use client'

import React, {useEffect, useState, useRef} from 'react'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import io, { Socket } from 'socket.io-client'
import Image, { ImageLoaderProps } from 'next/image'
import Loader from '../components/Loader'

const send = "M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"

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
        <div className='w-full sm:h-dvh flex-1 relative flex flex-col bg-d'>
            {loading ? (
                <Loader />
            ) : (
                <>
                <div className='w-full h-[52px] bg-white bg-d border-b border-light flex items-center justify-between px-3 sm:hidden'>
                    <h1 className='font-bold text-xl text-white'>Cul-De-Sac Chat</h1>
                </div>
                    <div ref={bottomScroll} className='w-full flex-1 overflow-y-scroll overflow-x-hidden sm:mt-14 relative bg-m border-b border-light'>
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
                                                    <h1 className='text-xs text-neutral-500 font-light absolute w-screen top-[-17px] left-3'>{message.user}</h1>
                                                )}
                                                {message.image && (
                                                    <Image loader={imageLoader} src={message.image} alt="" width={250} height={250} className='rounded-lg mb-1'/>
                                                )}
                                                {message.messageText && (
                                                    <p className={`inline-block p-1.5 px-3 rounded-lg ${isUserMessage ? 'bg-bl text-white' : 'bg-neutral-700/75 text-white'} max-w-[800px] sm:max-w-64`}>
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

                    <div className='w-full h-32 bg-d flex items-center justify-center p-3 gap-3 sm:h-16 relative'>
                        {!session ? (
                            <div className='absolute top-[-25px] left-0 w-full text-center'>
                                {/* <h1 className='text-gray-300 text-neutral-600 font-light text-xs translate-y-[8px]'>If you are not logged in, your messages will not persist.</h1> */}
                            </div>
                        ) : null}
                        <textarea name="message" value={messageTextContent} onChange={handleChange} placeholder='Enter a message...' className='resize-none border border-light bg-m text-white rounded-lg sm:rounded-full h-full flex-1 p-3 py-2 sm:px-3 sm:py-1.5' />
                        <div className='flex flex-col gap-3 h-full'>
                            {/* <div className='flex gap-3 flex-1 sm:hidden'>
                                <button className='rounded-lg bg-gray-300 bg-d text-white w-1/2 cursor-not-allowed' onClick={scrolling}>G</button>
                                <button className='rounded-lg bg-gray-300 bg-d text-white w-1/2 cursor-not-allowed'>P</button>
                            </div> */}
                            <button className='flex items-center justify-center bg-bl text-white font-bold rounded-full sm:h-full sm:aspect-square p-3 sm:p-0' onClick={setMessageToSend}><svg className='pt-0.5 pr-0.5' width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d={send} stroke="#fff" stroke-width="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg></button>
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}
