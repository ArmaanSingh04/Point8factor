import WebSocket from "ws"
import { gameState, rooms } from "../state"

export const getRoomPlayersHandler = (ws: WebSocket , event: any) => {
    // requires [type , roomid]
    
    if(event.type == "get-room-players"){
        const existingRoom = rooms.get(event.roomid)

        if(existingRoom){
            const players = existingRoom.map((player) => ({ username: player.username , host: player.host }))
            
            ws.send(JSON.stringify({
                type: "get-room-players",
                result: "success",
                players: players
            }))
        }
    }
}

export const getGamePlayersHandler = (ws: WebSocket , event: any) => {
    if(event.type == "get-game-players"){
        const existingGame = gameState.get(event.roomid)

        if(existingGame){
            const players = existingGame.players.map((player) => ({ username: player.username }))
            ws.send(JSON.stringify({
                type: "get-game-players",
                result: "success",
                players: players
            }))
        }
    }
}