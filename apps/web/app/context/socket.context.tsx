"use client"
import React, { createContext, useState } from "react"

interface Socket {
    socketConnection: null | WebSocket,
    setSocketConnection: (value: WebSocket) => void
}

export const socketContext = createContext<Socket>({
    socketConnection: null,
    setSocketConnection: () => {}
})

export default function SocketProvider({ children }: {children: React.ReactNode}){
    const [socket , setSocket] = useState<WebSocket | null>(null)

    const value = {
        socketConnection: socket,
        setSocketConnection: (value:WebSocket) => setSocket(value)
    }

    return <socketContext.Provider value={value}>{children}</socketContext.Provider>
}
