"use client"
import React, { createContext, useState } from "react"

interface Room {
    roomid: string,
    setRoomId: (value: string) => void
}

export const RoomContext = createContext<Room>({
    roomid: "",
    setRoomId: (value: string) => {}
})

export default function RoomContextProvider({ children }: {children: React.ReactNode}){
    const [roomid , setRoomid] = useState<string>("")

    const value = {
        roomid,
        setRoomId: (value:string) => setRoomid(value)
    }

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}
