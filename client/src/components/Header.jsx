import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  const handleExit = () => {
    sessionStorage.removeItem("username");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-teal-600 text-white p-4 flex justify-between items-center z-10">
      <h1 className="text-2xl font-bold">Chatify</h1>
      <div className="flex items-center space-x-4">
        {username && <span className="text-lg">{username}</span>}
        {username && (
          <button
            onClick={handleExit}
            className="bg-red-500 px-4 py-2 rounded-md"
          >
            Exit
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
