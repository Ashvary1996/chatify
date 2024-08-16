import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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
    if (message.trim()) {
      const msg = {
        text: message,
        timestamp: new Date(),
        user: Math.floor(Math.random() * 2 + 1),
      };
      socket.emit("chat message", msg);
      setMessage("");
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
      <div className="h-96 overflow-y-scroll p-2 space-y-2 border-b">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg shadow-md ${
              msg.user === 2 ? "text-right" : "text-left"
            }`}
          >
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-bold">{msg.user}</span>{" "}
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-gray-800">{msg.text && <p>{msg.text}</p>}</div>
          </div>
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
        <button
          type="submit"
          className="bg-teal-500 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
