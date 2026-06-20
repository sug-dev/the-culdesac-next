'use client'

import { useEffect, useState, useRef } from "react"

export default function Page() {

    const canvas_ref = useRef<HTMLCanvasElement | null>(null)
    const animation_ref = useRef<number | null>(null)
    const keys_ref = useRef<Record<string, boolean>>({})
    const resolution = 10
    const speed = 3
    const gravity = 0.5
    const grounded = useRef<boolean>(false)
    const spd = useRef<number>(1)

    const player_coords = useRef({ x: 200, y: 50})

    const map = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]

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

        const render = () => {
            const keys = keys_ref.current

            if (keys['ArrowRight']) player_coords.current.x += speed
            if (keys['ArrowLeft']) player_coords.current.x -= speed

            if (keys[' '] && grounded.current) {
                grounded.current = false
                spd.current = -7
            }

            if (!grounded.current && spd.current < 9) {
                spd.current = spd.current + gravity
            }

            console.log(grounded.current, spd.current)

            map.forEach((row, y_idx) => {
                row.forEach((tile, x_idx) => {
                    if (tile == 1) {
                        if ((player_coords.current.x > ((x_idx * resolution) - resolution)) &&
                            (player_coords.current.x < ((x_idx * resolution) + resolution)) && 
                            ((player_coords.current.y + spd.current) > (y_idx * resolution) - resolution) &&
                            ((player_coords.current.y + spd.current) < (y_idx * resolution))) {
                                grounded.current = true
                                spd.current = 1
                                player_coords.current.y = (y_idx * resolution) - resolution
                        } else {
                            grounded.current = false
                        }
                    }
                })
            })

            if (!grounded.current) {
                player_coords.current.y += spd.current
            }

            // clear map
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // drawing map
            for (let i = 0; i < map.length; i++) {
                map[i].map((tile, idx) => {
                    ctx.fillStyle = tile == 1 ? 'red' : 'blue'
                    ctx.fillRect(idx * resolution, i * resolution, resolution, resolution)
                })
            }

            // drawing player
            ctx.fillStyle = 'white'
            ctx.fillRect(player_coords.current.x, player_coords.current.y, resolution, resolution)

            animation_ref.current = requestAnimationFrame(render)
        }
        render()

        return () => {
            if (animation_ref.current !== null) {
                cancelAnimationFrame(animation_ref.current)
            }
        }
    }, [])
    
    return (
        <div>
            <canvas ref={canvas_ref} width={360} height={240}></canvas>
        </div>
    )
}