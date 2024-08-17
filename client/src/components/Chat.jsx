import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Message from "./Message";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [typingStatus, setTypingStatus] = useState("");
  const socket = useRef();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const username = sessionStorage.getItem("username");
  const backendUrl = process.env.REACT_APP_BACKEND_HOST_URL;

  useEffect(() => {
    socket.current = io(backendUrl);

    socket.current.emit("join", username);

    socket.current.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.current.on("typing", (status) => {
      if (status) {
        setTypingStatus(`${status} `);
      }
    });

    socket.current.on("stop typing", () => {
      setTypingStatus("");
    });

    return () => {
      socket.current.disconnect();
    };
  }, [username, backendUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() || file) {
      const newMessage = {
        text: message,
        file,
        user: username,
        timestamp: new Date(),
      };
      socket.current.emit("chat message", newMessage);
      setMessage("");
      setFile(null);
      socket.current.emit("stop typing");
      inputRef.current.focus();
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile({
      name: uploadedFile.name,
      type: uploadedFile.type,
      data: URL.createObjectURL(uploadedFile),
    });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      socket.current.emit("typing", username);
    } else {
      socket.current.emit("stop typing");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full justify-between mt-16 pb-16 px-4">
      <div className="flex-grow overflow-y-auto">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="text-teal-500 h-5 mb-3 text-center">
        {typingStatus && `${typingStatus}  `}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex items-center space-x-2 shadow-lg">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className="flex-grow p-2 rounded-md"
          placeholder="Type your message..."
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          📎
        </label>
        <button
          onClick={sendMessage}
          className="bg-teal-600 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
