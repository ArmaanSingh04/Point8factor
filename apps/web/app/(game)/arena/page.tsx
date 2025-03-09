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
    useEffect(() => {
        if(!socketConnection){
            return router.push('/')
        }
        socketConnection.onmessage = (message) => {
            const response = JSON.parse(message.data)

            if(response.type == "receive-message"){
                setChats((prev) => [...prev , response.message])
            }
        }

    })

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

            <h1>YOUR ROOM CHATS</h1>
            {chats.map((chat , index) =>  <div key={index}>{chat}</div>)}
        </div>
    )
}