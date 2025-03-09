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
            console.log("join room request")
            if(rooms.get(event.roomid)) {
                rooms.set(event.roomid , [ws])
                ws.send(JSON.stringify({
                    type: event.type,
                    result: "success",
                    roomid: `${event.roomid}`
                }))
            }
        }
    })
})