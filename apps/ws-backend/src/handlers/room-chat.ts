import { WebSocket } from "ws";
import { gameState } from "../state";

export const getRoomChat = (ws: WebSocket , event: any) => {
    const roomid = event.roomid;

    if(event.type == "get-room-chat"){
        const existingRoom = gameState.get(roomid)
        if(existingRoom){
            const roomChat = existingRoom.chat; // Array of messages

            ws.send(JSON.stringify({
                type: "room-chat",
                result: "success",
                data: roomChat
            }))

        }
    }
}

export const postRoomChat = (ws: WebSocket , event: any) => {
    const roomid = event.roomid;
    const username = event.username;
    const message = event.message;

    if(event.type == "post-room-chat"){
        const existingRoom = gameState.get(roomid);

        if(existingRoom){
            const length = existingRoom.chat.length;
            existingRoom.chat.push({
                username,
                message,
                id: length + 1
            })

            // announce everyone a new message has been posted
            existingRoom.players.forEach((player) => {
                player.conn.send(JSON.stringify({
                    type: "new-chat",
                    result: "success"
                }))
            })
        }
    }
}