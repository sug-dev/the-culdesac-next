'use client'

import { useRef, useState, useEffect } from "react"

const Page = () => {

    const canvas_ref = useRef<HTMLCanvasElement | null>(null)
    const animation_ref = useRef<number | null>(null)
    const keys_ref = useRef<Record<string, boolean>>({})
    const x_ref = useRef<number>(50)
    const y_ref = useRef<number>(215)

    useEffect(() => {
        const handle_key_down = (e: KeyboardEvent) => {
            keys_ref.current[e.key] = true
        }
        const handle_key_up = (e: KeyboardEvent) => {
            keys_ref.current[e.key] = false
        }

        window.addEventListener('keydown', handle_key_down)
        window.addEventListener('keyup', handle_key_up)

        return () => {
            window.removeEventListener('keydown', handle_key_down)
            window.removeEventListener('keyup', handle_key_up)
        }
    }, [])

    useEffect(() => {
        const canvas = canvas_ref.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const speed = 3

        const render = () => {
            const keys = keys_ref.current

            if (keys['ArrowRight']) x_ref.current += speed
            if (keys['ArrowLeft']) x_ref.current -= speed
            if (keys['ArrowUp']) y_ref.current -= speed
            if (keys['ArrowDown']) y_ref.current += speed

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'red'
            ctx.fillRect(x_ref.current, y_ref.current, 50, 50)

            animation_ref.current = requestAnimationFrame(render)
        }
        render()

        return () => {
            if (animation_ref.current !== null) {
                cancelAnimationFrame(animation_ref.current)
            }
        }
    }, [])

    function move_player(e: any) {
        console.log(e)
    }

    return (
        <div className='flex flex-col items-center sm:w-full sm:pt-14 bg-d flex-1'>
            <canvas ref={canvas_ref} width={720} height={480} className="border"></canvas>
        </div>
    )
}

export default Page