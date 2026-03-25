import { NextRequest, NextResponse } from "next/server"
import { clientPromise } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {

    const id = params.slug[0]

    const db = await clientPromise()

    let all_articles = await db.collection('articles').find({ _id: new ObjectId(id) }).toArray()

    return NextResponse.json({ articles: all_articles })
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {

    const id = params.slug[0]
    const data = await req.json()

    const db = await clientPromise()

    try {
        await db.collection('articles').updateOne(
            { _id: new ObjectId(id) },
            { $set: data.updatedData }
        )
        return NextResponse.json({ response: `Article entry UPDATED with _id: ${id}`, status: 200 })
    } catch (error: any) {
        console.error("Error submitting article backend: ", error.message)
        return NextResponse.json({ response: "FAILED TO PUSH ARTICLE" })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
    
    const id = params.slug[0]

    const db = await clientPromise()

    try {
        if (id) {
            await db.collection('articles').deleteOne({ _id: new ObjectId(id) })
        }
        return NextResponse.json({ response: `Article entry DELETED with _id: ${id}`, status: 200 })
    } catch (error: any) {
        console.error("Error deleting article backend: ", error.message)
        return NextResponse.json({ response: "FAILED TO DELETE ARTICLE ENTRY" })
    }

}