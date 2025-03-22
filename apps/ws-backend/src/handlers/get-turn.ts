import { WebSocket } from "ws";
import { gameState } from "../state";

export const getTurnHandler = (ws: WebSocket , event: any) => {
    // require [turn , roomid , username]

    if(event.type == "get-turn"){
        const existingRoom = gameState.get(event.roomid)

        if(existingRoom){
            existingRoom.players.forEach((player) => {
                if(player.username == event.username){
                    ws.send(JSON.stringify({
                        type: "get-turn",
                        result: player.turn
                    }))
                }
            })
        }
    }
}