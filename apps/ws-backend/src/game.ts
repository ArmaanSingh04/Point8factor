import { WebSocket } from "ws";
import { gameState, rooms } from "./state";
import { Player } from "./state";
import { RoomStats } from "./state";

export function notifyRoom(roomid: string, message: string) {
    const existingRoom = rooms.get(roomid)
    if (existingRoom) {
        existingRoom.forEach((connection) => {
            connection.send(message)
        })
    }
}

export function StartGame(ws: WebSocket, event: any) {
    if (event.type == "start-game") {
        // to start the game push the websocket connection into the gamestate
        const existingRoom = rooms.get(event.roomid)
        if (existingRoom) {
            // push into the game state
            const arr: Player[] = existingRoom.map((conn, index) => ({
                id: index,
                guess: 0,
                score: 0,
                conn: conn
            }))


            const roomStats: RoomStats = {
                round: 0,
                currentTurn: 0,
                members: arr.length,
                players: arr
            }
            // setting the room state
            gameState.set(event.roomid, roomStats)

            console.log(gameState.get(event.roomid));
            // announce everyone that game has started
            notifyRoom(event.roomid, JSON.stringify({
                type: "game-has-begin",
                result: "success"
            }))
        }
    }
}

function announceTurn(){

}

export function getTurn(ws: WebSocket, event: any) {
    if (event.type == "get-turn") {
        const existingRoom = gameState.get(event.roomid)
        if (existingRoom) {
            const index = existingRoom.currentTurn
            const currentTurnPlayer = existingRoom.players[index]

            if (currentTurnPlayer){
                if (currentTurnPlayer.conn === ws) {
                    ws.send(JSON.stringify({
                        type: "whos-turn",
                        result: "your-turn"
                    }));
                } else {
                    ws.send(JSON.stringify({
                        type: "whos-turn",
                        result: "not-your-turn"
                    }));
                }
            }
        }
    }
}

function changeTurn(ws: WebSocket, lastPlayerId: number, room: RoomStats) {

    if (lastPlayerId == room.members - 1) {
        // last player change the round and calculate the scores
        room.round += 1;
        room.currentTurn = 0;

    }
    else {
        // player is not the last player
        room.currentTurn += 1;
    }
    // annouce everyone whos turn is now
    room.players.forEach((player) => {
        if(player.id == room.currentTurn){
            player.conn.send(JSON.stringify({
                type: "whos-turn",
                result: "your-turn"
            }))
        }
        else{
            player.conn.send(JSON.stringify({
                type: "whos-turn",
                result: "not-your-turn"
            }))
        }
    })

}

export function gameHandler(ws: WebSocket, event: any) {

    if (event.type == "player-guess") {

        const roomid = event.roomid
        const existingRoom = gameState.get(roomid)
        if (existingRoom) {
            existingRoom.players.forEach((player) => {
                if (player.conn == ws) {
                    player.guess = event.guess
                    changeTurn(ws, player.id, existingRoom)
                }
            })

            console.log(existingRoom)
        }
    }
}