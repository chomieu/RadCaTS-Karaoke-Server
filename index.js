const express = require("express")
const { emit } = require("process")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://radcats-karaoke.herokuapp.com",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

let users = []

// Events handler
io.on("connection", socket => {
  console.log("connected")

  socket.on("joinSession", (sessionId, userId, username, pfp, pts, cb) => {
    const user = {
      session: sessionId,
      userId: userId,
      username: username,
      pfp: pfp,
      pts: pts.pts,
      socket: socket.id
    }
    console.log(user)
    socket.join(sessionId)
    console.log("join", sessionId)
    if (users.filter(u => (u.userId === userId) && (u.session === sessionId)).length === 0) {
      users.push(user)
    }
    cb(users.filter(u => (u.session === sessionId)))
  })

  socket.on("play", (sessionId, playMsg) => {
    console.log("play", sessionId)
    io.to(sessionId).emit("play", playMsg)
  })

  socket.on("points", (sessionId, userId, pts, cb) => {
    const user = users.filter(u => (u.userId === userId) && (u.session === sessionId))[0]
    user.pts = pts.pts
    cb(users.filter(u => (u.session === sessionId)))
    const newPts = users.filter(u => (u.session === sessionId))
    io.to(sessionId).emit("leaderboard", newPts)
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
