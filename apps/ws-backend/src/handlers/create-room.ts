import WebSocket from "ws"
import { appAnalytics, InitialRoomState, rooms } from "../state"
import { generateRandomWord } from "../utils"

export const createRoomHandler = (ws: WebSocket, event: any) => {
    // requires [type , username]
    if (event.type == "create-room") {
        
        const roomid = generateRandomWord()
        const username = event.username

        const obj: InitialRoomState = {
            username: username,
            conn: ws,
            host: true
        }

        rooms.set(roomid , [obj])
        appAnalytics.rooms += 1;

        ws.send(JSON.stringify({
            type: event.type,
            result: "success",
            roomid: `${roomid}`
        }))
    }
}