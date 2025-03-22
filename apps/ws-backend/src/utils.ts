import { v4 as uuidv4 } from "uuid"
import { gameState } from "./state"

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

export const changeRound = (roomid: string) => {
    const existingRoom = gameState.get(roomid)


    if(existingRoom){
        existingRoom.players.forEach((player) => {
            // calculate the score and check for elimination

            player.turn = true
        })
        existingRoom.round += 1;
    }
}