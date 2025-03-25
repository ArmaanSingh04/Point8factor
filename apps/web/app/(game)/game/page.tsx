"use client"

import { useContext, useEffect, useState } from "react"
import { UsernameContext } from "../../context/username.context"
import { RoomContext } from "../../context/room.context"
import { socketContext } from "../../context/socket.context"
import { useRouter } from "next/navigation"

// interface playerState {
//     roundresult: boolean
// }

export default function Game() {
    console.log('re render')
    const { username } = useContext(UsernameContext)
    const { roomid } = useContext(RoomContext)
    const { socketConnection } = useContext(socketContext)
    const [ players , setPlayers ] = useState<{username: string}[]>([])
    const router = useRouter()

    const [ turn , setTurn ] = useState<boolean>(false)
    const [ roundWinner , setRoundWinner ] = useState<string>()
    const [roundChange , setRoundChange] = useState<boolean>(false)
    const [winner , setwinner] = useState<string>()
    const [gameover , setGameOver] = useState<boolean>(false)

    useEffect(() => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "get-room-players",
                roomid: roomid
            }))
            socketConnection.send(JSON.stringify({
                type: "get-turn",
                roomid: roomid,
                username: username
            }))
            socketConnection.onmessage = (message) => {
                const response = JSON.parse(message.data);

                if(response.type == "get-room-players"){
                    setPlayers(response.players)
                }
                // else if (response.type == "whos-turn"){
                //     console.log(response)
                //     if(response.result == "your-turn"){
                //         console.log('setting turn to true');
                //         setTurn(true)
                //     }
                //     else if (response.result == "not-your-turn"){
                //         console.log('setting turn to false')
                //         setTurn(false)
                //     }
                // }
                else if(response.type == "round-change"){
                    // setRoundOver(true)
                    // if(response.result == "winner"){
                    //     setWinner(true)
                    // }
                    // else if(response.result == "not-a-winner"){
                    //     setWinner(false)
                    // }
                    // setTimeout(() => {
                    //     setRoundOver(false)
                    //     setWinner(false)
                    // }, 3000);
                    setRoundChange(true);
                    socketConnection.send(JSON.stringify({
                        type: "get-turn",
                        roomid: roomid,
                        username: username
                    }))

                    setTimeout(() => {
                        setRoundChange(false)
                    }, 3000);

                }
                else if(response.type == "round-winner" && response.result == "success"){
                    setRoundWinner(response.username)
                }
                else if(response.type == "game-over" && response.result == "success"){
                    setGameOver(true)
                    setwinner(response.winner)
                    setTimeout(() => {
                        // cleanup function after gameover
                        socketConnection.close();
                        router.push("/")
                        setGameOver(false)

                    }, 5000);
                }
                else if(response.type == "player-eliminated" && response.result == "success"){
                    console.log('player eliminated' , response.username)
                }
                else if(response.type == "player-guess" && response.result == "success"){
                    setTurn(false)
                }
                else if(response.type == "get-turn"){
                    setTurn(response.result)
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
                guess: Number(inputbox.value),
                username: username
            }))

            // socketConnection.send(JSON.stringify({
            //     type: "get-turn",
            //     roomid: roomid,
            //     username: username
            // }))
        }
    }

    if(gameover){
        return(
            <div>
                Game over 
                <h1>{winner} has won the game</h1>
            </div>
        )
    }

    if(roundChange === true){
        return(
            <div>
                <p>Round is getting changed</p>
                <p>{roundWinner} has won the round</p>
            </div>

        )
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
        </section>
    )
}