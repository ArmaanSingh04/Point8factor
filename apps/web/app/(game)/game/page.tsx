"use client"

import { useContext, useEffect, useState } from "react"
import { UsernameContext } from "../../context/username.context"
import { RoomContext } from "../../context/room.context"
import { socketContext } from "../../context/socket.context"

export default function Game() {
    const { username } = useContext(UsernameContext)
    const { roomid } = useContext(RoomContext)
    const {socketConnection} = useContext(socketContext)
    const [players , setPlayers] = useState<{username: string}[]>([])
    

    useEffect(() => {
        if(socketConnection){
            socketConnection.send(JSON.stringify({
                type: "get-room-players",
                roomid: roomid
            }))
            socketConnection.onmessage = (message) => {
                const response = JSON.parse(message.data);

                if(response.type == "get-room-players"){
                    setPlayers(response.players)
                }
            }
        }

        
    }, [])
    return (
        <div>{players.map((player , index) => <div key={index}>{player.username}</div>)}</div>
    )
}