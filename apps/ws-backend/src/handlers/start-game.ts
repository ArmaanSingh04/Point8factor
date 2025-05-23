import { WebSocket } from "ws";
import { appAnalytics, gameState, Player, rooms, RoomStats } from "../state";

export const startGameHandler = (ws: WebSocket, event: any) => {
    // requires [type , roomid]
    if (event.type == "start-game") {
        const existingRoom = rooms.get(event.roomid)

        if (existingRoom) {

            const arr: Player[] = existingRoom.map((player, index) => ({
                id: index,
                guess: 0,
                score: 0,
                conn: player.conn,
                username: player.username,
                eliminated: false,
                turn: true
            }))

            const roomStats: RoomStats = {
                round: 0,
                members: arr.length,
                players: arr,
                eliminatedPlayers: [],
                chat: []
            }

            gameState.set(event.roomid , roomStats)
            appAnalytics.startedgames += 1;
            
            // announce everyone game has started
            existingRoom.forEach((player) => {
                player.conn.send(JSON.stringify({
                    type: "game-has-begin",
                    result: "success"
                }))
            })
        }
    }
}