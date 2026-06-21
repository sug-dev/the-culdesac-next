import { NextRequest, NextResponse } from "next/server"
import { clientPromise } from "@/lib/mongodb"

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET(req: NextRequest) {

    const html = `
        <div class="main-sub-container">
            <div class="main-sub-header">
                <h2>Site Resources</h2>
            </div>
            <ul class="sub-list">
                <li class="standard"><a class="post-link" target="_blank" href="https://gifcities.org">GifCities</a> - For all of the random gifs</li>
                <li class="standard"><a class="post-link" target="_blank" href="https://habboquests.co/goodies/imager">Habbo Imager</a> - For the Habbo user sprite</li>
                <li class="standard"><a class="post-link" target="_blank" href="https://ditherit.com">Dither it!</a> - Tool for dithering an image (used for the fishtank background and other images)</li>
                <li class="standard"><a class="post-link" target="_blank" href="https://namecheap.com">Namecheap</a> - Domain registrar</li>
                <li class="standard"><a class="post-link" target="_blank" href="https://digitalocean.com">DigitalOcean</a> - Web hosting service</li>
            </ul>
        </div>
    `

    return new NextResponse(html, {
        headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, HX-Request, HX-Target, HX-Current-URL, HX-Trigger",
        }
    })
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, HX-Request, HX-Target, HX-Current-URL, HX-Trigger",
        },
    })
}