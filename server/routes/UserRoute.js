const express = require("express");
const { signUp, logIn, me, updateProfile, searchUsers, allUsers, getUserById } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const route = express.Router();

route.post("/signup", signUp);
route.post("/login", logIn);
route.get("/me", authMiddleware, me);
route.put("/update", authMiddleware, updateProfile);
route.get("/search", authMiddleware, searchUsers);
route.get("/all_users", allUsers);
route.post("/get_user",authMiddleware, getUserById);

module.exports = route;
