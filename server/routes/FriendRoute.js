const express = require("express");
const {
  sendFriendRequest,
  respondToFriendRequest,
  listFriends,
  fetchFriendRequests,
} = require("../controller/friendController");
const authMiddleware = require("../middleware/authMiddleware");

const route = express.Router();

route.post("/send_request", authMiddleware, sendFriendRequest);
route.get("/fetch_requests", authMiddleware, fetchFriendRequests);
route.put("/request/:id", authMiddleware, respondToFriendRequest);
route.get("/list", authMiddleware, listFriends);

module.exports = route;
