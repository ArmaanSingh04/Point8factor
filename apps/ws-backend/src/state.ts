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
export interface RoomStats {
    round: number,
    members: number,
    players: Player[],
    eliminatedPlayers: Player[]
}

export interface InitialRoomState {
    username: string,
    conn: WebSocket,
    host: boolean
}

export const rooms = new Map<string , InitialRoomState[]>()
export const gameState = new Map<string , RoomStats> // roomid -> room stats