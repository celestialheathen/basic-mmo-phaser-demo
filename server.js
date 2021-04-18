const http = require("http") // Load in http module
const app = require("express")() // Load in express module
const express = require("express") 

// localhost:5500 is where the game page will be served
// It will create a socket connect to 9090
app.use('/js', express.static(__dirname + '/js'))
app.use('/assets', express.static(__dirname + '/assets'))
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"))

// app.listen(5500, ()=> console.log("Client Port, listening.. on 5500"))

const websocketServer = require("websocket").server
const httpServer = http.createServer()

httpServer.listen(process.env.PORT || 9090, () => console.log("Server Port, listening on ", httpServer.address().port))


// Store a list of all the players
let players = []


const wsServer = new websocketServer( {
    "httpServer": httpServer
})

wsServer.on("request", request => {
    // A connection
    const connection = request.accept(null, request.origin)
    connection.on("open", () => console.log("open!"))

    // Whenever a connection from a client is closed
    connection.on("close", () => {
        console.log("User disconnected:", playerId)
        players.forEach (player => {
            if (player.playerId !== playerId) {
                const payLoad = {
                    "method": "disconnect",
                    "playerId": playerId
                }
            player.connection.send(JSON.stringify(payLoad))
            }
        })
        players = players.filter(player => player.playerId !== playerId)
    })

    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)

        // Broadcast the positions of other players to current player
        if (result.method === "currentPlayers") {

            // console.log(players)
            players.forEach (player => {
                if (player.playerId !== playerId) {
                    const payLoad = {
                        "method": "currentPlayers",
                        "playerId": player.playerId,
                        "x": player.x,
                        "y": player.y
                }
                connection.send(JSON.stringify(payLoad))
            }
        })

    }

        // Broadcast any new movement to every other players except current 
        if (result.method === "movement") {
            const playerId = result.playerId
            const x = result.x 
            const y = result.y 
            const payLoad = {
                "currentFacing": result.currentFacing,
                "method": "updateLocation",
                "playerId": playerId,
                "x": x,
                "y": y
            }
            players.forEach(player => {
                if (player.playerId !== result.playerId) {
                    player.connection.send(JSON.stringify(payLoad))
                } else {
                    player.x = x
                    player.y = y
                }
            })
            // console.log("Moved, x: ", x)
            // console.log("Moved, y: ", y)
        }

        if (result.method === "chat") {
            const playerId = result.playerId 
            const body = result.body 
            const x = result.x
            const y = result.y
            const payLoad = {
                "method": "receiveChat",
                "playerId": playerId,
                "body": body,
                "x": x,
                "y": y
            }
            players.forEach(player => {
                if(player.playerId !== result.playerId) {
                    player.connection.send(JSON.stringify(payLoad))
                }
            })
        }

    })


    // Generate a random clientId and assign it to this client, assign a connection property of connection
    const playerId = gpid()
    const x = randomX()
    const y = randomY()

    playerInfo = {
        "connection": connection,
        "playerId": playerId,
        "x": x,
        "y": y
    }


    // The payload to be sent back to the client
    const payLoad = {
        "method": "connect",
        "playerId": playerId,
        "x": x,
        "y": y
    }

    // Send back the payload to the client and set its initial position
    connection.send(JSON.stringify(payLoad))

    // Send newly connected player's info to all existing players
    players.forEach (player => {
        if (player.playerId != playerId) {
            const payLoad = {
                "method": "newPlayer",
                "playerId": playerId,
                "x": x,
                "y": y
            }
            player.connection.send(JSON.stringify(payLoad))
        }
    })


    players.push(playerInfo)

})


// Generate a random user id
const gpid=()=> {
    const s4=()=> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);     
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
  }


// Generate random x, y coordinates for any player
const randomX = () => Math.floor(Math.random() * 900) + 50
const randomY = () => Math.floor(Math.random() * 600) + 50