const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {
  cors: {
    // origin: "http://radcats-karaoke-app.herokuapp.com/liveSession",
    // origin: "http://radcats-karaoke-ui.herokuapp.com/api/session/:id",
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

let users = []

// Events handler
io.on("connection", socket => {
  console.log("connected")

  socket.on("joinSession", (sessionId, userId, cb) => {
    const user = {
      sessionId: sessionId,
      userId: userId,
      socketId: socket.id
    }
    console.log("join", sessionId)
    socket.join(sessionId)
    users.push(user)
    cb(users)
  })

  socket.on("start", (sessionId, playMsg) => {
    console.log("start", sessionId)
    io.to(sessionId).emit("play", playMsg)
  })

  socket.on("disconnect", () => {
    users = users.filter(user => user.id !== socket.id)
    io.emit("newMembers", users)
  })
})

// Server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
