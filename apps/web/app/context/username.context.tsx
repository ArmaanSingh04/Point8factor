"use client"
import React, { createContext, useState } from "react"

interface Username {
    username: string,
    setUsername: (value: string) => void
}

export const UsernameContext = createContext<Username>({
    username: "",
    setUsername: (value: string) => {}
})

export default function UsernameContextProvider({ children }: { children: React.ReactNode }){
    const [username , setUsername] = useState<string>("")

    const value = {
        username,
        setUsername: (value:string) => setUsername(value)
    }

    return <UsernameContext.Provider value={value}>{children}</UsernameContext.Provider>
}
