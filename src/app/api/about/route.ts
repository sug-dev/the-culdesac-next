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
            <div class="header">
                <h2>About Me</h2>
            </div>
            <p>29 / USA & JP / American</p>
            <p>Previously a freelance software developer, but now unemployed and figuring out which direction I want my career to go.</p>
            <p>Bouncing between America and Japan. Pursuing a Bachelor's degree so I can apply for work visas overseas. Building websites, making music, and playing gigs are what I spend my time doing. Oh, and a lot of movies recently, too.</p>
            <p>I am a bird-enthusiast. I also have a pet bird. She's 10 years old now and lives with my friend since it's too difficult taking her to and from Japan. She's in good hands, and I'm sure she doesn't miss me. :)</p>
            <p>While culturally a Gamer tm I am not regularly practicing at the time. That being said, some of my favorites are the Souls series, Minecraft, Kenshi, and various 'retro' games. Add me on <a href="https://habbo.com"><span class="accent">Habbo!</span></a> @suuug</p>
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