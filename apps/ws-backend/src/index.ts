import WebSocket, { WebSocketServer } from "ws";
import { generateRandomWord, getRoomMembers, leftPlayer } from "./utils";
// import { gameHandler, StartGame } from "./game";
import { appAnalytics, rooms } from "./state";
import { createRoomHandler } from "./handlers/create-room";
import { joinRoomHandler } from "./handlers/join-room";
import { getGamePlayersHandler, getRoomPlayersHandler } from "./handlers/get-room-players";
import { startGameHandler } from "./handlers/start-game";
import { getTurnHandler } from "./handlers/get-turn";
import { playerGuessHandler } from "./handlers/player-guess";
import { getPlayerGuessHandler } from "./handlers/get-player-guess";
import { leaveRoomHandler } from "./handlers/leave-room";
import { leaveGameHandler } from "./handlers/leave-game";
import { getRoomChat, postRoomChat } from "./handlers/room-chat";
import { getAnalytics } from "./handlers/analytics";

const ws = new WebSocketServer({ port: 8000 })

ws.on("listening", () => {
    console.log(`Websocket server ready at port 8000`)
})

ws.on("connection", (ws) => {
    appAnalytics.players += 1;
    ws.on("message", (data) => {
        
        const event = (() => {
            try {
                return JSON.parse(data.toString());
            } catch {
                console.error("Error parsing the event");
                return null;
            }
        })();

        if (!event) return;

        createRoomHandler(ws, event)
        joinRoomHandler(ws, event)
        getRoomPlayersHandler(ws, event)
        getGamePlayersHandler(ws, event)
        startGameHandler(ws, event)
        getTurnHandler(ws, event)
        playerGuessHandler(ws, event)
        getPlayerGuessHandler(ws, event)
        leaveRoomHandler(ws, event)
        leaveGameHandler(ws, event)
        getRoomMembers(ws, event)
        getRoomChat(ws, event)
        postRoomChat(ws, event)

        getAnalytics(ws, event)
    })
    ws.on("close", (ws) => {
        // this is working fine printing a id idk why
    })
})