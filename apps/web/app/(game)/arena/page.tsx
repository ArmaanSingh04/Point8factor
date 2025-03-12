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
    const [players , setPlayers] = useState<{username: string}[]>([])
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
                console.log("response encountered")
                setPlayers(response.players)
            }
            else if(response.type == "player-joined"){
                setPlayers((prev) => [...prev , { username: response.username }])
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

    return(
        <div>
            <p>{roomid} for {username}</p>
            <input type="text" onChange={(e) => setmessage(e.target.value)} value={message}/>
            <button onClick={sendMesage}>Send message</button>
            {players.map((player,index) => <div key={index}>{player.username}</div>)}
            <h1>YOUR ROOM CHATS</h1>
            {chats.map((chat , index) =>  <div key={index}>{chat}</div>)}
        </div>
    )
}