import { NextRequest, NextResponse } from "next/server"
import { clientPromise } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface Post {
    title: string,
    content: string,
    genre: string,
    rating: string,
    createdAt: Date
}

export async function GET(req: NextRequest) {

    const db = await clientPromise()

    let r = await db.collection('media-log').find({}, { sort: { createdAt: -1 } }).toArray()

    const html = r.map((p: Post) => `
        <article class="main-sub-container" class="sub-container">
            <div class="main-sub-header">
                <h2 style="width:30%; text-align: left;">${escapeHtml(p.createdAt.toDateString())}</h2>
                <h2 style="width:40%; text-align: center;">${escapeHtml(p.title)}</h2>
                <h2 style="width:30%; text-align: right;">${escapeHtml(p.genre)}</h2>
            </div>
            <p>${escapeHtml(p.content)}</p>
            <h3 id="rating">Rating: ${escapeHtml(p.rating)}/5</h3>
        </article>
    `).join("")

    return new NextResponse(html, {
        headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, HX-Request, HX-Target, HX-Current-URL, HX-Trigger",
        }
    })
}

export async function POST(req: NextRequest) {
    const data = await req.json()

    const ml_data = {
        title: data.title,
        content: data.content,
        genre: data.genre,
        rating: data.rating,
        createdAt: new Date()
    }

    const db = await clientPromise()
    const collection = db.collection('media-log')

    try {
        const ml_pushed = await collection.insertOne(ml_data)
        return NextResponse.json({ response: `media log inserted with _id: ${ml_pushed.insertedId}`, status: 200 })
    } catch (error: any) {
        console.error("Error submitting status backend: ", error.message)
        return NextResponse.json({ response: "FAILED TO PUSH media log" })
    }
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