import React, { useState, useEffect } from "react";
import Message from "./Message";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server with ID:", socket.id);
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.off("connect");
      socket.off("chat message");
      socket.off("disconnect");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message || file) {
      const msg = {
        text: message,
        file: file
          ? {
              name: file.name,
              type: file.type,
              data: URL.createObjectURL(file),
            }
          : null,
        timestamp: new Date(),
        user: "User1",
      };
      socket.emit("chat message", msg);
      setMessage("");
      setFile(null);
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
      <div className="h-96 overflow-y-scroll p-2 space-y-2 border-b">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow p-2 border rounded-md"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
