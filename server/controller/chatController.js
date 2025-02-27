const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = new Message({
      sender: req.user.id,
      receiver: receiverId,
      message,
    });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: id },
        { sender: id, receiver: req.user.id },
      ],
    }).sort({ timeStamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const myallMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id,  },
        { receiver:  req.user.id,},
      ],
    }).sort({ timeStamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, {
      isRead: true,
    }).select({ sender: 1, receiver: 1, message: 1 });
    res.status(200).json({ status: "Message marked as read", message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getMessages, markMessageAsRead,myallMessages };
