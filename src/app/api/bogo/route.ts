import { bogo } from "@/lib/bogo"

export async function GET() {
    const encoder = new TextEncoder()

    let unsubscribe: (() => void) | null = null

    const stream = new ReadableStream({
        start(controller) {
            const send = (data: any) => {
                controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                )
            }

            unsubscribe = bogo.subscribe(send)
        },

        cancel() {
            if (unsubscribe) unsubscribe()
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    })
}