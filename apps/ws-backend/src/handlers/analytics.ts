import { WebSocket } from "ws";
import { appAnalytics } from "../state";

export const getAnalytics = (ws: WebSocket , event: any) => {
    if(event.type == "get-analytics"){
        ws.send(JSON.stringify(appAnalytics))
    }
}