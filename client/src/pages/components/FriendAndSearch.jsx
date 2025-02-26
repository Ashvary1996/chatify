import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

function FriendAndSearch() {
  axios.defaults.withCredentials = true;

  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  console.log("sssssssssss", requests);

  const fetchFriendRequests = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/friend/fetch_requests"
      );

      if (data.requestsList && data.requestsList.length > 0) {
        const updatedRequests = await Promise.all(
          data.requestsList.map(async (req) => {
            const userName = await getName(req.sender);
            return { ...req, senderName: userName };
          })
        );

        setRequests({ ...data, requestsList: updatedRequests });
      } else {
        setRequests({ totalRequests: 0, requestsList: [] });
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  }, []);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  const getName = async (id) => {
    try {
      console.log("Fetching user with ID:", id);

      const response = await axios.post(
        "http://localhost:8000/api/user/get_user",
        { id }
      );

      return response.data.userName || "Unknown User"; // Ensure a fallback
    } catch (error) {
      console.error("Error fetching user:", error);
      return "Unknown User";
    }
  };

  const respondToRequest = async (id, status) => {
    console.log(id, status);
    console.log(`API URL: http://localhost:8000/api/friend/request/${id}`);
    try {
      await axios.put(`http://localhost:8000/api/friend/request/${id}`, {
        status,
      });

      setRequests((prev) => prev.requestsList.filter((req) => req._id !== id));
    } catch (error) {
      console.error("Error responding to friend request:", error);
    }
  };

  const searchFriends = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/user/search",
        {
          params: { query: input },
        }
      );
      setResults(data.length ? data : []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const sendFriendRequest = (userId) => {
    console.log("Friend request sent to:", userId);

    setFriendRequests((prev) => [...prev, userId]);
    try {
      axios.post("http://localhost:8000/api/friend/send_request", {
        receiverId: userId,
      });
    } catch (error) {
      console.log("error in sending friend Request", error);
    }
    console.log(userId);
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      {/* ////// */}

      {/* ////// */}
      <div className="mb-4 flex justify-between items-center flex-wrap">
        <h2 className="text-xl font-bold">✍️ Chatify</h2>

        <div className="flex justify-end w-full lg:w-auto mt-2 lg:mt-0">
          <div className="relative inline-block text-right">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
            >
              Friend Requests: {requests.totalRequests}
            </button>

            {isOpen && (
              <div className="absolute mt-2 w-64 sm:w-72 md:w-80 lg:w-96 bg-white border shadow-lg rounded-lg max-h-60 sm:max-h-80 overflow-y-auto ">
                {requests.totalRequests > 0 ? (
                  requests.requestsList.map((req, i) => (
                    <div
                      key={i}
                      className="p-2 border-b flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            req.sender.profile_image ||
                            "https://via.placeholder.com/40"
                          }
                          alt="profile"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{req.senderName}</span>
                      </div>
                      <div>
                        <button
                          onClick={() => respondToRequest(req._id, "accepted")}
                          className="bg-green-500 text-white px-2 py-1 rounded-md text-xs mx-1"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respondToRequest(req._id, "rejected")}
                          className="bg-red-500 text-white px-2 py-1 rounded-md text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center p-2 text-gray-500">
                    No friend requests
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <input
        className="bg-orange-50 rounded-2xl p-2 outline-none border focus:ring-1 focus:ring-blue-500 w-full mt-2"
        type="search"
        placeholder="🔍 Search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchFriends(e)}
        title="Hit Enter to Find"
      />

      {/* Search Results Dropdown */}
      {input && (
        <div className="absolute bg-white border shadow-lg rounded-lg mt-1   max-h-60 overflow-y-auto w-1/4">
          {results.length > 0 ? (
            results.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 border-b hover:bg-gray-100"
              >
                {/* Profile Image */}
                <div className="flex items-center">
                  <img
                    src={user.profilePic || "https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <h3 className="text-sm font-semibold">{user.name}</h3>
                </div>
                {/* Add Friend Button */}
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md text-xs"
                >
                  Add Friend
                </button>
              </div>
            ))
          ) : (
            <p className="text-center p-2 text-gray-500">No one found</p>
          )}
        </div>
      )}

      <hr className="my-4" />

      {/* Friend List Item */}
      <div className="flex items-center justify-between p-2 border rounded-lg shadow-md bg-white hover:bg-slate-50 cursor-pointer">
        {/* Left Div: Profile Image */}
        <div className="flex items-center relative justify-center w-10 h-10 bg-slate-600 text-white rounded-full">
          <span className="text-xs absolute top-[-5px] right-[-5px]">🟢</span>
          <span className="text-sm font-bold">JD</span>
        </div>

        {/* Middle Div: Name and Message */}
        <div className="flex flex-col flex-1 mx-4">
          <h2 className="text-lg font-semibold text-left">Jessica Drew</h2>
          <p className="text-gray-600 text-left">
            Lorem ipsum dolor sit amet consectetur adipisicing elit...
          </p>
        </div>

        {/* Right Div: Time and Notification */}
        <div className="text-right flex flex-col items-end">
          <span className="text-gray-500 text-sm block">8:30 PM</span>
          <span className="bg-blue-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-1">
            2
          </span>
        </div>
      </div>
    </div>
  );
}

export default FriendAndSearch;
