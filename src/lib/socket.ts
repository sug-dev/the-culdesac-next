import { Server as IOServer } from "socket.io"
import { Server as HTTPServer } from "http"

let io: IOServer | null = null

export function setIO(server: HTTPServer) {
    io = new IOServer(server, {
        cors: { origin: "*" },
    })

    io.on("connection", (socket) => {
        console.log("A BALLSACK connected:", socket.id)

        // ✅ handle incoming progress events from this client
        socket.on("progress", (prog: any) => {
            console.log("CONNECTED TO PROGRESS", prog)

            // broadcast progress to all clients
            io?.emit("progress", prog.toString())
        })

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id)
        })
    })
}

export function getIO() {
    if (!io) throw new Error("Socket.io not initialized!")
    return io
}