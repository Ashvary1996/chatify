import React from "react";
import FriendAndSearch from "./components/FriendAndSearch";
import MainChatScreen from "./components/MainChatScreen";

function Home() {
  return (
    <div className="flex">
      
     
      <div className="w-1/4">
        <FriendAndSearch />
      </div>
      <div className="w-3/4">
        <MainChatScreen />
      </div>
    </div>
  );
}

export default Home;
