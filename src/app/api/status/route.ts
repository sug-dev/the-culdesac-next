import { NextRequest, NextResponse } from "next/server"
import { clientPromise } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {

    const q = new URL(req.url).searchParams.get('type')

    const db = await clientPromise()

    let r = []

    if (q && q === 'latest') {
        r = await db.collection('statuses').findOne({}, { sort: { createdAt: -1 } })
    } else {
        r = await db.collection('statuses').find({}).toArray()
    }

    return NextResponse.json({ status: r }, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
        }})
}

export async function POST(req: NextRequest) {
    const data = await req.json()

    const s_data = {
        status: data.status,
        createdAt: new Date()
    }

    const db = await clientPromise()
    const collection = db.collection('statuses')

    try {
        const status_pushed = await collection.insertOne(s_data)
        return NextResponse.json({ response: `status inserted with _id: ${status_pushed.insertedId}`, status: 200 })
    } catch (error: any) {
        console.error("Error submitting status backend: ", error.message)
        return NextResponse.json({ response: "FAILED TO PUSH status" })
    }
}