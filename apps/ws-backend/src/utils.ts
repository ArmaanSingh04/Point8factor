import { v4 as uuidv4 } from "uuid"
import { gameState, Player, rooms } from "./state"
import WebSocket from "ws"

export const generateRandomWord = (): string => {
    return uuidv4().replace(/-/g, "").substring(0,8)
}

export const everyoneGuessed = (roomid: string): boolean => {
    const existingRoom = gameState.get(roomid)

    if(existingRoom){
        //console.log(existingRoom.players)

        for (let i = 0; i < existingRoom.players.length; i++) {
            if (existingRoom.players[i]?.turn === true) {
                return false;
            }
        }
        return true
    }
    return false

}

const calculateScore = (roomid: string) => {
    const existingRoom = gameState.get(roomid)

    if(existingRoom){
        let sum = 0;
        existingRoom.players.forEach((player) => {
            sum += player.guess
        })
        const goal = Math.round((sum / existingRoom.members) * 0.8);

        
        // find the closest to the goal
        let winnerDiff = Infinity , winnerIndex = 0;
        existingRoom.players.forEach((player) => {

            const diff = Math.abs(player.guess - goal)
            if(diff < winnerDiff){
                winnerDiff = diff,
                winnerIndex = player.id
            }

        })

        const winner = existingRoom.players.find(player => player.id === winnerIndex) || null;
        // announce he is the winner

        if(winner){
            // player score
            existingRoom.players.forEach((player) => {
                // increase the score who did not win the round
                if(player.id != winner.id){
                    player.score += 1;
                }
            })
            console.log('round-winner' , winner.username)
            existingRoom.players.forEach((player) => {
                player.conn.send(JSON.stringify({
                    type: "round-winner",
                    result: "success",
                    username: winner.username
                }))
            })
        }
        


    }
}

const checkElimination = (roomid: string) => {
    const existingRoom = gameState.get(roomid)

    if(existingRoom) {
        existingRoom.players.forEach((player) => {
            if(player.score >= existingRoom.members ){
                // player is eliminated
                player.turn = false;
                player.eliminated = true;
                // announce everyone that this player is eliminated
                console.log("player eliminated" , player.username)
                existingRoom.players.forEach((temp) => {
                    temp.conn.send(JSON.stringify({
                        type: "player-eliminated",
                        result: "success",
                        username: player.username 
                    }))
                })
            }
        })
    }
}

export const checkGameOver = (roomid: string): boolean => {
    const existingRoom = gameState.get(roomid)

    // if there are at least 2 players 
    if(existingRoom){
        let countNotEliminated = 0
        existingRoom.players.forEach((player) => {
            if(!player.eliminated){
                countNotEliminated += 1;
            }
        })
        if(countNotEliminated < 2){
            // game is over announce the winner
            console.log('game over')
            return true;
        }
    }

    return false;
}

export const changeRound = (roomid: string) => {
    const existingRoom = gameState.get(roomid)


    if(existingRoom){
        calculateScore(roomid)
        checkElimination(roomid)

        if(checkGameOver(roomid) === true){
            
            const winner = existingRoom.players.find((player) => player.eliminated == false)
            if(winner){
                existingRoom.players.forEach((player) => {
                    player.turn = false
                    player.conn.send(JSON.stringify({
                        type: "game-over",
                        result: "success",
                        winner: winner.username
                    }))
                })
                gameState.delete(roomid)
            }
            
            return
        }
        // change the turn
        existingRoom.players.forEach((player) => {
            // calculate the score and check for elimination
            if(!player.eliminated){
                player.turn = true;
            }
        })
        existingRoom.round += 1;
    }
}

export function leftPlayer(ws: WebSocket){
    gameState.forEach((room) => {
        room.players.forEach((player) => {
            if(player.conn == ws){
                // left player
                // announce room player has left
                room.players = room.players.filter((player) => player.conn != ws)
                
                room.players.forEach((player) => {
                    player.conn.send(JSON.stringify({
                        type: "player-left"
                    }))
                })
            }
        })
    })
}