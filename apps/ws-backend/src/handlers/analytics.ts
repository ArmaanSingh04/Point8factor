import { WebSocket } from "ws";
import { appAnalytics } from "../state";

export const createdRoomAnalytics = (ws: WebSocket , event: any) => {
    if(event.type == "create-room-analytics"){
        ws.send(JSON.stringify(appAnalytics))
    }
}