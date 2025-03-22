"use client"
import { useContext, useEffect, useState } from "react"
import { RoomContext } from "../../context/room.context"
import { UsernameContext } from "../../context/username.context"
import { socketContext } from "../../context/socket.context"
import { useRouter } from "next/navigation"

export default function Arena() {
    const { roomid } = useContext(RoomContext)
    const { username } = useContext(UsernameContext)
    const { socketConnection } = useContext(socketContext)
    const router = useRouter()

    const [message , setmessage] = useState("")
    const [chats , setChats] = useState<string[]>([])
    const [players , setPlayers] = useState<{username: string , host: boolean}[]>([])
    console.log(players)
    useEffect(() => {
        if(!socketConnection){
            return router.push('/')
        }
        socketConnection.send(JSON.stringify({
            type: "get-room-players",
            roomid: roomid
        }))
        socketConnection.onmessage = (message) => {
            const response = JSON.parse(message.data)

            if(response.type == "receive-message"){
                setChats((prev) => [...prev , response.message])
            }
            else if(response.type == "get-room-players"){
                setPlayers(response.players)
            }
            else if(response.type == "player-joined"){
                setPlayers((prev) => [...prev , { username: response.username , host: response.host}])
            }
            else if(response.type == "game-has-begin"){
                router.push('/game')
            }
        }

    },[])

    const sendMesage = () => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "send-message",
                message: message,
                roomid
            }))
            setmessage("")
        }
    }

    const startGame = () => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "start-game",
                roomid: roomid
            }))
        }
    }

    return(
        <div>
            <p>{roomid} for {username}</p>
            <input type="text" onChange={(e) => setmessage(e.target.value)} value={message}/>
            <button onClick={sendMesage}>Send message</button>
            {players.map((player,index) => <div key={index}>{player.username}</div>)}
            <h1>YOUR ROOM CHATS</h1>
            {
                players.map((player , index) => {
                    if(player.host && player.username == username){
                        return <button key={index} onClick={startGame}>Start Game</button>
                    }
                })
            }
            {chats.map((chat , index) =>  <div key={index}>{chat}</div>)}
        </div>
    )
}