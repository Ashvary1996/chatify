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

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Allowed values: 'accepted', 'rejected', 'pending'",
      });
    }

    const request = await FriendRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const sender = await User.findById(request.sender);
      const receiver = await User.findById(request.receiver);

      if (
        sender.friends.includes(request.receiver) ||
        receiver.friends.includes(request.sender)
      ) {
        return res.status(400).json({ message: "Users are already friends" });
      }
      sender.friends.push(request.receiver);
      receiver.friends.push(request.sender);

      await sender.save();
      await receiver.save();
    }

    res.status(200).json({ message: `Friend request ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const listFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "firstName lastName email"
    );
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendFriendRequest, respondToFriendRequest, listFriends };
