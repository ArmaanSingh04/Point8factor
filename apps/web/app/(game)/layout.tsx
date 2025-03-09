"use client"
import { useContext, useEffect } from "react"
import { RoomContext } from "../context/room.context"
import { useRouter } from "next/navigation"
import { UsernameContext } from "../context/username.context"
import { SuiteContext } from "node:test"
import { socketContext } from "../context/socket.context"

export default function GameLayout({ children } : { children: React.ReactNode }){
    const {roomid} = useContext(RoomContext)
    const {username} = useContext(UsernameContext)  
    const {socketConnection} = useContext(socketContext)

    const router = useRouter()

    useEffect(() => {
        if(roomid == "" || username=="" || !socketConnection){
            return router.push("/")
        }
    }, [])
        
    return <div>{children}</div>
}