const express = require("express");
const connectToDb = require("./dbConfig");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
///////////////
const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

//////////////
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:"http://localhost:3000",credentials:true}));

app.use("/api/user", require("./routes/UserRoute"));
app.use("/api/friend", require("./routes/FriendRoute"));
app.use("/api/chat", require("./routes/ChatRoute"));

// WebSocket
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    const { sender, receiver, content } = data;
    try {
      const newMessage = new Message({ sender, receiver, content });
      await newMessage.save();
      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
///////////////
server.listen(port, () => {
  console.log(`Server is up at port: ${port}`);
});

connectToDb();
