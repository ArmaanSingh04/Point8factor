"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { UsernameContext } from "../../context/username.context"
import { RoomContext } from "../../context/room.context"
import { socketContext } from "../../context/socket.context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import RoundChange from "../../components/RoundChange"
import GameOver from "../../components/GameOver"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

export default function Game() {
    const { username } = useContext(UsernameContext)
    const { roomid } = useContext(RoomContext)
    const { socketConnection } = useContext(socketContext)
    const [ players , setPlayers ] = useState<{username: string , turn:boolean , score:number , eliminated: boolean}[]>([])
    const [members , setMembers] = useState<number>();
    const router = useRouter()

    const [ turn , setTurn ] = useState<boolean>(false)
    const [ roundWinner , setRoundWinner ] = useState<string>()
    const [roundChange , setRoundChange] = useState<boolean>(false)
    const [winner , setwinner] = useState<string>()
    const [gameover , setGameOver] = useState<boolean>(false)
    const [playerGuess , setPlayerGuess] = useState<number>()
    const [roundResults , setRoundResults] = useState<{username: string , guess: number}[]>([]);
    const [message , setMessage] = useState<string>("")
    const [chat , setChat] = useState<{id: number , username: string , message: string}[]>([])

    const getPlayers = () => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "get-game-players",
                roomid: roomid
            }))
        }
    }

    const getRoomMembers = () => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "get-room-members",
                roomid: roomid
            }))
        }
    }
    
    const getChat = () => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "get-room-chat",
                roomid
            }))
        }
    }
    
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

    useEffect(() => {
        const notificationAudio = new Audio("/assets/notification.mp3")
        const submitNotificationAudio = new Audio("/assets/submitnotification.mp3")

        const playMessageSound = () => {
            if(notificationAudio){
                notificationAudio.play().catch((e) => {
                    console.error("Error playing sound:", e);
                });
            }
            
        }
        const playSubmitNotificationSound = () => {
            if(submitNotificationAudio) {
                submitNotificationAudio.play().catch((e) => {
                    console.error("Error playing sound:", e);
                });
            }
        }

        if(socketConnection){
            getPlayers()
            socketConnection.send(JSON.stringify({
                type: "get-turn",
                roomid: roomid,
                username: username
            }))
            getRoomMembers()
            socketConnection.onmessage = (message) => {
                const response = JSON.parse(message.data);

                if(response.type == "get-game-players"){
                    setPlayers(response.players)
                }
                else if(response.type == "round-change"){
                    setRoundChange(true);
                    socketConnection.send(JSON.stringify({
                        type: "get-turn",
                        roomid: roomid,
                        username: username
                    }))
                    socketConnection.send(JSON.stringify({
                        type: "get-player-guess",
                        roomid: roomid
                    }))
                    setTimeout(() => {
                        setRoundChange(false)
                        setRoundResults([])
                    }, (roundResults.length*0.5 + 2.5 + 5.5 + 10) * 1000);

                }
                else if(response.type == "change-round" && response.result == "success") setRoundChange(false)
                else if(response.type == "get-player-guess" && response.result == "success"){
                    setRoundResults(response.data)
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

                    }, 8000);
                }
                else if(response.type == "player-eliminated" && response.result == "success"){
                    console.log('player eliminated' , response.username)
                    getPlayers()
                }
                else if(response.type == "player-guess" && response.result == "success"){
                    setTurn(false)
                }
                else if(response.type == "get-turn"){
                    setTurn(response.result)
                }
                else if(response.type == "player-left-from-game"){
                    console.log('player left received')
                    toast(`Player left ${response.username}`)
                    getPlayers()
                    getRoomMembers()
                }
                else if(response.type == "a-player-submit"){
                    playSubmitNotificationSound()
                    getPlayers()
                }
                else if(response.type == "room-members"){
                    setMembers(response.data)
                }
                else if(response.type == "new-chat"){
                    playMessageSound()
                    getChat()
                }
                else if(response.type == "room-chat"){
                    setChat(response.data)
                }
            }
            window.onbeforeunload = function () {
                socketConnection.send(JSON.stringify({
                    type: "leave-game",
                    username: username,
                    roomid: roomid
                }))
                socketConnection.close()
            }
        }
    }, [])

    const guessHandler = (e: any) =>{
        if(socketConnection){
            // const inputbox = document.getElementById('guess-input') as HTMLInputElement
            socketConnection.send(JSON.stringify({
                type: "player-guess",
                roomid: roomid,
                guess: Number(playerGuess),
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
        return <GameOver winner={winner} />
    }

    if(roundChange === true){
        return <RoundChange results={roundResults} winner={roundWinner}/>
    }


    const generateNumbers = () => {
        let arr= []
        for (let index = 1; index <= 100; index++) {
            arr.push(<Button 
                id={`${index}`} 
                variant="secondary" 
                onClick={() => setPlayerGuess(index)} 
                className={`${playerGuess == index? "bg-green-500 text-white": ""} cursor-pointer`}
                key={index}>
                    {index}
            </Button>);
        }
        return arr;
    }

    const submitMessage = () => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "post-room-chat",
                roomid,
                username,
                message
            }))
            setMessage("")
        }
    }

    
    return (
        <section className="w-screen h-screen flex justify-center items-center gap-4">
            <div className="h-full flex flex-col justify-center min-w-1/2">
                <div className="min-w-1/2 flex justify-end">
                    {players.map((player , index) => {
                        if(player.username == username){
                            return <div className="text-2xl" key={index}>{player.score} / {members}</div>
                        }
                    }
                    )}
                </div>
                <div className="min-w-1/2 min-h-3/4 flex border-white border-2 rounded">
                    <div className=" border-r-2 border-white min-w-1/4 gap-2 flex flex-col">
                        {players.map((player , index) => 
                            <div className={`w-full border-2 border-white ${(player.turn == false && player.eliminated == false)?"bg-green-500":""} ${(player.turn == false && player.eliminated == true)? "bg-red-500" : ""} rounded p-3 text-center text-xl`} key={index}>{player.username} {player.score}/{members}</div>
                        )}
                    </div>

                    <div className="w-full">
                        {turn && 
                            <div className="flex gap-2 flex-col p-3 justify-between h-full">
                                <div className="grid gap-2 grid-cols-10">{generateNumbers()}</div>
                                <Button className="bg-blue-500 w-full hover:bg-blue-600 cursor-pointer" onClick={(e) => guessHandler(e)}>Submit guess</Button>
                            </div>
                        }

                    {players.map((player , index) => {
                        if(player.username == username && player.turn == false && player.eliminated == false){
                            return <div className="flex p-3 justify-center items-center h-full" key={index}>
                                    <p className="flex bg-amber-700 text-white p-5 rounded">Let other Players Guess </p>
                                </div>
                        }
                        else if(player.username == username && player.turn ==false && player.eliminated == true){
                            return <div className="flex p-3 justify-center items-center h-full" key={index}>
                                    <p className="flex bg-red-500 text-white p-5 rounded">You have been eliminated </p>
                                    </div>
                        }
                    }
                    )}

                    </div>
                </div>
            </div>

            <div className="h-full flex flex-col justify-center w-1/4">
                
                <div>
                    <p className="text-2xl">Chat here !</p>
                </div>
                
                <div className="h-3/4 border-2 border-white rounded p-2 flex flex-col justify-between">
                    <div className="overflow-y-auto overflow-x-hidden">
                        {chat.map((temp) => (<p key={temp.id} className="border-b-2 border-white  p-2">{temp.username} : {temp.message}</p>))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="flex">
                        <Input placeholder="Enter your message" value={message} onChange={e => setMessage(e.target.value)}/>
                        <Button className="bg-blue-500" onClick={submitMessage}>Send</Button>
                    </div>
                </div>

            </div>
            
        </section>
    )
}