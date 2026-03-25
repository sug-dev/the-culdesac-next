import { NextRequest, NextResponse } from "next/server"
import { clientPromise } from "@/lib/mongodb"

export async function GET(req: NextRequest) {

    const id = new URL(req.url).searchParams.get('_id')

    const db = await clientPromise()

    let all_articles = await db.collection('articles').find({}).sort({ _id: -1 }).toArray()

    return NextResponse.json({ articles: all_articles })
}

export async function POST(req: NextRequest) {

    const data = await req.json()

    const db = await clientPromise()
    const collection = db.collection('articles')

    try {
        const article_pushed = await collection.insertOne(data)
        return NextResponse.json({ response: `Article inserted with _id: ${article_pushed.insertedId}`, status: 200 })
    } catch (error: any) {
        console.error("Error submitting blog post backend: ", error.message)
        return NextResponse.json({ response: "FAILED TO PUSH ARTICLE" })
    }
}