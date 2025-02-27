import React, { useEffect, useState } from "react";
import FriendAndSearch from "./components/FriendAndSearch";
import MainChatScreen from "./components/MainChatScreen";
import axios from "axios";

function Home() {
  const [myFriends, setMyFriends] = useState([]);
  const [myFriendsDetails, setMyFriendsDetails] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState("");

  console.log("selected_Friend:", friend);
  // console.log("Friends:", myFriends);
  // console.log("Friend Details:", myFriendsDetails);
  // console.log("Messages:", messages);

  const handleFriendSelect = (data) => {
    setFriend(data);
    console.log(data);
  };

  useEffect(() => {
    fetchMyFriends();
  }, []);

  useEffect(() => {
    if (myFriends.length > 0) {
      fetchMessages();
      fetchUserDetails();
    }
  }, [myFriends]);

  // Fetch friend list
  const fetchMyFriends = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/friend/list");
      setMyFriends(data);
    } catch (error) {
      console.log("Error fetching friends:", error);
    }
  };

  // Fetch user details for friends
  const fetchUserDetails = async () => {
    try {
      const usersData = await Promise.all(
        myFriends.map(async (friend) => {
          const response = await axios.post(
            "http://localhost:8000/api/user/get_user",
            { id: friend._id }
          );
          return { _id: friend._id, name: response.data.name };
        })
      );

      setMyFriendsDetails(usersData);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/chat/allmessages"
      );

      // Create a lookup map for user IDs to names
      const userMap = myFriendsDetails.reduce((acc, user) => {
        acc[user._id] = user.name;
        return acc;
      }, {});

      // Replace sender & receiver IDs with real names
      const formattedMessages = data.map((msg) => ({
        ...msg,
        senderName: userMap[msg.sender] || "Unknown",
        receiverName: userMap[msg.receiver] || "Unknown",
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <FriendAndSearch
          myFriends={myFriends}
          onFriendSelect={handleFriendSelect}
        />
      </div>
      <div className="w-3/4">
        <MainChatScreen messages={messages} friend={friend} />
      </div>
    </div>
  );
}

export default Home;
