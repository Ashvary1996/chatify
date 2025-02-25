const express = require("express");
const {
  sendMessage,
  getMessages,
  markMessageAsRead,
} = require("../controller/chatController");
const authMiddleware = require("../middleware/authMiddleware");

const route = express.Router();

route.post("/send", authMiddleware, sendMessage);
route.get("/messages/:id", authMiddleware, getMessages);
route.put("/read/:id", authMiddleware, markMessageAsRead);
module.exports = route;
