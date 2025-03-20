"use client"

import { useContext, useEffect, useState } from "react"
import { UsernameContext } from "../../context/username.context"
import { RoomContext } from "../../context/room.context"
import { socketContext } from "../../context/socket.context"

// interface playerState {
//     roundresult: boolean
// }

export default function Game() {
    const { username } = useContext(UsernameContext)
    const { roomid } = useContext(RoomContext)
    const { socketConnection } = useContext(socketContext)
    const [ players , setPlayers ] = useState<{username: string}[]>([])

    const [ turn , setTurn ] = useState<boolean>(false)
    const [ winner , setWinner ] = useState<boolean>(false)
    const [roundOver , setRoundOver] = useState<boolean>(false)

    useEffect(() => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "get-room-players",
                roomid: roomid
            }))
            socketConnection.send(JSON.stringify({
                type: "get-turn",
                roomid: roomid
            }))
            socketConnection.onmessage = (message) => {
                const response = JSON.parse(message.data);

                if(response.type == "get-room-players"){
                    setPlayers(response.players)
                }
                else if (response.type == "whos-turn"){
                    console.log(response)
                    if(response.result == "your-turn"){
                        console.log('setting turn to true');
                        setTurn(true)
                    }
                    else if (response.result == "not-your-turn"){
                        console.log('setting turn to false')
                        setTurn(false)
                    }
                }
                else if(response.type == "round-change"){
                    setRoundOver(true)
                    if(response.result == "winner"){
                        setWinner(true)
                    }
                    else if(response.result == "not-a-winner"){
                        setWinner(false)
                    }
                    setTimeout(() => {
                        setRoundOver(false)
                        setWinner(false)
                    }, 3000);
                }
            }

        }
    }, [])

    const guessHandler = (e: any) =>{
        if(socketConnection){
            const inputbox = document.getElementById('guess-input') as HTMLInputElement
            socketConnection.send(JSON.stringify({
                type: "player-guess",
                roomid: roomid,
                guess: Number(inputbox.value)
            }))

            socketConnection.send(JSON.stringify({
                type: "get-turn",
                roomid: roomid
            }))
        }
    }
    return (
        <section>
            <div>
                {players.map((player , index) => <div key={index}>{player.username}</div>)}
            </div>

            {turn && 
                <div>
                    <input placeholder="Enter your guess" type="number" id="guess-input"/>  
                    <button onClick={(e) => guessHandler(e)}>Submit guess</button>
                </div>
            }
            {roundOver && <div>{winner? "You have won the game" : "Lost this round"}</div>}
        </section>
    )
}