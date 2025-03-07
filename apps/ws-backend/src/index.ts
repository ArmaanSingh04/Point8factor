import { WebSocketServer } from "ws";
import express from "express"

const app = express()

const httpServer = app.listen(8000, () => {
    console.log(`Websocket express server ready`)
})

const ws = new WebSocketServer({ server: httpServer })

ws.on("connection" , function connection(ws){

    ws.on("message" , function message(data){
        console.log(`Received ${data}`)
    })

    ws.send("You are connected to the websocker server")

})