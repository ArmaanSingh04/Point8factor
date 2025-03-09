"use client"
import { prismaClient } from "@repo/db/client"
import { useContext, useEffect, useState } from "react";
import { socketContext } from "./context/socket.context";

export default function Home() {
  const { socketConnection, setSocketConnection } = useContext(socketContext)
  const [inputId , setInputId] = useState("")

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8000")

    newSocket.onopen = () => {
      console.log('Connection with the websocket established')
    }

    newSocket.onmessage = (message:any) => {
      const response = JSON.parse(message.data)
      console.log(response)
      if(response.type == "create-room"  && response.result == "success"){
        console.log('room created' , response.roomid)
      }
      else if(response.type == "join-room"  && response.result == "success"){
        console.log('room joined' , response.roomid)
      }
    }
    setSocketConnection(newSocket)
  } , [])

  const createRoom = () => {
    if(socketConnection){
      socketConnection.send(JSON.stringify({
        type: "create-room"
      }))
    }
  }

  const joinRoom = () => {
    if(socketConnection){
      socketConnection.send(JSON.stringify({
        type: "join-room",
        roomid: inputId
      }))
    }
  }

  return (
    <div>
      <input type="text" placeholder="Enter a username"/>
      <input type="text" placeholder="Enter room id to join" onChange={(e) => setInputId(e.target.value)} value={inputId}/>
      <button onClick={joinRoom}>Join room</button>
      <button onClick={createRoom}>Create room</button>
    </div>
  );
}
