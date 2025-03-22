import WebSocket from "ws"
import { rooms } from "../state"

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