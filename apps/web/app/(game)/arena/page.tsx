"use client"
import { useContext, useEffect, useState } from "react"
import { RoomContext } from "../../context/room.context"
import { UsernameContext } from "../../context/username.context"
import SocketProvider, { socketContext } from "../../context/socket.context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Arena() {
    const { roomid } = useContext(RoomContext)
    const { username } = useContext(UsernameContext)
    const { socketConnection } = useContext(socketContext)
    const router = useRouter()

    const [message, setmessage] = useState("")
    const [chats, setChats] = useState<string[]>([])
    const [players, setPlayers] = useState<{ username: string, host: boolean }[]>([])

    const notifyPlayerJoined = (name: string) => {
        toast(`Player joined ${name}`)
    }

    const getPlayers = () => {
        if (socketConnection) {
            socketConnection.send(JSON.stringify({
                type: "get-room-players",
                roomid: roomid
            }))
        }
    }
    useEffect(() => {

        if (!socketConnection) {
            return router.push('/')
        }
        getPlayers()
        socketConnection.onmessage = (message) => {
            const response = JSON.parse(message.data)

            if (response.type == "receive-message") {
                setChats((prev) => [...prev, response.message])
            }
            else if (response.type == "get-room-players") {
                setPlayers(response.players)
            }
            else if (response.type == "player-joined") {
                notifyPlayerJoined(response.username)
                setPlayers((prev) => [...prev, { username: response.username, host: response.host }])
            }
            else if (response.type == "player-left") {
                toast(`Player left ${response.username}`)
                getPlayers()
            }
            else if (response.type == "game-has-begin") {
                router.push('/game')
            }
        }

        window.onbeforeunload = function () {
            socketConnection.send(JSON.stringify({
                type: "leave-room",
                username: username,
                roomid: roomid
            }))
            socketConnection.close()
        }

        // return () => {
        //     document.removeEventListener("beforeunload", handleDisconnect);
        // };
    }, [])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(roomid)
        toast("Copied to clipboard")
    }

    const startGame = () => {
        if (socketConnection) {
            socketConnection.send(JSON.stringify({
                type: "start-game",
                roomid: roomid
            }))
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-center items-stretch gap-2">
                    <p className="w-full bg-white text-black rounded p-2 text-center">{roomid}</p>
                    <Button
                        onClick={handleCopy}
                        className="bg-orange-600 cursor-pointer hover:bg-orange-700"
                        variant="default"
                    >
                        Copy
                    </Button>
                </div>

                <div className="flex flex-col gap-2 text-center">
                    {players.map((player, index) => (
                        <div
                            key={index}
                            className={`border-2 border-white p-3 text-lg rounded ${player.host ? "bg-green-200 text-black" : ""
                                }`}
                        >
                            {player.username}
                            {player.host ? " (host)" : ""}
                            {player.username === username ? " (me)" : ""}
                        </div>
                    ))}
                </div>

                <div>
                    {players.map((player, index) => {
                        if (player.host && player.username === username) {
                            return (
                                <Button
                                    key={index}
                                    className="bg-blue-500 w-full cursor-pointer hover:bg-blue-600"
                                    onClick={startGame}
                                >
                                    Start Game
                                </Button>
                            );
                        } else if (!player.host && player.username === username) {
                            return (
                                <Button
                                    key={index}
                                    className="bg-red-600 w-full hover:bg-red-700"
                                >
                                    Wait for Host to start the game!
                                </Button>
                            );
                        }
                    })}
                </div>
            </div>
        </div>

    )
}