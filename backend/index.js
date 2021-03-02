const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on("connection", socket => {
  console.log("connected")
  socket.on("play", playMsg => {
    io.emit("play", playMsg)
  })
})

server.listen(3001, () => {
  console.log("listening to localhost 3001")
})

