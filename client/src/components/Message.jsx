import React, { useState } from "react";
import Preview from "./Preview";

const Message = ({ message }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const username = sessionStorage.getItem("username");

  const handleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  return (
    <div
      className={`p-2 rounded-lg shadow-md mt-4 ${
        message.user === username
          ? "bg-teal-100 self-end text-right"
          : "bg-gray-100"
      }`}
      style={
        isFullScreen
          ? {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              zIndex: 50,
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }
          : {}
      }
    >
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-bold">{message.user}</span>{" "}
        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
      <div className="text-gray-800">
        {message.text && <p>{message.text}</p>}
        {message.file && (
          <div onClick={handleFullScreen} className="cursor-pointer">
            <Preview file={message.file} />
            <p>{message.file.name}</p>
          </div>
        )}
      </div>
      {isFullScreen && (
        <button
          onClick={handleFullScreen}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      )}
    </div>
  );
};

export default Message;
