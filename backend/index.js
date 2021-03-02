const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://radcats-karaoke.herokuapp.com/api/session/:id",
    // origin: "http://radcats-karaoke-ui.herokuapp.com/api/session/:id",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Events handler
io.on("connection", socket => {
  console.log("connected")
  socket.on("play", playMsg => {
    io.emit("play", playMsg)
  })
})

// Server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

