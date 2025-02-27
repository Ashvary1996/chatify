const express = require("express");
const connectToDb = require("./dbConfig");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");
const Message = require("./models/Message");
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
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api/user", require("./routes/UserRoute"));
app.use("/api/friend", require("./routes/FriendRoute"));
app.use("/api/chat", require("./routes/ChatRoute"));
const users = new Map();
let myuserID = null;
// WebSocket
io.on("connection", (socket) => {
  // console.log("A User connected:", socket.id);
  //
  socket.on("user online", async (userId) => {
    myuserID = userId;
    users.set(socket.id, userId); // Track socket ID and user ID
    socket.join(userId); // Join room based on userId

    const user = await User.findByIdAndUpdate(
      userId,
      { isOnline: true },
      { new: true }
    );
    console.log(`User ${user.name} is online`);
  });
  //
  socket.on("sendMessage", async (messageData) => {
    console.log("data of send messsage from io server", messageData);

    try {
      if (
        !messageData.sender ||
        !messageData.receiver ||
        !messageData.message
      ) {
        throw new Error("Invalid message data");
      }

      const newMessage = new Message({
        sender: messageData.sender,
        receiver: messageData.receiver,
        message: messageData.message,
      });

      const savedMessage = await newMessage.save();

      // Emit the saved message to the receiver
      io.emit("receiveMessage", savedMessage);
      io.to(messageData.sender).emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", async (did) => {
    // Find the user by socket ID and set isOnline to false
    const user = await User.findOne({ _id: myuserID });
    console.log(did, "user", user, socket.id);

    if (user) {
      let user = await User.findByIdAndUpdate(
        myuserID,
        { isOnline: false },
        { new: true }
      );
      console.log(`User ${(user._id, user.name)} is now offline`);
      users.delete(socket.id);
    }
    console.log(did, "user disconnected:", socket.id);
  });
});
///////////////
server.listen(port, () => {
  console.log(`Server is up at port: ${port}`);
});

connectToDb();
