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
                conn: conn,
                eliminated: false
            }))


            const roomStats: RoomStats = {
                round: 0,
                currentTurn: 0,
                members: arr.length,
                players: arr,
                eliminatedPlayers: 0
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

    if (lastPlayerId == room.members-1) {
        // last player change the round and calculate the scores
        room.round += 1;
        room.currentTurn = 0;

        let average = 0;
        room.players.forEach((player) => {
            average += player.guess;
        })
        average = average / room.members
        const goal = average * 0.8;

        let roundWinnerIndex: number | null  = null;
        let lowest = Infinity;
        // update the winner score
        room.players.forEach((player) => {
            const diff = Math.abs(goal - player.guess)
            if(diff < lowest){
                lowest = diff;
                roundWinnerIndex = player.id
            }
        })

        // announce everyone that round has changed
        room.players.forEach((player) => {
            if(player.id == roundWinnerIndex){
                player.conn.send(JSON.stringify({
                    type: "round-change",
                    result: "winner"
                }))
            }
            else{
                player.score = player.score + 1;

                // check for player elimination
                if(player.score == room.members){
                    // player is eliminated
                    player.eliminated = true
                    room.eliminatedPlayers += 1;
                    // check for game over or not
                    player.conn.send(JSON.stringify({
                        type: "player-eliminated",
                        result: "success"
                    }))
                    if(room.eliminatedPlayers == room.members-1){
                        // game over announce the winner
                        player.conn.send(JSON.stringify({
                            type: "game-over",
                            result: "success"
                        }))
                    }
                }
                player.conn.send(JSON.stringify({
                    type: "round-change",
                    result: "not-a-winner"
                }))
            }
        })

        // announce everyone that round has changed
        console.log("round has changed result " , goal,   room)
        // round over will appear when all the players are eliminated

        
    }
    else {
        // player is not the last player
        room.currentTurn += 1;
    }
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
        }
    }
}