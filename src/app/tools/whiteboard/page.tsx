'use client'

import React, { useEffect, useState, useRef, use } from 'react'
import io, { Socket } from 'socket.io-client'

let lastPos = { x: 0, y: 0 }  

export default function Page() {

    const [socketId, setSocketId] = useState(undefined)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const cursorWidth = useRef<HTMLDivElement | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isDraw, setIsDraw] = useState(true)
    const [isEraser, setIsEraser] = useState(false)
    const [isSelect, setIsSelect] = useState(false)
    const [color, setColor] = useState('#000000')
    const [tempColor, setTempColor] = useState('#000000')
    const [width, setWidth] = useState(5)
    const [cursor, setCursor] = useState({
        x: 0,
        y: 0
    })

    const socket = useRef<Socket | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const context = canvas.getContext('2d')
            if (context) {
                context.fillStyle = 'white'
                context.fillRect(0, 0, canvas.width, canvas.height)
                context.lineWidth = 5
                context.lineCap = 'round'
                context.lineJoin = 'round'
                context.strokeStyle = color
            }
        }

        socket.current = io()

        socket.current.on('connect', () => {
            console.log('Client Connected to WebSocket')
        })

        socket.current.on('new-user', (id: any, board: any) => {
            socket.current?.emit('getWhiteboard', (board: any) => {
                
            })
            // // console.log(socketId)
            // if (socketId) {
            //     console.log("New user")
            //     const canvas = canvasRef.current
            //     if (canvas) {
            //         const dataURL = canvas.toDataURL('image/png')
            //         socket.current?.emit('sendWholeCanvas', dataURL)
            //         console.log("ASS")
            //     }
            // }
            // if (socketId === undefined || socketId === null) {
            //     console.log("ASSSSS")
            //     setSocketId(id.id)
            // }
        })

        socket.current.on('getWhiteboard', (board: any) => {
            console.log("Getting board")
            const canvas = canvasRef.current
            if (canvas) {
                const context = canvas.getContext('2d')
                if (context) {
                    const img = new Image()
                    img.onload = () => {
                        context.drawImage(img, 0, 0)
                    }
                    img.src = board
                }
            }
        })

        // socket.current.on('sendWholeCanvas', (data: any) => {
        //     const canvas = canvasRef.current
        //     if (canvas) {
        //         const context = canvas.getContext('2d')
        //         if (context) {
        //             const img = new Image()
        //             img.onload = () => {
        //                 context.drawImage(img, 0, 0)
        //             }
        //             img.src = data
        //         }
        //     }
        // })

        socket.current.on('canvasData', (data: any) => {
            const canvas = canvasRef.current
            if (canvas) {
                const context = canvas.getContext('2d')
                if (data && context) {
                    context.strokeStyle = data.data.color
                    context.lineWidth = data.data.width
                    context.lineCap = 'round'

                    context.beginPath()
                    context.moveTo(data.data.start.x, data.data.start.y)
                    context.lineTo(data.data.end.offsetX, data.data.end.offsetY)
                    context.stroke()
                }
            }
        })
    
        return () => {
            socket.current?.disconnect()
        }

    }, [])

    useEffect(() => {
        const moveCursor = (e: any) => {
            if (cursorWidth) {
                setCursor({ x: ((e.clientX - 256)), y: (e.clientY) })
                // console.log(e)
            }
        }
        window.addEventListener('mousemove', (e: any) => {
            moveCursor(e)
        })
        window.addEventListener('touchmove', (e: any) => {
            moveCursor(e)
        })
    }, [])
    
    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if (canvas && context && (isDraw || isEraser)) {
            const { offsetX, offsetY } =
                'touches' in event
                ? getTouchPos(event)
                : event.nativeEvent
        
            setIsDrawing(true)
        }
    }
    
    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return
    
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')

        if (canvas && context) {
            const { offsetX, offsetY } =
                'touches' in event
                ? getTouchPos(event)
                : event.nativeEvent
        
            context.strokeStyle = color
            context.lineWidth = width
            context.lineCap = 'round'

            if (lastPos.x === 0 && lastPos.y === 0) {
                lastPos = { x: offsetX, y: offsetY }
            }

            context.beginPath()
            context.moveTo(lastPos.x, lastPos.y)
            context.lineTo(offsetX, offsetY)
            context.stroke()
            sendCanvasData(lastPos, {offsetX, offsetY}, color, width, socketId)

            lastPos = { x: offsetX, y: offsetY }
        }
    }
    
    const stopDrawing = () => {
        setIsDrawing(false)
        lastPos = { x: 0, y: 0 }
        const canvas = canvasRef.current
        if (canvas) {
            const dataURL = canvas.toDataURL('image/png')
            socket.current?.emit('sendWholeCanvas', dataURL)
        }
    }
    
    const getTouchPos = (event: React.TouchEvent) => {
        const canvas = canvasRef.current
        if (canvas) {
            const rect = canvas.getBoundingClientRect()
            const touch = event.touches[0]
            const offsetX = touch.clientX - rect.left
            const offsetY = touch.clientY - rect.top
            setCursor({ x: offsetX, y: offsetY })
            return { offsetX, offsetY }
        }
        return { offsetX: 0, offsetY: 0 }
    }

    const sendCanvasData = (start: any, end: any, color: any, width: any, socketId: any) => {
        const data = {start, end, color, width}
        const canvas = canvasRef.current
        if (canvas) {
            // const dataURL = canvas.toDataURL('image/png')
            // socket.current?.emit('canvasData', dataURL)
            socket.current?.emit('canvasData', {data, socketId})
            // socket.current?.emit('sendWholeCanvas', dataURL)
        }
        
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.target.value
        setColor(newColor)
    }

    const changeWidth = (e: any) => {
        setWidth(e.target.value)
    }

    const setEraser = () => {
        const c = color
        setTempColor(c)
        setColor('#ffffff')
    }

    const saveCanvasAsImage = () => {
        const canvas = canvasRef.current
        if (canvas) {
            const link = document.createElement('a')
            link.href = canvas.toDataURL('image/png')
            link.download = 'canvas-image.png'
            link.click()
        }
    }

    return (
        <div className='flex-1 chatBg h-full relative flex flex-col items-center justify-center overflow-hidden'>
            <div className='absolute top-3 sm:top-16 left-3 flex items-center gap-3 w-full'>
                <button className={isEraser || isSelect ? 'text-2xl opacity-25' : 'text-2xl opacity-100'} onClick={() => {setColor(tempColor); setIsEraser(false); setIsDraw(true); setIsSelect(false)}}>🖊️</button>
                <button className={isEraser ? 'text-2xl opacity-100' : 'text-2xl opacity-25'} onClick={() => {setEraser(); setIsSelect(false); setIsEraser(true)}}>🧼</button>
                <button className={isSelect ? 'bg-white text-2xl opacity-100 border border-2 border-dotted border-black w-[25px] h-[25px]' : 'bg-white text-2xl opacity-25 border border-2 border-dotted border-black w-[25px] h-[25px]'} onClick={() => {setIsSelect(true); setIsEraser(false); setIsDraw(false)}}></button>
                <input
                    className='ml-1'
                    type="color"
                    value={color}
                    onChange={handleChange}

                    style={{ width: '25px', height: '25px', border: 'none', padding: '0' }}
                />
                <input type="range" min={2} max={250} step={2} onChange={(e) => changeWidth(e)} />
                <button onClick={saveCanvasAsImage} className='text-2xl ml-1'>💾</button>
            </div>
            <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            width={1000}
            height={1000}
            style={{ backgroundColor: 'white', cursor: 'crosshair', border: 'none', margin: '6em 0 0 0', borderRadius: '10px' }}
            ></canvas>
            <div ref={cursorWidth} className='absolute rounded-full pointer-events-none' style={{ width: `${width}px`, height: `${width}px`, top: `${cursor.y - (width / 2)}px`, left: `${cursor.x - (width / 2)}px`, borderWidth: '1px', borderStyle: 'solid', borderColor: isDraw || isEraser ? '#ddd' : 'transparent' }}></div>
        </div>
    )
}