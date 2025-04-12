import WebSocket from "ws"
import { rooms } from "../state"

export const leaveRoomHandler = (ws:WebSocket , event: any) => {
    if(event.type == "leave-room"){
        const username = event.username
        const roomid = event.roomid

        const existingRoom = rooms.get(roomid)

        if(existingRoom){

            const leftPlayer = existingRoom.find((player) => player.username == username)
            const newArray = existingRoom.filter((player) => player.username !== username);


            if(leftPlayer?.host == true && newArray.length > 0){
                newArray[0]!.host = true; // object is defined for sure
            }
            if(newArray.length == 0) rooms.delete(roomid)
            else rooms.set(roomid , newArray)
            

            newArray.forEach((player) => {
                player.conn.send(JSON.stringify({
                    type: "player-left",
                    username: username
                }))
            })
        }
    }
}