import { WebSocket } from "ws";
import { gameState, RoomStats } from "../state";

export const leaveGameHandler = (ws: WebSocket , event: any) => {
    if(event.type == "leave-game"){
        const username = event.username;
        const roomid = event.roomid

        const existingRoom = gameState.get(roomid)

        if(existingRoom){
            const newArray = existingRoom.players.filter((player) => player.username !== username)

            const newObject: RoomStats = {
                round: existingRoom.round,
                players: newArray,
                members: existingRoom.members,
                eliminatedPlayers: existingRoom.eliminatedPlayers
            }
            if(newArray.length == 0) gameState.delete(roomid)
            else gameState.set(roomid , newObject);

            // announce everyone player left
            newArray.forEach((player) => {
                player.conn.send(JSON.stringify({
                    type: "player-left-from-game",
                    username: username
                }))
            })

            console.log(gameState)
        }
    }
}