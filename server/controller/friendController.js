const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const request = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });

    await request.save();

    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const respondToFriendRequest = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: 'accepted' or 'rejected'",
      });
    }

    const request = await FriendRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (status === "accepted") {
      const sender = await User.findById(request.sender);
      const receiver = await User.findById(request.receiver);

      if (!sender.friends.includes(receiver._id)) {
        sender.friends.push(receiver._id);
        await sender.save();
      }
      if (!receiver.friends.includes(sender._id)) {
        receiver.friends.push(sender._id);
        await receiver.save();
      }
    }

    await FriendRequest.findByIdAndDelete(request._id);

    res.status(200).json({ message: `Friend request ${status} and removed` });
  } catch (error) {
    console.error("Error responding to friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const listFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "name email isOnline profileImage phoneNumber"
    );
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const fetchFriendRequests = async (req, res) => {
  try {
    const myId = req.user.id;

    const requestsList = await FriendRequest.find({
      receiver: myId,
    });

    res.status(200).json({
      totalRequests: requestsList.length,
      requestsList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  sendFriendRequest,
  respondToFriendRequest,
  listFriends,
  fetchFriendRequests,
};
