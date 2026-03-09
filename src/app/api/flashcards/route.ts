import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { clientPromise } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
    try {
        const db = await clientPromise()

        const collections = await db.collection("collections").find({}).toArray()
        const cards = await db.collection("cards").find({}).toArray()

        return NextResponse.json({collections: collections, cards: cards})
    } catch (err: any) {
        console.error("Error fetching cards:", err)
        return NextResponse.json(
            { error: "Failed to fetch cards" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const db = await clientPromise()
        const body = await req.json()

        const { kind } = body

        // ─────────────────────────────
        // CREATE CATEGORY / FOLDER / SUBFOLDER
        // ─────────────────────────────
        if (kind === "collection") {
        const { name, type, parentId } = body

        if (!name || !type) {
            return NextResponse.json(
                { error: "Missing name or type" },
                { status: 400 }
            )
        }

        if (type !== "category" && !parentId) {
            return NextResponse.json(
                { error: "Folders and subfolders require parentId" },
                { status: 400 }
            )
        }

        const result = await db.collection("collections").insertOne({
            name,
            type,
            parentId: parentId ? new ObjectId(parentId) : null,
        })

        return NextResponse.json({
                message: `${type} created`,
                id: result.insertedId
            })
        }

        // ─────────────────────────────
        // CREATE FLASHCARD
        // ─────────────────────────────
        if (kind === "card") {
        const { subfolderId, front, back, user } = body

        if (!subfolderId || !front || !back) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const result = await db.collection("cards").insertOne({
            subfolderId: new ObjectId(subfolderId),
            user,
            front,
            back,
            numberCorrect: 0,
            numberIncorrect: 0,
            createdAt: new Date()
        })

        return NextResponse.json({
                message: "Flashcard created",
                id: result.insertedId
            })
        }

        return NextResponse.json(
            { error: "Invalid request kind" },
            { status: 400 }
        )

    } catch (error: any) {
        console.error("POST error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const db = await clientPromise()
        const body = await req.json()

        const { _id, numberCorrect, numberIncorrect } = body

        if (!_id) {
            return NextResponse.json(
                { error: "Missing flashcard id" },
                { status: 400 }
            )
        }

        const result = await db.collection("cards").updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    numberCorrect,
                    numberIncorrect
                }
            }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Flashcard not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: "Flashcard stats updated"
        })

    } catch (error: any) {
        console.error("PATCH error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}