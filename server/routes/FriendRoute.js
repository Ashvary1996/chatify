const express = require("express");
const {
  sendFriendRequest,
  respondToFriendRequest,
  listFriends,
} = require("../controller/friendController");
const authMiddleware = require("../middleware/authMiddleware");

const route = express.Router();

route.post("/request", authMiddleware, sendFriendRequest);
route.put("/request/:id", authMiddleware, respondToFriendRequest);
route.get("/list", authMiddleware, listFriends);

module.exports = route;
