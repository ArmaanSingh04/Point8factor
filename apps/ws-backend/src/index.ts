import WebSocket , { WebSocketServer } from "ws";
import { generateRandomWord } from "./utils";
// import { gameHandler, StartGame } from "./game";
import { rooms } from "./state";
import { createRoomHandler } from "./handlers/create-room";
import { joinRoomHandler } from "./handlers/join-room";
import { getRoomPlayersHandler } from "./handlers/get-room-players";
import { startGameHandler } from "./handlers/start-game";
import { getTurnHandler } from "./handlers/get-turn";
import { playerGuessHandler } from "./handlers/player-guess";
import { getPlayerGuessHandler } from "./handlers/get-player-guess";

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
        getTurnHandler(ws , event)
        playerGuessHandler(ws , event)
        getPlayerGuessHandler(ws , event)
        
    })
})