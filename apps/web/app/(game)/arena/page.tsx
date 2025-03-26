"use client"
import { useContext, useEffect, useState } from "react"
import { RoomContext } from "../../context/room.context"
import { UsernameContext } from "../../context/username.context"
import { socketContext } from "../../context/socket.context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Arena() {
    const { roomid } = useContext(RoomContext)
    const { username } = useContext(UsernameContext)
    const { socketConnection } = useContext(socketContext)
    const router = useRouter()

    const [message , setmessage] = useState("")
    const [chats , setChats] = useState<string[]>([])
    const [players , setPlayers] = useState<{username: string , host: boolean}[]>([])
    
    const notifyPlayerJoined = (name: string) => {
        toast(`Player joined ${name}`)
    }

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
                notifyPlayerJoined(response.username)
                setPlayers((prev) => [...prev , { username: response.username , host: response.host}])
            }
            else if(response.type == "game-has-begin"){
                router.push('/game')
            }
        }

    },[])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(roomid)
        toast("Copied to clipboard")
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
        <div className="w-screen h-screen flex justify-center items-center flex-col">
            <div className="w-1/4 flex flex-col gap-2">
                <div className="flex justify-center items-center">
                    <p className=" w-full bg-white text-black rounded p-2">{roomid}</p>
                    <Button onClick={handleCopy} className="bg-orange-600 cursor-pointer hover:bg-orange-700 h-full" variant="default">Copy</Button>
                </div>
                <div className="flex flex-col min-w-1/4 text-center gap-2">
                    {players.map((player,index) => 
                        <div className={`border-2 border-white p-3 text-2xl rounded ${player.host? `bg-green-200 text-black`: ``}`} key={index}>{player.username}{player.host? `(host)`: ""}{player.username == username? `(me)`: ""}</div>
                    )}
                </div>
                <div>
                {
                    players.map((player , index) => {
                        if(player.host && player.username == username){
                            return <Button key={index} className="bg-blue-500 w-full cursor-pointer hover:bg-blue-600" onClick={startGame}>Start Game</Button>
                        }
                        else if(!player.host && player.username == username){
                            return <Button key={index} className="bg-red-600 w-full hover:bg-red-600">Wait for Host to start the game !</Button>
                        }
                    })
                }
                
                </div>
            </div>
        </div>
    )
}