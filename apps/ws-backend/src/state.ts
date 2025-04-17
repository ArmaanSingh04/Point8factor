import { WebSocket } from "ws"

export interface Player {
    id: number
    username: string,
    guess: number,
    score: number,
    conn: WebSocket,
    eliminated: boolean,
    turn: boolean
}
export interface Chat {
    id: number,
    username: string,
    message: string
}
export interface RoomStats {
    round: number,
    members: number,
    players: Player[],
    eliminatedPlayers: Player[]
    chat: Chat[]
}

export interface InitialRoomState {
    username: string,
    conn: WebSocket,
    host: boolean
}

export interface Analytics {
    rooms: number,
    startedgames: number,
    endedgames: number,
    messages: number,
    players: number
}

export const rooms = new Map<string , InitialRoomState[]>()
export const gameState = new Map<string , RoomStats> // roomid -> room stats

// for analytics
export const appAnalytics : Analytics = {
    rooms: 0,
    startedgames: 0,
    endedgames: 0,
    messages: 0,
    players: 0
}