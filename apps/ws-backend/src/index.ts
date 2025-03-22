import WebSocket , { WebSocketServer } from "ws";
import { generateRandomWord } from "./utils";
// import { gameHandler, StartGame } from "./game";
import { rooms } from "./state";
import { createRoomHandler } from "./handlers/create-room";
import { joinRoomHandler } from "./handlers/join-room";
import { getRoomPlayersHandler } from "./handlers/get-room-players";
import { startGameHandler } from "./handlers/start-game";

const ws = new WebSocketServer({ port: 8000 })

ws.on("listening" , () => {
    console.log(`Websocket server ready at port 8000`)
})

ws.on("connection" , (ws) => {
    ws.on("message" , (data) => {
        const event = JSON.parse(data.toString()) 
        
        createRoomHandler(ws , event)
        joinRoomHandler(ws , event)
        getRoomPlayersHandler(ws , event)
        startGameHandler(ws , event)
        // StartGame(ws , event)
        // gameHandler(ws , event)
        // getTurn(ws , event)

        
        // else if(event.type == "join-room"){
        //     const existingroom = rooms.get(event.roomid)
        //     const playersroom = players.get(event.roomid)

        //     if(existingroom && playersroom) {

        //         existingroom.forEach((conn) => {
        //             conn.send(JSON.stringify({
        //                 type: "player-joined",
        //                 username: event.username
        //             }))
        //         })

        //         existingroom.push(ws)
        //         playersroom.push({ username: event.username })
                
        //         ws.send(JSON.stringify({
        //             type: event.type,
        //             result: "success",
        //             roomid: `${event.roomid}`
        //         }))
        //     }
        // }
        // else if(event.type == "get-room-players"){
        //     const existingPlayers = players.get(event.roomid)

        //     ws.send(JSON.stringify({
        //         type: "get-room-players",
        //         result: "success",
        //         players: existingPlayers
        //     }))
        // }
        // else if(event.type == "send-message"){
        //     const message = event.message
        //     // brodcast the message to the whole room
        //     const room = rooms.get(event.roomid)
        //     if(room){
        //         room.forEach((conn) => {
        //             conn.send(JSON.stringify({
        //                 type: "receive-message",
        //                 message
        //             }))
        //         })
        //     }
        // }
    })
})