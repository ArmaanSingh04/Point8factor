import WebSocket , { WebSocketServer } from "ws";
import { generateRandomWord } from "./utils";

const ws = new WebSocketServer({ port: 8000 })

const rooms = new Map<string , WebSocket[]>()
const players = new Map<string , { username: string }[]>()

ws.on("listening" , () => {
    console.log(`Websocket server ready at port 8000`)
})

ws.on("connection" , (ws) => {
    ws.on("message" , (data) => {
        const event = JSON.parse(data.toString()) 
        
        if(event.type == "create-room"){
            const roomid = generateRandomWord()
            rooms.set(roomid , [ws])
            players.set(roomid , [{ username: event.username }])

            ws.send(JSON.stringify({
                type: event.type,
                result: "success",
                roomid: `${roomid}`
            }))
        }
        else if(event.type == "join-room"){
            const existingroom = rooms.get(event.roomid)
            const playersroom = players.get(event.roomid)

            if(existingroom && playersroom) {

                existingroom.forEach((conn) => {
                    conn.send(JSON.stringify({
                        type: "player-joined",
                        username: event.username
                    }))
                })

                existingroom.push(ws)
                playersroom.push({ username: event.username })
                
                ws.send(JSON.stringify({
                    type: event.type,
                    result: "success",
                    roomid: `${event.roomid}`
                }))
            }
        }
        else if(event.type == "get-room-players"){
            const existingPlayers = players.get(event.roomid)

            ws.send(JSON.stringify({
                type: "get-room-players",
                result: "success",
                players: existingPlayers
            }))
            console.log(existingPlayers , 'hit')
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