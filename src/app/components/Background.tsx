import { useEffect, useRef } from "react"
import { ThpaceGL } from 'thpace'

const settings = {
    colors: ['#0c3845', '#0a0a0a', '#024633'],
    triangleSize: 60,
    maxFps: 24,
    pointAnimationSpeed: 25000,
    particleSettings: {
        radius: [1, 2],
        count: [1, 2],
        opacity: [0.005, 0.25]
    }
}

const mobileSettings = {
    // colors: ['#155e75', '#101010', '#047857'],
    colors: ['#0c3845', '#0a0a0a', '#024633'],
    triangleSize: 30,
    maxFps: 24,
    pointAnimationSpeed: 25000,
    particleSettings: {
        radius: [0.5, 1],
        count: [1, 2],
        opacity: [0.005, 0.25]
    }
}

const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        canvasRef.current = document.querySelector('#bg')
        if (canvasRef.current) {
            if (canvasRef.current.getBoundingClientRect().width < 640) {
                ThpaceGL.create(canvasRef.current, mobileSettings)
            } else {
                ThpaceGL.create(canvasRef.current, settings)
            }
        }
    }, [])

    return (
        <canvas id="bg" className="w-full h-full fixed z-0"></canvas>
    )
}

export default Background