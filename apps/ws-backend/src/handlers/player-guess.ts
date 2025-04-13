import { WebSocket } from "ws";
import { gameState } from "../state";
import { changeRound, everyoneGuessed } from "../utils";

export const playerGuessHandler = (ws: WebSocket , event: any) => {
    // requires [type , roomid , username , guess]
    if(event.type == "player-guess"){
        const existingRoom = gameState.get(event.roomid)

        if(existingRoom){
            existingRoom.players.forEach((player) => {
                if(player.username == event.username && player.conn == ws){
                    player.guess = event.guess
                    player.turn = false
                    // check and change round if everyone guessed
                    // notify the player guess reached the server
                    player.conn.send(JSON.stringify({
                        type: "player-guess",
                        result: "success"
                    }))

                    existingRoom.players.forEach((player) => {
                        player.conn.send(JSON.stringify({
                            type: "a-player-submit"
                        }))
                    })
                }
            })

            //console.log('everyone guessed ? ' , everyoneGuessed(event.roomid))

            if(everyoneGuessed(event.roomid)){
                changeRound(event.roomid)
                // announce everyone round has changed   
                existingRoom.players.forEach((player) => {
                    player.conn.send(JSON.stringify({
                        type: "round-change"
                    }))
                })
            }
        }
    }
}