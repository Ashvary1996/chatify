import axios from "axios";
import React, { useState, useEffect } from "react";
import { MdSend } from "react-icons/md";

function MainChatScreen({ friend }) {
  const [seeUserDetail, setSeeUserDetail] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  console.log("messsege screen: ", friend);

  const handleView = () => {
    console.log("clicked.");
    setSeeUserDetail((prev) => !prev);
  };
  useEffect(() => {
    if (friend && friend._id) {
      fetchMessages(friend._id);
    }
  }, [friend]);

  const fetchMessages = async (friendId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/chat/messages/${friendId}`
      );
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post("http://localhost:8000/api/chat/send", {
        receiverId: friend._id,
        message: newMessage,
      });

      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <>
      {friend ? (
        <>
          <div className="flex h-screen">
            {/* Main Chat Section */}
            <div className="flex flex-col flex-1  p-1 bg-gray-100">
              {/* Header Section */}
              <header className="bg-white p-4  shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    onClick={handleView}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 bg-slate-600 text-white rounded-full"
                  >
                    <span className="text-sm font-bold">JD</span>
                    {/* Conditionally render image if present */}
                  </div>
                  <h2 className="text-lg font-semibold">
                    {friend.name ? friend.name : "Jessica Drew"}
                  </h2>
                </div>
              </header>

              {/* Chat Messages Section */}
              {/* Chat Messages Section */}
              <main className="flex flex-col  flex-1 overflow-y-auto mt-4 space-y-4 gap-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`w-1/2 p-3 rounded-2xl shadow-sm ${
                      msg.sender === friend._id
                        ? "bg-white ml-1 text-left"
                        : "bg-blue-100 ml-auto mr-1 text-right"
                    }`}
                  >
                    <p className="text-gray-600 font-medium">{msg.message}</p>
                    <div className="text-gray-500 text-sm mt-1">
                      {new Date(msg.timeStamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </main>

              {/* Input Box Section for sending msg */}
              <footer className="m-2">
                <div className="flex items-center border-2 border-gray-300 rounded-lg p-2 bg-white">
                  <input
                    className="flex-1 outline-none p-2"
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <MdSend size={24} />
                  </button>
                </div>
              </footer>
            </div>

            {/* User Details Sidebar */}
            {seeUserDetail && (
              <aside className="w-64 bg-white p-4 border-l border-gray-200 shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 bg-slate-600 text-white rounded-full">
                    <span className="text-3xl font-bold">JD</span>
                    {/* Conditionally render image if present */}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold">
                    {friend ? friend.name : "Daina Moree"}
                  </h2>
                  <p className="text-gray-500">
                    {friend ? friend.phoneNumber : "9876543210"}
                  </p>
                  <p className="text-gray-500">
                    {friend ? friend.email : "dianomore@gmail.com"}
                  </p>
                </div>
                <hr className="my-4" />

                <button className="text-gray-400 hover:text-red-500">
                  Log-Out
                </button>
              </aside>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center  m-auto h-screen">
          <h2 className="text-4xl">Click on the chat to get Started</h2>
        </div>
      )}
    </>
  );
}

export default MainChatScreen;
