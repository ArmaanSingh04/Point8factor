import { WebSocket } from "ws";
import { gameState } from "../state";

export const getPlayerGuessHandler = (ws: WebSocket , event: any) => {
    
    if(event.type == "get-player-guess"){
        const existingRoom = gameState.get(event.roomid);
        if(existingRoom){

            const arr = existingRoom.players.map((player) => {
                return {
                    username: player.username,
                    guess: player.guess
                }
            })

            ws.send(JSON.stringify({
                type: "get-player-guess",
                result: "success",
                data: arr
            }))
        }
    }
}