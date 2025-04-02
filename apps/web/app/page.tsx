"use client"
import { prismaClient } from "@repo/db/client"
import { useContext, useEffect, useState } from "react";
import { socketContext } from "./context/socket.context";
import { useRouter } from "next/navigation";
import { RoomContext } from "./context/room.context";
import { UsernameContext } from "./context/username.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Home() {
  const { socketConnection, setSocketConnection } = useContext(socketContext)
  const [inputId , setInputId] = useState("")
  const router = useRouter()
  
  const { setRoomId } = useContext(RoomContext)
  const { username, setUsername } = useContext(UsernameContext)

  const URL = process.env.NEXT_PUBLIC_WS_URL? `${process.env.NEXT_PUBLIC_WS_URL}` : "ws://localhost:8000"

  useEffect(() => {
    const newSocket = new WebSocket(URL)

    newSocket.onopen = () => {
      console.log('Connection with the websocket established')
    }

    newSocket.onmessage = (message:any) => {
      const response = JSON.parse(message.data)
      console.log(response)
      if(response.type == "create-room"  && response.result == "success"){
        setRoomId(response.roomid)
        router.push('/arena')
      }
      else if(response.type == "join-room"  && response.result == "success"){
        setRoomId(response.roomid)
        router.push('/arena')
      }
    }
    setSocketConnection(newSocket)
  } , [])

  const createRoom = () => {
    if(socketConnection){
      if(username === ""){
        toast.error("Username cannot be empty")
        return
      }
      socketConnection.send(JSON.stringify({
        type: "create-room",
        username: username
      }))
    }
  }

  const joinRoom = () => {
    if(socketConnection){
      if(username == ""){
        toast.error("Username cannot be empty")
        return;
      }
      if(inputId == ""){
        toast.error("Enter roomid to join a room")
        return;
      }
      socketConnection.send(JSON.stringify({
        type: "join-room",
        roomid: inputId,
        username: username
      }))
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <div className="flex flex-col w-1/4 h-1/2 gap-3 justify-center items-center">
        <Input type="text" placeholder="Enter a username" onChange={(e) => setUsername(e.target.value)} value={username}/>
        <Input type="text" placeholder="Enter room id to join" onChange={(e) => setInputId(e.target.value)} value={inputId}/>
        <Button variant="secondary" className="cursor-pointer p-4 w-full"  onClick={joinRoom}>Join room</Button>
        <Button className="bg-blue-400 p-4 cursor-pointer hover:bg-blue-500 w-full" onClick={createRoom}>Create room</Button>
      </div>
    </div>
  );
}
