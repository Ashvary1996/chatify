const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_HOST_URL, "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: [process.env.CLIENT_HOST_URL, "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const port = process.env.PORT || 5000;
const users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("user update", Object.values(users));
    io.emit("chat message", {
      text: `${username} has joined the chat.`,
      user: "System",
      timestamp: new Date(),
    });
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", `${username} is typing...`);
  });

  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing");
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("chat message", {
        text: `${username} has left the chat.`,
        user: "System",
        timestamp: new Date(),
      });
      delete users[socket.id];
      io.emit("user update", Object.values(users));
    }
    console.log(`${username} disconnected`);
  });
});

app.get("/status", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
