import React, { useCallback, useEffect, useState } from "react";
import FriendAndSearch from "./components/FriendAndSearch";
import MainChatScreen from "./components/MainChatScreen";
import axios from "axios";
import io from "socket.io-client";

function Home() {
  const socket = io(process.env.REACT_APP_SERVER_HOST_URL);
  axios.defaults.baseURL = process.env.REACT_APP_SERVER_HOST_URL;
  axios.defaults.withCredentials = true;

  const [myFriends, setMyFriends] = useState([]);
  const [myFriendsDetails, setMyFriendsDetails] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState("");
  const [mydata, setmyData] = useState({});

  // console.log("selected_Friend:", friend);
  // console.log("Friends:", myFriends);
  // console.log("Friend Details:", myFriendsDetails);
  // console.log("Messages:", messages);
  // console.log("mydata :", mydata._id);
  const getMyDetails = async () => {
    const data = await axios.put("/api/user/me");
    setmyData(data.data.user);
    console.log("------", data.data.user._id);

    // Emit "user online" event to the server
    socket.emit("user online", data.data.user._id);
    // Set isOnline to true when the app loads or user logs in
    await axios.put("/api/user/me", {
      socketId: socket.id,
    });
    // console.log(data.data.user);
  };

  const setOfflineStatus = async () => {
    try {
      await axios.put("/api/user/me", {
        isOnline: false,
      });
      console.log("User is now offline");
    } catch (error) {
      console.error("Error setting offline status:", error);
    }
  };

  useEffect(() => {
    getMyDetails();

    return () => {
      if (mydata._id) {
        socket.emit("disconnect", mydata.id);
      }
    };
  }, []);

  const fetchMyFriends = async () => {
    try {
      const { data } = await axios.get("/api/friend/list");
      setMyFriends(data);
    } catch (error) {
      console.log("Error fetching friends:", error);
    }
  };

  const fetchUserDetails = useCallback(async () => {
    try {
      const usersData = await Promise.all(
        myFriends.map(async (friend) => {
          const response = await axios.post("/api/user/get_user", {
            id: friend._id,
          });
          return { _id: friend._id, name: response.data.name };
        })
      );

      setMyFriendsDetails(usersData);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  }, [myFriends]);
  const handleFriendSelect = (data) => {
    setFriend(data);
    // console.log(data);
  };

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/chat/allmessages");

      const userMap = myFriendsDetails.reduce((acc, user) => {
        acc[user._id] = user.name;
        return acc;
      }, {});

      const formattedMessages = data.map((msg) => ({
        ...msg,
        senderName: userMap[msg.sender] || "Unknown",
        receiverName: userMap[msg.receiver] || "Unknown",
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  }, []);

  useEffect(() => {
    fetchMyFriends();
    getMyDetails();
  }, []);

  useEffect(() => {
    if (myFriends.length > 0) {
      fetchMessages();
      fetchUserDetails();
    }
  }, [myFriends, fetchMessages, fetchUserDetails]);

  return (
    <div className="flex">
      <div className="w-1/4">
        <FriendAndSearch
          myFriends={myFriends}
          onFriendSelect={handleFriendSelect}
        />
      </div>
      <div className="w-3/4">
        <MainChatScreen messages={messages} friend={friend} mydata={mydata} />
      </div>
    </div>
  );
}

export default Home;
