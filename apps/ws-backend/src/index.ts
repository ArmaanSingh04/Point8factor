import WebSocket , { WebSocketServer } from "ws";
import { generateRandomWord, leftPlayer } from "./utils";
// import { gameHandler, StartGame } from "./game";
import { rooms } from "./state";
import { createRoomHandler } from "./handlers/create-room";
import { joinRoomHandler } from "./handlers/join-room";
import { getGamePlayersHandler, getRoomPlayersHandler } from "./handlers/get-room-players";
import { startGameHandler } from "./handlers/start-game";
import { getTurnHandler } from "./handlers/get-turn";
import { playerGuessHandler } from "./handlers/player-guess";
import { getPlayerGuessHandler } from "./handlers/get-player-guess";
import { leaveRoomHandler } from "./handlers/leave-room";
import { leaveGameHandler } from "./handlers/leave-game";

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
        getGamePlayersHandler(ws , event)
        startGameHandler(ws , event)
        getTurnHandler(ws , event)
        playerGuessHandler(ws , event)
        getPlayerGuessHandler(ws , event)
        leaveRoomHandler(ws , event)
        leaveGameHandler(ws , event)
    })
    ws.on("close" , (ws) => {
        // this is working fine printing a id idk why
    })
})