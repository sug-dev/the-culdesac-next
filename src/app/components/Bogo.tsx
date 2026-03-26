"use client"

import { useEffect, useRef, useState } from "react"
import io, { Socket } from 'socket.io-client'

export const Bogo = () => {
    const [arr, setArr] = useState<number[]>([])
    const [attempts, setAttempts] = useState(0)

    const socket = useRef<Socket | null>(null)

    return (
        <div className="border border-light rounded flex flex-col bg-m overflow-hidden aspect-square shadow">
            <h1 className="text-emerald-200 font-bold text-sm p-3 border-b border-light">Bogo Sort Live</h1>

            <div className="flex h-full items-end gap-[2px]">
                {arr.map((value, i) => (
                <div key={i} className={`w-[10%] bg-emerald-700 transition-all duration-[750ms]`} style={{ height: ((value + 1) * 10) + '%' }} />
                ))}
            </div>
        </div>
    );
}