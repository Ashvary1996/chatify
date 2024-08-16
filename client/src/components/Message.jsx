import React from "react";
import Preview from "./Preview";

const Message = ({ message }) => {
  return (
    <div className="bg-gray-100 p-2 rounded-lg shadow-md">
      <div className="text-sm text-gray-600 mb-1">
        <span className="font-bold">{message.user}</span>{" "}
        <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
      <div className="text-gray-800">
        {message.text && <p>{message.text}</p>}
        {message.file && <Preview file={message.file} />}
      </div>
    </div>
  );
};

export default Message;
