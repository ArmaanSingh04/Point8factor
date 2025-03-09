import WebSocket , { WebSocketServer } from "ws";
import { generateRandomWord } from "./utils";

const ws = new WebSocketServer({ port: 8000 })

const rooms = new Map<string , WebSocket[]>()

ws.on("listening" , () => {
    console.log(`Websocket server ready at port 8000`)
})

ws.on("connection" , (ws) => {
    ws.on("message" , (data) => {
        const event = JSON.parse(data.toString()) 
        
        if(event.type == "create-room"){
            const roomid = generateRandomWord()
            rooms.set(roomid , [ws])
            ws.send(JSON.stringify({
                type: event.type,
                result: "success",
                roomid: `${roomid}`
            }))
        }
        else if(event.type == "join-room"){
            const existingroom = rooms.get(event.roomid)
            if(existingroom) {
                existingroom.push(ws)
                ws.send(JSON.stringify({
                    type: event.type,
                    result: "success",
                    roomid: `${event.roomid}`
                }))
            }
        }
        else if(event.type == "send-message"){
            const message = event.message
            // brodcast the message to the whole room
            const room = rooms.get(event.roomid)
            if(room){
                room.forEach((conn) => {
                    conn.send(JSON.stringify({
                        type: "receive-message",
                        message
                    }))
                })
            }
        }
    })
})