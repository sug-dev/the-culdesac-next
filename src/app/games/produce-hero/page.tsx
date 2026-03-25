'use client'

import { useEffect, useState, useRef } from 'react'

// const bloop = new Audio('/bloop.m4a')
// const grocery = new Audio('/grocery.mp3')
// const oof = new Audio('/oof.m4a')
// const instacart = new Audio('/instacart.mp3')

const produceImages = [
    '/images/broc.webp',
    '/images/peppers.webp',
    '/images/watermelon.webp'
]

const bugImages = [
    '/images/spider.webp',
    '/images/maggots.webp',
    '/images/aphid.webp'
]

const Page = () => {

    interface Projectile {
        x: number,
        y: number,
        width: number,
        height: number,
        type: string,
        image: string,
        collided: boolean
    }

    interface Player {
        hp: number,
        pos: {
            x: number,
            y: number
        }
    }

    const [invaderCells, setInvaderCells] = useState({x: 4, y: 3})
    const [projectiles, setProjectiles] = useState<Projectile[]>([])
    const [keyPressed, setKeyPressed] = useState<string | null>(null)
    const keyPressedRef = useRef<string | null>(keyPressed)
    const [player, setPlayer] = useState<Player>({ hp: 100, pos: { x: 0, y: 0 } })
    const [fireSpeed, setFireSpeed] = useState(500)
    const [moveSpeed, setMoveSpeed] = useState(8)
    const [mouseX, setMouseX] = useState(0)
    const mouseXRef = useRef<number | null>(mouseX)
    const [isDragging, setIsDragging] = useState(false)
    const [score, setScore] = useState(0)
    const [play, setPlay] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [offset, setOffset] = useState(0)
    const [projectileSize, setProjectileSize] = useState(250)
    const [colliderSize, setColliderSize] = useState({width: 100, height: 100})

    const main = useRef<HTMLDivElement | null>(null)
    const playerRef = useRef<HTMLDivElement | null>(null)
    const colliderRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (window.innerWidth <= 640) {
            setOffset(0)
            setMoveSpeed(4)
            setFireSpeed(1000)
            setProjectileSize(125)
            setColliderSize({width: 50, height: 75})
        } else {
            setOffset(250)
            setMoveSpeed(8)
            setFireSpeed(500)
            setProjectileSize(250)
            setColliderSize({width: 100, height: 150})
        }
    }, [])

    useEffect(() => {

        const mainRef = main.current

        // soundEffect('grocery')

        const grabMousePos = (e: MouseEvent) => {
            setMouseX(e.x - 50)
            mouseXRef.current = e.x - 50
        }
        const handleTouchStart = (e: TouchEvent) => {
            setIsDragging(true)
            setMouseX(e.touches[0].clientX - 50)
            mouseXRef.current = e.touches[0].clientX - 50
        }

        const handleTouchMove = (e: TouchEvent) => {
            setMouseX(e.touches[0].clientX - 50)
            mouseXRef.current = e.touches[0].clientX - 50
        }

        const handleTouchEnd = () => {
            setIsDragging(false)
        }

        if (mainRef && play) {
            mainRef.addEventListener('mousemove', grabMousePos)
            mainRef.addEventListener('touchstart', handleTouchStart)
            mainRef.addEventListener('touchmove', handleTouchMove)
            mainRef.addEventListener('touchend', handleTouchEnd)
        }

        return () => {
            // window.removeEventListener('keydown', handleKeyPress)
            if (mainRef) {
                mainRef.removeEventListener('mousemove', grabMousePos)
                mainRef.removeEventListener('touchstart', handleTouchStart)
                mainRef.removeEventListener('touchmove', handleTouchMove)
                mainRef.removeEventListener('touchend', handleTouchEnd)
            }
        }
    }, [play])

    useEffect(() => {
        if (player?.hp <= 10) {
            setPlay(false)
            setGameOver(true)
        }
    }, [player])

    useEffect(() => {
        if (gameOver) {
            setProjectiles([])
            // grocery.pause()
            // grocery.currentTime = 0
        }
    }, [gameOver])

    const getRandomX = () => {
        const n = window.innerWidth - 125
        const rand = Math.floor(Math.random() * (n - 0 + 1) + 0)

        return rand
    }

    const getRandomType = () => {
        const types = ['produce', 'bug']
        const rand = Math.round(Math.random())

        return types[rand]
    }

    const movePlayer = () => {
        if (play) {
            setPlayer((prev) => ({
                ...prev,
                pos: {
                    ...prev.pos,
                    x: mouseXRef.current ?? 0
                }
            }))
        }
    }

    // const soundEffect = (sound: string) => {
    //     switch (sound) {
    //         case 'bloop' :
    //             bloop.play()
    //             break

    //         case 'instacart' :
    //             instacart.play()
    //             break
                
    //         case 'grocery' :
    //             grocery.play()
    //             break

    //         case 'oof' :
    //             oof.play()
    //             break
            
    //     }
    // }
    
    const fireProjectile = (id: any) => {
        if (play) {
            const player = document.getElementById(id)
            if (player) {
                let newProjectile
                let type = getRandomType()
                if (type === 'bug') {
                    newProjectile = {
                        x: getRandomX(),
                        y: -250,
                        width: projectileSize,
                        height: projectileSize,
                        type: type,
                        image: getRandomBugImage(),
                        collided: false
                    }
                } else {
                    newProjectile = {
                        x: getRandomX(),
                        y: -250,
                        width: projectileSize,
                        height: projectileSize,
                        type: type,
                        image: getRandomProduceImage(),
                        collided: false
                    }
                }
                setProjectiles((prevProjectiles) => [...prevProjectiles, newProjectile])
            }
        }
    }

    const moveProjectiles = () => {
        if (play) {
            
            setProjectiles((prevProjectiles) => {

                const updatedProjectiles = prevProjectiles
                    .map((projectile) => ({
                        ...projectile,
                        y: projectile.y + moveSpeed
                    }))
                    .filter((projectile) => projectile.y <= window.innerHeight)
        
                if (updatedProjectiles.length > 0) {
                    checkAllCollisions(updatedProjectiles)
                }
        
                return updatedProjectiles
            })
        }
    }

    const getRandomProduceImage = () => {
        return produceImages[Math.floor(Math.random() * produceImages.length)]
    }

    const getRandomBugImage = () => {
        return bugImages[Math.floor(Math.random() * bugImages.length)]
    }

    const loseHealth = () => {
        setPlayer((prev) => ({
            ...prev,
            hp: prev.hp - 10
        }))
    }

    const addPoints = () => {
        setScore((prev) => prev + 100)
    }

    const checkCollision = (projectile: any, player: any) => {
        const isCollided =  (
            projectile.x < (player.x - offset) + player.width &&
            projectile.x + projectile.width > (player.x - offset) &&
            projectile.y < player.y + player.height &&
            projectile.y + projectile.height > player.y
        )

        return isCollided
    }

    const checkAllCollisions = (projectiles: Projectile[]) => {
        if (play) {
            const plyr = document.getElementById('player')?.getBoundingClientRect()
            const collider = colliderRef.current?.getBoundingClientRect()

            // const projs = projectiles.filter((projectile: Projectile) => !checkCollision(projectile, player))

            // setProjectiles(projs)
            let newScore = 0
            let hpDecrement = 0

            const projs = projectiles.filter((projectile: Projectile) => {
                const hasCollided = checkCollision(projectile, collider)
        
                if (hasCollided && !projectile.collided) {
                    if (projectile.type === 'produce') {
                        newScore += 100
                        return false
                    } else {
                        hpDecrement += 10
                        return false
                    }
        
                    projectile.collided = true
                }
        
                return true
            })
        
            // Apply the accumulated changes to state once, after all collisions
            if (newScore > 0) {
                // soundEffect('bloop')
                setScore((prevScore) => prevScore + newScore)
                playerRef.current?.classList.add('player-good')
                setTimeout(() => {
                    playerRef.current?.classList.remove('player-good')
                }, 500)
            }
        
            if (hpDecrement > 0) {
                // soundEffect('oof')
                setPlayer((prev) => ({
                    ...prev,
                    hp: Math.max(prev.hp - hpDecrement, 0)
                }))
                playerRef.current?.classList.add('player-hurt')
                setTimeout(() => {
                    playerRef.current?.classList.remove('player-hurt')
                }, 500)
            }
        
            // Update projectiles after filtering out collided ones
            setProjectiles(projs)
        }
    }

    const reset = () => {
        setScore(0)
        setPlayer((prev) => ({
            ...prev,
            hp: 100
        }))
        setProjectiles([])
        setGameOver(false)
        setPlay(true)

        // soundEffect('grocery')
    }

    useEffect(() => {
        if (play) {
            const interval = setInterval(() => {
                moveProjectiles()
                movePlayer()
            }, 16)
            return () => clearInterval(interval)
        }
    }, [play])

    useEffect(() => {
        if (play) {
            const interval = setInterval(() => {
                fireProjectile('player')
            }, fireSpeed)
            return () => clearInterval(interval)
        }
    }, [play])

    return (
        <div ref={main} className='relative flex-1 flex flex-col items-center justify-center chatBg overflow-hidden publixBg'>
            {gameOver ? (
                <>
                    <div className='absolute w-full h-full flex flex-col justify-center items-center z-100 bg-black/50'>
                        <h1 className='text-4xl text-emerald-200 font-bold mb-4'>GAME OVER</h1>
                        <h1 className='text-4xl sm:text-3xl text-center text-emerald-200 font-bold mb-4'>YOU SCORED <br></br><span className='text-red-500'>{score}</span><br></br> POINTS</h1>
                        <button className='text-4xl sm:text-3xl text-emerald-200 font-bold bg-black p-4 py-2 rounded-lg' onClick={reset}>PLAY AGAIN</button>
                    </div>
                </>
            ) : (
                <></>
            )}
            {!play && !gameOver ? (
                <>
                    <div className='absolute w-full h-full flex flex-col justify-center items-center z-100 bg-black/50'>
                        <h1 className='text-4xl text-emerald-200 font-bold mb-8'>Produce Hero TM</h1>
                        <button className='text-4xl text-emerald-200 font-bold bg-black p-4 rounded-lg' onClick={() => {setPlay(true); }}>Play</button>
                    </div>
                </>
            ) : (
                <>
                    <div className='absolute flex items-center justify-between top-12 left-0 w-full px-3 py-2'>
                        <h1 className='text-2xl text-emerald-200 font-bold'>HP: {player.hp}</h1>
                        <h1 className='text-2xl text-emerald-200 font-bold'>Score: {score}</h1>
                    </div>
                    <div id='player' ref={playerRef} className='flex items-center justify-center w-[200px] h-[400px] sm:w-[100px] sm:h-[200px] player' style={{ position: 'absolute', bottom: `0px`, left: `${player.pos.x - offset}px` }}>
                        <div ref={colliderRef} style={{ width: `${colliderSize.width}px`, height: `${colliderSize.height}px` }} className=''></div>
                    </div>
                    {projectiles.map((projectile, index) => {
                        return (
                            <div key={index} className="w-[250px] h-[250px] sm:w-[125px] sm:h-[125px] z-0" style={{ backgroundImage: `url(${projectile.image})`, backgroundSize: 'contain', position: 'absolute', top: `${projectile.y}px`, left: `${projectile.x}px`}}></div>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default Page