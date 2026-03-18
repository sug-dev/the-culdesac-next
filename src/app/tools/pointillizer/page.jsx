'use client'

import { useState, useEffect, useRef } from 'react'

const Page = () => {

    const canvas_ref = useRef(null)
    const body_ref = useRef(null)
    const save_link_ref = useRef(null)

    const [params, setParams] = useState({
        dots: 30000,
        radius: 0.75,
        density_strength: 1.0,
        brightness_gamma: 1.0,
        threshold_low: 255,
        threshold_high: 0
    })

    const brightness = useRef(null)
    const [file, setFile] = useState()


    const handle_params = (field, value) => {
        setParams(prev => ({
            ...prev,
            [field]: Number(value)
        }))
        render()
    }

    const upload_image = (v) => {
        setFile(v)
        load_image(v)
    }


    function save_image() {
        canvas_ref.current?.toBlob((blob) => {
            const url = URL.createObjectURL(blob)

            const a = save_link_ref.current
            a.href = url
            a.download = "img.png"
            a.click()

            URL.revokeObjectURL(url)
        }, "image/png")
    }

    function resize_canvas_to_image(img) {
        const max_height = window.innerHeight * 0.8
        const aspect = img.width / img.height

        const canvas_height = max_height
        const canvas_width = canvas_height * aspect

        canvas_ref.current.height = canvas_height
        canvas_ref.current.width = canvas_width
    }

    function load_image(file) {
        const img = new Image()
        img.src = URL.createObjectURL(file)

        img.onload = () => {

            resize_canvas_to_image(img)

            canvas_ref.current.width = img.width
            canvas_ref.current.height = img.height

            canvas_ref.current.getContext('2d').drawImage(img, 0, 0)

            const image_data = canvas_ref.current.getContext('2d').getImageData(
                0,
                0,
                canvas_ref.current?.width,
                canvas_ref.current?.height
            )

            const pixel_data = image_data.data

            let br = new Float32Array(canvas_ref.current?.width * canvas_ref.current?.height)

            brightness.current = br

            for (let i = 0, j = 0; i < pixel_data.length; i += 4, j++) {
                const r = pixel_data[i]
                const g = pixel_data[i + 1]
                const b = pixel_data[i + 2]

                const b_val = 1 * r + 1 * g + 1 * b

                br[j] = b_val

                if (b_val < params.threshold_high) params.threshold_high = b_val
                if (b_val > params.threshold_low) params.threshold_low = b_val
            }

            render()
        }
    }

    function get_brightness(x, y) {
        if (canvas_ref.current) {
            return brightness[y * canvas_ref.current.width + x]
        }
    }

    function render() {
        canvas_ref.current.getContext('2d').clearRect(0, 0, canvas_ref.current?.width, canvas_ref.current?.height)

        for (let i = 0; i < params.dots; i++) {

            const vx = Math.random() * canvas_ref.current?.width
            const vy = Math.random() * canvas_ref.current?.height

            const sx = Math.floor(vx * 1) //scale_x
            const sy = Math.floor(vy * 1) //scale_y

            const b = brightness.current[sy * canvas_ref.current.width + sx]

            let norm = (b - params.threshold_high) / (params.threshold_low - params.threshold_high)

            norm = Math.pow(norm, params.brightness_gamma)

            const density = Math.pow(norm, params.density_strength)

            if (Math.random() < density) {
                const radius = params.radius

                canvas_ref.current.getContext('2d').beginPath()
                canvas_ref.current.getContext('2d').arc(vx, vy, radius, 0, Math.PI * 2)
                canvas_ref.current.getContext('2d').fillStyle = `rgb(${b},${b},${b})`
                canvas_ref.current.getContext('2d').fill()
            }
        }
    }
    
    return (
        <div ref={body_ref} className='flex flex-col items-center sm:w-full sm:pt-14 bg-neutral-900 flex-1'>
            <a href="#" className='hidden' ref={save_link_ref}></a>
            <div id="ui_container" className='flex flex-col items-center w-full max-w-[100vw]'>
                <input className='bg-neutral-900 p-3 w-full text-white text-xs' type="file" name="image" id="image" onChange={(e) => {upload_image(e.target.files[0])}}/>

                <div id="ui_subcontainer" className='flex justify-between bg-neutral-800 w-full'>
                    <div className='flex items-center justify-between w-[85%] px-3 py-2'>
                        <div className="label_holder w-[30%]">
                            <label className='text-white font-bold text-xs' htmlFor="density">Density</label>
                            <input type="range" id="density" min="0.2" max="3" step="0.1" value={params.density_strength} onInput={(e) => {handle_params('density_strength', e.target.value)}}/>
                        </div>

                        <div className="label_holder w-[30%]">
                            <label className='text-white font-bold text-xs' htmlFor="gamme">Gamma</label>
                            <input type="range" id="gamma" min="0.2" max="3" step="0.1" value={params.brightness_gamma} onInput={(e) => {handle_params('brightness_gamma', e.target.value)}}/>
                        </div>

                        <div className="label_holder w-[30%]">
                            <label className='text-white font-bold text-xs' htmlFor="dots">Dots</label>
                            <input type="range" id="dots" min="5000" max="320000" step="1000" value={params.dots} onInput={(e) => {handle_params('dots', e.target.value)}}/>
                        </div>
                    </div>

                    <button className='bg-neutral-700 border border-neutral-600 text-white text-xs font-bold cursor-pointer w-[15%]' id="save_btn" onClick={() => {save_image()}}>Save</button>
                </div>
            </div>

            <div className='flex-1 w-full flex items-center justify-center px-3'>
                <canvas id="view_canvas" className='max-h-[65vh] rounded-lg w-auto max-w-full h-auto block' ref={canvas_ref}></canvas>
            </div>
        </div>
    )
}

export default Page