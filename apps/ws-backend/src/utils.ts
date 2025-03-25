import { v4 as uuidv4 } from "uuid"
import { gameState, Player, rooms } from "./state"

export const generateRandomWord = (): string => {
    return uuidv4().replace(/-/g, "").substring(0,8)
}

export const everyoneGuessed = (roomid: string): boolean => {
    const existingRoom = gameState.get(roomid)

    if(existingRoom){
        console.log(existingRoom.players)

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

        let winner:Player;
        existingRoom.players.forEach((player) => {
            if(player.id == winnerIndex){
                player.score += 1;
                winner = player;
            }
        })
        // announce he is the winner
        existingRoom.players.forEach((player) => {
            player.conn.send(JSON.stringify({
                type: "winner",
                result: "success",
                username: winner.username
            }))
        })


    }
}

const checkElimination = (roomid: string) => {
    const existingRoom = gameState.get(roomid)

    if(existingRoom) {
        existingRoom.players.forEach((player) => {
            if(player.score == existingRoom.members + 1){
                // player is eliminated
                player.eliminated = true;
                // announce everyone that this player is eliminated
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

export const changeRound = (roomid: string) => {
    const existingRoom = gameState.get(roomid)


    if(existingRoom){
        calculateScore(roomid)
        checkElimination(roomid)
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