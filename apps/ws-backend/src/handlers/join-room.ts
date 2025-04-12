import { gameState, InitialRoomState, rooms } from "../state"
import WebSocket from "ws"

export const joinRoomHandler = (ws: WebSocket, event: any) => {
    // requires [type , username , roomid]
    if (event.type == "join-room") {
        const existingroom = rooms.get(event.roomid)
        const roomStarted = gameState.get(event.roomid)

        console.log(roomStarted)

        if (existingroom && roomStarted == undefined) {

            existingroom.forEach((player) => {
                player.conn.send(JSON.stringify({
                    type: "player-joined",
                    username: event.username
                }))
            })

            const obj: InitialRoomState = {
                conn: ws,
                username: event.username,
                host: false
            }

            existingroom.push(obj)

            ws.send(JSON.stringify({
                type: event.type,
                result: "success",
                roomid: `${event.roomid}`
            }))
        }
        else if(roomStarted){
            ws.send(JSON.stringify({
                type: "room-already-started"
            }))
        }
    }
}